/* ==========================================================================
   Auth — JWT in an httpOnly cookie, backed by a Session row.

   The token is signed with a `jti` that points at a row in the sessions
   collection. Verifying the signature is not enough: the row must still exist
   and must not have gone idle. That is what makes "only one admin at a time"
   enforceable — a stateless JWT can never be revoked, a session row can be
   deleted.
   ========================================================================== */
const crypto = require('node:crypto');
const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

const COOKIE_NAME = 'tp_admin';
const TOKEN_TTL   = '7d';
const MAX_AGE_MS  = 7 * 24 * 60 * 60 * 1000;

/* Writing lastSeenAt on literally every request would mean a database write
   per keystroke in the editor. The heartbeat only needs to be fresh relative
   to the 15-minute idle window. */
const HEARTBEAT_INTERVAL_MS = 30 * 1000;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    console.error('\n  FATAL: JWT_SECRET is missing or shorter than 16 characters.');
    console.error('  Copy .env.example to .env and set a long random value.\n');
    process.exit(1);
  }
  return secret;
}

const newJti = () => crypto.randomBytes(24).toString('hex');

const signToken = (user, jti) =>
  jwt.sign({ sub: String(user._id), role: user.role, jti }, getSecret(), { expiresIn: TOKEN_TTL });

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   MAX_AGE_MS,
    path:     '/',
  });
}

const clearAuthCookie = (res) => res.clearCookie(COOKIE_NAME, {
  path: '/',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure:   process.env.NODE_ENV === 'production',
});

/**
 * Creates a session row and returns the token to hand to the browser.
 * `grantedByApproval` records that another admin let this one in.
 */
async function issueSession(user, req, { grantedByApproval = false } = {}) {
  const jti = newJti();
  await Session.create({
    jti,
    user: user._id,
    username: user.username,
    name: user.name || '',
    lastSeenAt: new Date(),
    grantedByApproval,
    userAgent: String(req.get('user-agent') || '').slice(0, 300),
    ip: req.ip || '',
  });
  return signToken(user, jti);
}

/** Ends one session. Its holder's next request is rejected as unauthenticated. */
const revokeSession = (jti) => Session.deleteOne({ jti });

/**
 * Populates req.user and req.session when a valid, live session cookie is
 * present. Never rejects — `protect` decides what to do about it.
 */
async function loadUser(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next();

  try {
    const payload = jwt.verify(token, getSecret());

    /* Signature is fine, but the session may have been revoked or gone idle
       since the token was issued. */
    if (!payload.jti) return next();

    const session = await Session.findOne({ jti: payload.jti }).lean();
    if (!session) {
      req.sessionEnded = 'revoked';
      return next();
    }

    const idleFor = Date.now() - new Date(session.lastSeenAt).getTime();
    if (idleFor > Session.IDLE_TIMEOUT_MS) {
      /* Reap it here rather than waiting on Mongo's TTL monitor, so the lock
         is released the moment anyone notices it has lapsed. */
      await Session.deleteOne({ jti: payload.jti });
      req.sessionEnded = 'idle';
      return next();
    }

    const user = await User.findById(payload.sub).lean();
    if (!user) return next();

    req.user = user;
    req.session = session;

    /* Heartbeat — throttled so ordinary browsing is not one write per click. */
    if (idleFor > HEARTBEAT_INTERVAL_MS) {
      Session.updateOne({ jti: payload.jti }, { lastSeenAt: new Date() }).catch(() => {});
    }
  } catch {
    /* expired or tampered — treated as logged out */
  }
  next();
}

/** Gate for every /api/admin route. */
function protect(req, res, next) {
  if (!req.user) {
    if (req.sessionEnded === 'idle') {
      return res.status(401).json({
        error: 'Your session ended after 15 minutes of inactivity. Please sign in again.',
        code: 'SESSION_IDLE',
      });
    }
    if (req.sessionEnded === 'revoked') {
      return res.status(401).json({
        error: 'You were signed out of the admin panel.',
        code: 'SESSION_REVOKED',
      });
    }
    return res.status(401).json({ error: 'Authentication required', code: 'NO_SESSION' });
  }
  next();
}

module.exports = {
  COOKIE_NAME,
  signToken,
  issueSession,
  revokeSession,
  setAuthCookie,
  clearAuthCookie,
  loadUser,
  protect,
};

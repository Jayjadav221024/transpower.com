/* ==========================================================================
   Auth — JWT in an httpOnly cookie
   ========================================================================== */
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'tp_admin';
const TOKEN_TTL   = '7d';
const MAX_AGE_MS  = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    console.error('\n  FATAL: JWT_SECRET is missing or shorter than 16 characters.');
    console.error('  Copy .env.example to .env and set a long random value.\n');
    process.exit(1);
  }
  return secret;
}

const signToken = (user) =>
  jwt.sign({ sub: String(user._id), role: user.role }, getSecret(), { expiresIn: TOKEN_TTL });

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

/** Populates req.user when a valid cookie is present. Never rejects. */
async function loadUser(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next();

  try {
    const payload = jwt.verify(token, getSecret());
    req.user = await User.findById(payload.sub).lean();
  } catch {
    /* expired or tampered — treated as logged out */
  }
  next();
}

/** Gate for every /api/admin route. */
function protect(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  next();
}

module.exports = { COOKIE_NAME, signToken, setAuthCookie, clearAuthCookie, loadUser, protect };

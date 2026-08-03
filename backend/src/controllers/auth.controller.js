/* ==========================================================================
   Admin authentication with a single-occupancy lock.

   Rules:
     • The first admin to sign in holds the panel.
     • Anyone else — including the same account on another device — is refused
       with 409 and told who is signed in.
     • They may raise an access request. The holder sees it and accepts or
       denies. On accept, the requester gets their own session; both admins
       stay signed in.
     • A session that goes 15 minutes without activity stops holding the lock,
       so a closed browser cannot lock anybody out permanently.
   ========================================================================== */
const crypto = require('node:crypto');

const User = require('../models/User');
const Session = require('../models/Session');
const AccessRequest = require('../models/AccessRequest');
const { asyncHandler } = require('../middleware/error');
const {
  issueSession,
  revokeSession,
  setAuthCookie,
  clearAuthCookie,
} = require('../middleware/auth');

const publicUser = (u) => ({ id: u._id, username: u.username, name: u.name, role: u.role });

const describeHolder = (s) => ({
  username: s.username,
  name: s.name || s.username,
  since: s.createdAt,
  lastSeenAt: s.lastSeenAt,
});

/* Credential checks must not leak whether a username exists, so both the
   missing-user and wrong-password paths return the same thing. */
async function verifyCredentials(body) {
  const username = String(body?.username || '').trim().toLowerCase();
  const password = String(body?.password || '');
  if (!username || !password) return { error: 'Username and password are required', status: 400 };

  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return { error: 'Invalid username or password', status: 401 };
  }
  return { user };
}

/* POST /api/admin/login */
const login = asyncHandler(async (req, res) => {
  const { user, error, status } = await verifyCredentials(req.body);
  if (error) return res.status(status).json({ error });

  const active = await Session.findActive();

  if (active.length > 0) {
    const holder = describeHolder(active[0]);
    const isSelf = holder.username === user.username;

    return res.status(409).json({
      code: 'SESSION_ACTIVE',
      error: isSelf
        ? `This account is already signed in on another device (active ${minutesAgo(holder.lastSeenAt)}). Log out there first, or request access and approve it from that device.`
        : `${holder.name} is currently signed in to the admin panel. Ask them to log out first, or request access and they can approve it.`,
      holder,
      isSelf,
      /* Surfaced so the UI can tell the user how long the wait could be. */
      idleTimeoutMinutes: Math.round(Session.IDLE_TIMEOUT_MS / 60000),
    });
  }

  setAuthCookie(res, await issueSession(user, req));
  res.json({ user: publicUser(user) });
});

function minutesAgo(date) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (mins < 1) return 'just now';
  return `${mins} minute${mins === 1 ? '' : 's'} ago`;
}

/* POST /api/admin/access-request
   The requester re-supplies their password: a pending request must never be
   something an anonymous visitor can spam at the signed-in admin. */
const requestAccess = asyncHandler(async (req, res) => {
  const { user, error, status } = await verifyCredentials(req.body);
  if (error) return res.status(status).json({ error });

  const active = await Session.findActive();
  if (active.length === 0) {
    /* The lock lapsed between the failed login and this call — just let them in. */
    setAuthCookie(res, await issueSession(user, req));
    return res.json({ granted: true, user: publicUser(user) });
  }

  /* One live request per account, so repeated clicks don't stack up prompts. */
  await AccessRequest.updateMany(
    { user: user._id, status: 'pending' },
    { status: 'expired' },
  );

  const request = await AccessRequest.create({
    ticket: crypto.randomBytes(24).toString('hex'),
    user: user._id,
    username: user.username,
    name: user.name || '',
    status: 'pending',
    userAgent: String(req.get('user-agent') || '').slice(0, 300),
    ip: req.ip || '',
    expiresAt: new Date(Date.now() + AccessRequest.REQUEST_TTL_MS),
  });

  res.status(202).json({
    granted: false,
    ticket: request.ticket,
    expiresAt: request.expiresAt,
    holder: describeHolder(active[0]),
    pollAfterMs: 2000,
  });
});

/* GET /api/admin/access-request/:ticket — polled by the waiting requester.
   Public by design: the ticket is the only credential they hold right now. */
const pollAccessRequest = asyncHandler(async (req, res) => {
  const request = await AccessRequest.findOne({ ticket: String(req.params.ticket || '') });
  if (!request) return res.status(404).json({ error: 'That access request no longer exists.' });

  if (request.status === 'pending' && request.expiresAt.getTime() <= Date.now()) {
    request.status = 'expired';
    await request.save();
  }

  if (request.status === 'approved') {
    const user = await User.findById(request.user);
    if (!user) return res.status(404).json({ error: 'That account no longer exists.' });

    /* Single-use: burn the ticket as the session is handed over, so a leaked
       ticket cannot be replayed into a second session later. */
    request.status = 'claimed';
    await request.save();

    setAuthCookie(res, await issueSession(user, req, { grantedByApproval: true }));
    return res.json({ status: 'approved', user: publicUser(user), decidedBy: request.decidedBy });
  }

  res.json({
    status: request.status,
    decidedBy: request.decidedBy || null,
    expiresAt: request.expiresAt,
  });
});

/* DELETE /api/admin/access-request/:ticket — requester gave up waiting. */
const cancelAccessRequest = asyncHandler(async (req, res) => {
  await AccessRequest.updateOne(
    { ticket: String(req.params.ticket || ''), status: 'pending' },
    { status: 'expired' },
  );
  res.json({ ok: true });
});

/* GET /api/admin/access-requests — polled by the admin holding the panel. */
const listAccessRequests = asyncHandler(async (_req, res) => {
  const pending = await AccessRequest.findPending();
  res.json({
    requests: pending.map((r) => ({
      id: r._id,
      username: r.username,
      name: r.name || r.username,
      requestedAt: r.createdAt,
      expiresAt: r.expiresAt,
      userAgent: r.userAgent,
    })),
  });
});

/* POST /api/admin/access-requests/:id/approve */
const approveAccessRequest = asyncHandler(async (req, res) => {
  const request = await AccessRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  if (request.status !== 'pending') {
    return res.status(409).json({ error: `That request was already ${request.status}.` });
  }
  if (request.expiresAt.getTime() <= Date.now()) {
    request.status = 'expired';
    await request.save();
    return res.status(410).json({ error: 'That request expired before it was answered.' });
  }

  request.status = 'approved';
  request.decidedBy = req.user.name || req.user.username;
  request.decidedAt = new Date();
  await request.save();

  res.json({ ok: true, status: 'approved' });
});

/* POST /api/admin/access-requests/:id/deny */
const denyAccessRequest = asyncHandler(async (req, res) => {
  const request = await AccessRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  if (request.status !== 'pending') {
    return res.status(409).json({ error: `That request was already ${request.status}.` });
  }

  request.status = 'denied';
  request.decidedBy = req.user.name || req.user.username;
  request.decidedAt = new Date();
  await request.save();

  res.json({ ok: true, status: 'denied' });
});

/* GET /api/admin/sessions — who else is in the panel right now. */
const listSessions = asyncHandler(async (req, res) => {
  const active = await Session.findActive();
  res.json({
    sessions: active.map((s) => ({
      id: s._id,
      username: s.username,
      name: s.name || s.username,
      since: s.createdAt,
      lastSeenAt: s.lastSeenAt,
      grantedByApproval: s.grantedByApproval,
      isCurrent: s.jti === req.session?.jti,
    })),
    idleTimeoutMinutes: Math.round(Session.IDLE_TIMEOUT_MS / 60000),
  });
});

/* POST /api/admin/logout */
const logout = asyncHandler(async (req, res) => {
  if (req.session?.jti) await revokeSession(req.session.jti);
  clearAuthCookie(res);
  res.json({ ok: true });
});

/* GET /api/admin/me */
const me = (req, res) => res.json({
  user: publicUser(req.user),
  session: req.session
    ? { since: req.session.createdAt, grantedByApproval: req.session.grantedByApproval }
    : null,
});

/* POST /api/admin/change-password */
const changePassword = asyncHandler(async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword     = String(req.body?.newPassword || '');

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  user.password = newPassword;      // pre-save hook re-hashes
  await user.save();

  /* A password change invalidates everyone else's session for this account —
     the point of changing it is usually to lock somebody out. */
  await Session.deleteMany({ user: user._id, jti: { $ne: req.session?.jti } });

  res.json({ ok: true });
});

module.exports = {
  login,
  logout,
  me,
  changePassword,
  requestAccess,
  pollAccessRequest,
  cancelAccessRequest,
  listAccessRequests,
  approveAccessRequest,
  denyAccessRequest,
  listSessions,
};

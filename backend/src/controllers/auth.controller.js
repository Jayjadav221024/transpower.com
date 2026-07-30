const User = require('../models/User');
const { asyncHandler } = require('../middleware/error');
const { signToken, setAuthCookie, clearAuthCookie } = require('../middleware/auth');

const publicUser = (u) => ({ id: u._id, username: u.username, name: u.name, role: u.role });

/* POST /api/admin/login */
const login = asyncHandler(async (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  setAuthCookie(res, signToken(user));
  res.json({ user: publicUser(user) });
});

/* POST /api/admin/logout */
const logout = (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
};

/* GET /api/admin/me */
const me = (req, res) => res.json({ user: publicUser(req.user) });

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
  res.json({ ok: true });
});

module.exports = { login, logout, me, changePassword };

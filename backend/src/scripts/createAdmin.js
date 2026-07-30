/* ==========================================================================
   Creates (or resets the password of) an admin user.

     npm run create-admin -- <username> <password> "[Display Name]"
   ========================================================================== */
require('dotenv').config();

const mongoose  = require('mongoose');
const connectDB = require('../config/db');
const User      = require('../models/User');

const [, , rawUser, password, displayName] = process.argv;

(async function run() {
  if (!rawUser || !password) {
    console.error('\n  Usage: npm run create-admin -- <username> <password> "[Display Name]"\n');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('\n  Password must be at least 8 characters.\n');
    process.exit(1);
  }

  await connectDB();

  const username = rawUser.trim().toLowerCase();
  const name     = displayName || rawUser;
  const existing = await User.findOne({ username });

  if (existing) {
    existing.password = password;   // pre-save hook hashes it
    existing.name     = name;
    await existing.save();
    console.log(`\n  Password updated for existing admin "${username}".\n`);
  } else {
    await User.create({ username, password, name, role: 'admin' });
    console.log(`\n  Admin "${username}" created. Log in at the /admin route of the site.\n`);
  }

  await mongoose.disconnect();
})();

/* ==========================================================================
   Entry point — connect to MongoDB, then listen
   ========================================================================== */
require('dotenv').config();

const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const User = require('./models/User');

(async function start() {
  await connectDB();

  // Auto-seed or update default admin credentials on startup
  try {
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      await User.create({
        username: 'admin',
        password: 'Transpower@2026',
        name: 'Transpower Admin',
        role: 'admin'
      });
      console.log('  Seeded default admin user successfully.');
    } else {
      adminUser.password = 'Transpower@2026';
      await adminUser.save();
      console.log('  Admin credentials updated successfully.');
    }
  } catch (err) {
    console.error('  Error auto-seeding admin user:', err);
  }

  app.listen(PORT, () => {
    console.log(`\n  Transpower API listening on http://localhost:${PORT}`);
    console.log(`  Health check              http://localhost:${PORT}/api/health`);
    console.log(`  React dev server          ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}\n`);
  });
})();

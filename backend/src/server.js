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

  /* Seed the first admin only when no account exists.
   *
   * This used to reset the password to a literal written in this file on every
   * single boot. Two problems, both of which matter once the site is public: the
   * credential is readable by anyone with the repository, and it could not be
   * changed — `npm run create-admin` worked, then the next restart or deploy
   * silently put the old password back. */
  try {
    const existing = await User.findOne({ username: 'admin' }).select('_id');

    if (existing) {
      console.log('  Admin account present — password left as it was set.');
    } else {
      const seedPassword = process.env.ADMIN_SEED_PASSWORD;
      if (!seedPassword || seedPassword.length < 8) {
        console.warn(
          '  No admin account exists yet. Set ADMIN_SEED_PASSWORD (8+ characters) and restart,\n' +
          '  or create one directly:  node src/scripts/createAdmin.js <username> <password> "Name"'
        );
      } else {
        await User.create({
          username: 'admin',
          password: seedPassword,   // hashed by the model's pre-save hook
          name: 'Transpower Admin',
          role: 'admin'
        });
        console.log('  Seeded the initial admin account from ADMIN_SEED_PASSWORD.');
      }
    }
  } catch (err) {
    console.error('  Error seeding admin user:', err);
  }

  // Auto-clean any generic image overrides from page content to prevent visual customisation bugs clobbering slides
  try {
    const PageContent = require('./models/PageContent');
    const pages = await PageContent.find({});
    for (const page of pages) {
      if (page.content && page.content.overrides) {
        let changed = false;
        const newOverrides = { ...page.content.overrides };
        Object.keys(newOverrides).forEach((key) => {
          if (key.includes('img') || key.includes('is-active')) {
            delete newOverrides[key];
            changed = true;
          }
        });
        if (changed) {
          page.content.overrides = newOverrides;
          page.markModified('content');
          await page.save();
          console.log(`  Cleaned generic image overrides from page: ${page.key}`);
        }
      }
    }
  } catch (err) {
    console.error('  Error cleaning up page overrides:', err);
  }

  app.listen(PORT, () => {
    console.log(`\n  Transpower API listening on http://localhost:${PORT}`);
    console.log(`  Health check              http://localhost:${PORT}/api/health`);
    console.log(`  React dev server          ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}\n`);
  });
})();

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

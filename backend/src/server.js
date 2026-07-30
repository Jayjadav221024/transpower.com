/* ==========================================================================
   Entry point — connect to MongoDB, then listen
   ========================================================================== */
require('dotenv').config();

const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n  Transpower API listening on http://localhost:${PORT}`);
    console.log(`  Health check              http://localhost:${PORT}/api/health`);
    console.log(`  React dev server          ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}\n`);
  });
})();

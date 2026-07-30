/* ==========================================================================
   Zero-setup development mode.

   Boots an in-memory MongoDB (downloaded once by mongodb-memory-server), seeds
   an admin account, and starts the API. Nothing is persisted — every restart
   is a clean database. Use `npm start` against a real MONGODB_URI for anything
   you want to keep.

     npm run dev:memory
   ========================================================================== */
require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const DEV_USER = process.env.DEV_ADMIN_USER || 'admin';
const DEV_PASS = process.env.DEV_ADMIN_PASS || 'Transpower@2026';

(async function run() {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('transpower');
  process.env.JWT_SECRET  = process.env.JWT_SECRET || 'dev-only-secret-not-for-production-use';

  const connectDB = require('../config/db');
  const User      = require('../models/User');
  const app       = require('../app');

  await connectDB();
  await User.create({ username: DEV_USER, password: DEV_PASS, name: 'Transpower Admin', role: 'admin' });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n  IN-MEMORY DEV MODE — all data is discarded on exit.`);
    console.log(`  API      http://localhost:${PORT}`);
    console.log(`  Login    ${DEV_USER} / ${DEV_PASS}\n`);
  });

  const shutdown = async () => {
    await mongoose.disconnect();
    await mongo.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();

/* ==========================================================================
   MongoDB connection (Mongoose)
   ========================================================================== */
const mongoose = require('mongoose');

async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    console.error('\n  FATAL: MONGODB_URI is not set.');
    console.error('  Copy .env.example to .env and point it at a MongoDB instance');
    console.error('  (local mongod, Docker, or a free MongoDB Atlas cluster).\n');
    process.exit(1);
  }

  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`  MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`\n  FATAL: could not connect to MongoDB — ${err.message}`);
    console.error('  Is mongod running, or is your Atlas URI / IP allowlist correct?\n');
    process.exit(1);
  }
}

module.exports = connectDB;

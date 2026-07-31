require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const PageContent = require('../models/PageContent');

(async () => {
  await connectDB();
  const page = await PageContent.findOne({ key: 'homepage' });
  console.log('--- HOMEPAGE CONTENT IN DB ---');
  console.log(JSON.stringify(page, null, 2));
  console.log('------------------------------');
  await mongoose.disconnect();
})();

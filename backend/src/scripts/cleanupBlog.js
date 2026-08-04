require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Post = require('../models/Post');

async function run() {
  await connectDB();

  // 1. Delete duplicate test post
  const deleteResult = await Post.deleteOne({ slug: 'authorized-crompton-greaves-motor-supplier-vadodara-2' });
  console.log(`Deleted duplicate post count: ${deleteResult.deletedCount}`);

  // 2. Fix the MCCB vs ACB post title and date
  // Slug is likely: mccb-vs-acb-which-siemens-switchgear-is-right-for-your-facility or similar
  const mccbPost = await Post.findOne({
    $or: [
      { slug: /mccb-vs-acb/i },
      { title: /mccb vs acb/i }
    ]
  });

  if (mccbPost) {
    mccbPost.title = "MCCB vs ACB: Which Siemens Switchgear Is Right for Your Facility?";
    mccbPost.publishedAt = new Date('2026-06-24T00:00:00Z');
    await mccbPost.save();
    console.log(`Updated MCCB vs ACB post: ${mccbPost.title} published on ${mccbPost.publishedAt.toISOString()}`);
  } else {
    console.log('MCCB vs ACB post not found in DB');
  }

  await mongoose.disconnect();
  console.log('Database disconnected.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

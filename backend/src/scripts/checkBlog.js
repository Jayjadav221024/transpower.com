require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Post = require('../models/Post');

async function run() {
  await connectDB();
  const posts = await Post.find().select('title slug publishedAt').sort({ publishedAt: -1 });
  console.log(`\nFound ${posts.length} posts in the database:`);
  posts.forEach((p, i) => {
    console.log(`${i+1}. [${p.slug}] - ${p.title} (${p.publishedAt?.toISOString()})`);
  });
  await mongoose.disconnect();
}

run().catch(console.error);

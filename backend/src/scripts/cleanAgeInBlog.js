require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Post = require('../models/Post');

async function run() {
  await connectDB();
  
  // Search for any posts containing "70 years" or "seven decades" or "7 decades"
  const posts = await Post.find({
    $or: [
      { content: /70 years/i },
      { content: /7 decades/i },
      { content: /seven decades/i },
      { excerpt: /70 years/i },
      { excerpt: /7 decades/i },
      { excerpt: /seven decades/i }
    ]
  });

  console.log(`Found ${posts.length} posts with matching age references.`);

  for (const post of posts) {
    let changed = false;
    
    if (/70 years/i.test(post.content)) {
      post.content = post.content.replace(/70 years/gi, '60 years');
      changed = true;
    }
    if (/7 decades/i.test(post.content)) {
      post.content = post.content.replace(/7 decades/gi, 'six decades');
      changed = true;
    }
    if (/seven decades/i.test(post.content)) {
      post.content = post.content.replace(/seven decades/gi, 'six decades');
      changed = true;
    }

    if (/70 years/i.test(post.excerpt)) {
      post.excerpt = post.excerpt.replace(/70 years/gi, '60 years');
      changed = true;
    }
    if (/7 decades/i.test(post.excerpt)) {
      post.excerpt = post.excerpt.replace(/7 decades/gi, 'six decades');
      changed = true;
    }
    if (/seven decades/i.test(post.excerpt)) {
      post.excerpt = post.excerpt.replace(/seven decades/gi, 'six decades');
      changed = true;
    }

    if (changed) {
      await post.save();
      console.log(`Updated post: [${post.slug}] - ${post.title}`);
    }
  }

  await mongoose.disconnect();
  console.log('Database disconnected.');
}

run().catch(console.error);

const Post = require('../models/Post');
const { asyncHandler } = require('../middleware/error');

/* ─── Shaping ────────────────────────────────────────────────────────────── */

/** Rough reading time in whole minutes, at 220 words per minute. */
function readingTime(html) {
  const plain = String(html || '').replace(/<[^>]*>/g, ' ').trim();
  if (!plain) return 1;
  return Math.max(1, Math.round(plain.split(/\s+/).length / 220));
}

function shape(doc, { withContent = true } = {}) {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;
  const out = {
    id:          p._id,
    slug:        p.slug,
    title:       p.title,
    excerpt:     p.excerpt,
    coverImage:  p.coverImage,
    coverAlt:    p.coverAlt || '',
    tags:        p.tags || [],
    status:      p.status,
    views:       p.views,
    readTime:    readingTime(p.content),
    author:      p.author?.name || '',
    createdAt:   p.createdAt,
    updatedAt:   p.updatedAt,
    publishedAt: p.publishedAt,
  };
  if (withContent) out.content = p.content;
  return out;
}

/** Falls back to the first ~180 chars of the body when no excerpt is given. */
function autoExcerpt(excerpt, content) {
  if (excerpt) return excerpt;
  const plain = String(content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > 180 ? `${plain.slice(0, 180).trimEnd()}…` : plain;
}

/** Accepts "a, b" or ["a","b"] and normalises to a clean array. */
function normaliseTags(raw) {
  const list = Array.isArray(raw) ? raw : String(raw ?? '').split(',');
  return list.map((t) => String(t).trim()).filter(Boolean).slice(0, 12);
}

/* Escapes user input before it goes into a RegExp. */
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ==========================================================================
   PUBLIC
   ========================================================================== */

/* GET /api/posts?page=&limit=&tag=&q= */
const listPublished = asyncHandler(async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9));
  const tag   = String(req.query.tag || '').trim();
  const q     = String(req.query.q || '').trim();

  const filter = { status: 'published' };
  if (tag) filter.tags = tag;
  if (q) {
    const re = new RegExp(escapeRe(q), 'i');
    filter.$or = [{ title: re }, { excerpt: re }, { content: re }];
  }

  /* `content` is read so readTime can be derived, then dropped by shape(). */
  const [docs, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments(filter),
  ]);

  res.json({
    posts: docs.map((d) => shape(d, { withContent: false })),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
});

/* GET /api/posts/tags */
const listTags = asyncHandler(async (_req, res) => {
  const tags = await Post.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $project: { _id: 0, name: '$_id', count: 1 } },
  ]);
  res.json({ tags });
});

/* GET /api/posts/:slug */
const getBySlug = asyncHandler(async (req, res) => {
  const s = req.params.slug;
  const post = await Post.findOneAndUpdate(
    { 
      $or: [
        { slug: s },
        { slug: `https-www-transpower-net-in-${s}` }
      ],
      status: 'published' 
    },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'name');

  if (!post) return res.status(404).json({ error: 'Post not found' });

  const related = await Post.find({ status: 'published', _id: { $ne: post._id } })
    .sort({ publishedAt: -1 })
    .limit(3);

  res.json({
    post: shape(post),
    related: related.map((d) => shape(d, { withContent: false })),
  });
});

/* ==========================================================================
   ADMIN
   ========================================================================== */

/* GET /api/admin/posts?status=&q= */
const listAll = asyncHandler(async (req, res) => {
  const status = String(req.query.status || 'all').toLowerCase();
  const q      = String(req.query.q || '').trim();

  const filter = {};
  if (['draft', 'published'].includes(status)) filter.status = status;
  if (q) filter.title = new RegExp(escapeRe(q), 'i');

  const [docs, agg] = await Promise.all([
    Post.find(filter).select('-content').populate('author', 'name').sort({ updatedAt: -1 }).limit(200),
    Post.aggregate([
      {
        $group: {
          _id: null,
          total:     { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
          drafts:    { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
          views:     { $sum: '$views' },
        },
      },
    ]),
  ]);

  const s = agg[0] || {};
  res.json({
    posts: docs.map((d) => shape(d, { withContent: false })),
    stats: {
      total:     s.total     || 0,
      published: s.published || 0,
      drafts:    s.drafts    || 0,
      views:     s.views     || 0,
    },
  });
});

/* GET /api/admin/posts/:id */
const getById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name');
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ post: shape(post) });
});

/* POST /api/admin/posts */
const create = asyncHandler(async (req, res) => {
  const b = req.body || {};
  const title = String(b.title || '').trim();
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const content = String(b.content ?? '');

  const post = await Post.create({
    title,
    slug:       await Post.uniqueSlug(b.slug || title),
    content,
    excerpt:    autoExcerpt(String(b.excerpt ?? '').trim(), content),
    coverImage: String(b.coverImage ?? '').trim(),
    coverAlt:   String(b.coverAlt ?? '').trim().slice(0, 200),
    tags:       normaliseTags(b.tags),
    status:     b.status === 'published' ? 'published' : 'draft',
    author:     req.user._id,
  });

  await post.populate('author', 'name');
  res.status(201).json({ post: shape(post) });
});

/* PUT /api/admin/posts/:id */
const update = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const b   = req.body || {};
  const has = (k) => Object.prototype.hasOwnProperty.call(b, k);
  const wasDraft = post.status === 'draft';

  if (has('title')) {
    const title = String(b.title).trim();
    if (!title) return res.status(400).json({ error: 'Title is required' });
    post.title = title;
  }
  if (has('content'))    post.content    = String(b.content);
  if (has('coverImage')) post.coverImage = String(b.coverImage).trim();
  if (has('coverAlt'))   post.coverAlt   = String(b.coverAlt).trim().slice(0, 200);
  if (has('tags'))       post.tags       = normaliseTags(b.tags);
  if (has('status') && ['draft', 'published'].includes(b.status)) post.status = b.status;

  post.excerpt = autoExcerpt(has('excerpt') ? String(b.excerpt).trim() : post.excerpt, post.content);

  // Re-slug only on an explicit slug, or when retitling a post that is still a
  // draft — a published URL stays put so existing links never break.
  if (b.slug) post.slug = await Post.uniqueSlug(b.slug, post._id);
  else if (has('title') && wasDraft) post.slug = await Post.uniqueSlug(post.title, post._id);

  await post.save();
  await post.populate('author', 'name');
  res.json({ post: shape(post) });
});

/* DELETE /api/admin/posts/:id */
const remove = asyncHandler(async (req, res) => {
  const deleted = await Post.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Post not found' });
  res.json({ ok: true });
});

/* POST /api/admin/posts/upload-xml */
const uploadXml = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload an XML file.' });
  }

  const xmlString = req.file.buffer.toString('utf8');
  
  // Custom XML parsing helper
  const posts = [];
  const items = xmlString.split(/<item>|<entry>/i);
  
  for (let i = 1; i < items.length; i++) {
    const itemHtml = items[i].split(/<\/item>|<\/entry>/i)[0];
    
    const extractTag = (tagName) => {
      const regex = new RegExp(`<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
      const match = itemHtml.match(regex);
      if (!match) return '';
      let val = match[1].trim();
      if (val.startsWith('<![CDATA[')) {
        val = val.substring(9, val.length - 3);
      }
      return val;
    };

    const extractTags = () => {
      const tags = [];
      const regex = /<category(?:\s+[^>]*)?>([\s\S]*?)<\/category>/gi;
      let match;
      while ((match = regex.exec(itemHtml)) !== null) {
        let val = match[1].trim();
        if (val.startsWith('<![CDATA[')) {
          val = val.substring(9, val.length - 3);
        }
        if (val) tags.push(val);
      }
      return tags;
    };

    const title = extractTag('title');
    let content = extractTag('content:encoded') || extractTag('content') || extractTag('description');
    let excerpt = extractTag('excerpt:encoded') || extractTag('description');
    let slug = extractTag('wp:post_name') || extractTag('slug');
    if (!slug) {
      const link = extractTag('link');
      if (link) {
        const parts = link.replace(/\/$/, '').split('/');
        slug = parts[parts.length - 1];
      }
    }
    if (!slug && title) {
      const { slugify } = require('../utils/slugify');
      slug = slugify(title);
    }

    const pubDateStr = extractTag('pubDate') || extractTag('published') || extractTag('wp:post_date');
    let publishedAt = pubDateStr ? new Date(pubDateStr) : new Date();
    if (isNaN(publishedAt.getTime())) {
      publishedAt = new Date();
    }

    const statusVal = extractTag('wp:status') || 'published';
    const status = statusVal === 'publish' || statusVal === 'published' ? 'published' : 'draft';

    if (title && content) {
      posts.push({
        title,
        slug,
        excerpt: excerpt ? excerpt.substring(0, 380) : content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        content,
        tags: extractTags(),
        status,
        publishedAt
      });
    }
  }

  if (posts.length === 0) {
    return res.status(400).json({ error: 'No valid blog posts found in the XML file.' });
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const postData of posts) {
    const existing = await Post.findOne({ slug: postData.slug });
    
    const fields = {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      tags: postData.tags,
      status: postData.status,
      publishedAt: postData.publishedAt,
      author: req.user._id
    };

    if (existing) {
      Object.assign(existing, fields);
      await existing.save();
      updatedCount++;
    } else {
      const finalSlug = await Post.uniqueSlug(postData.slug || postData.title);
      await Post.create({
        ...fields,
        slug: finalSlug
      });
      createdCount++;
    }
  }

  res.json({
    message: `Successfully imported blogs.`,
    created: createdCount,
    updated: updatedCount,
    total: posts.length
  });
});

module.exports = { listPublished, listTags, getBySlug, listAll, getById, create, update, remove, uploadXml };

const mongoose = require('mongoose');
const { slugify } = require('../utils/slugify');

const postSchema = new mongoose.Schema(
  {
    title:      { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    slug:       { type: String, required: true, unique: true, index: true },
    excerpt:    { type: String, default: '', maxlength: 400 },
    content:    { type: String, default: '' },
    coverImage: { type: String, default: '' },
    coverAlt:   { type: String, default: '', maxlength: 200 },
    tags:       { type: [String], default: [] },
    status:     { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    views:      { type: Number, default: 0 },
    author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Byline shown on the site. Overrides the account name when set, so a post
    // can be credited to someone who has no admin login.
    authorName: { type: String, default: '', trim: true, maxlength: 120 },
    publishedAt:{ type: Date, default: null },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

/** Unique slug — appends -2, -3 … when the base is taken. */
postSchema.statics.uniqueSlug = async function uniqueSlug(source, ignoreId = null) {
  const base = slugify(source);
  let slug = base;
  for (let n = 2; ; n++) {
    const clash = await this.findOne({ slug }).select('_id').lean();
    if (!clash || String(clash._id) === String(ignoreId)) return slug;
    slug = `${base}-${n}`;
  }
};

/* Stamp publishedAt once, on the first transition to published. */
postSchema.pre('save', function stampPublished(next) {
  if (this.isModified('status')) {
    if (this.status === 'published' && !this.publishedAt) this.publishedAt = new Date();
    if (this.status === 'draft') this.publishedAt = null;
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);

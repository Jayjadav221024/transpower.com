const fs   = require('node:fs');
const path = require('node:path');
const Media = require('../models/Media');
const { asyncHandler } = require('../middleware/error');
const { UPLOAD_DIR, ALLOWED, extOf } = require('../middleware/upload');

const shape = (m) => ({
  id:           m._id,
  url:          m.url,
  filename:     m.filename,
  originalName: m.originalName,
  mime:         m.mime,
  size:         m.size,
  alt:          m.alt,
  createdAt:    m.createdAt,
});

/* POST /api/admin/media — multipart, field "images" */
const uploadImages = asyncHandler(async (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: 'No images received' });

  const docs = await Media.insertMany(
    files.map((f) => ({
      filename:     f.filename,
      originalName: f.originalname,
      url:          `/uploads/${f.filename}`,
      mime:         ALLOWED[extOf(f.filename)] || 'application/octet-stream',
      size:         f.size,
      alt:          path.basename(f.originalname, path.extname(f.originalname)).replace(/[-_]+/g, ' '),
      uploadedBy:   req.user._id,
    }))
  );

  res.status(201).json({ media: docs.map(shape) });
});

/* GET /api/admin/media */
const listMedia = asyncHandler(async (req, res) => {
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 100));
  const docs  = await Media.find().sort({ createdAt: -1 }).limit(limit);
  res.json({ media: docs.map(shape) });
});

/* PATCH /api/admin/media/:id — edit alt text */
const updateAlt = asyncHandler(async (req, res) => {
  const doc = await Media.findByIdAndUpdate(
    req.params.id,
    { alt: String(req.body?.alt ?? '').slice(0, 200) },
    { new: true }
  );
  if (!doc) return res.status(404).json({ error: 'Image not found' });
  res.json({ media: shape(doc) });
});

/* DELETE /api/admin/media/:id — removes the document and the file */
const removeMedia = asyncHandler(async (req, res) => {
  const doc = await Media.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Image not found' });

  // Resolve + confine to UPLOAD_DIR before unlinking.
  const target = path.resolve(UPLOAD_DIR, path.basename(doc.filename));
  if (target.startsWith(path.resolve(UPLOAD_DIR)) && fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
  await doc.deleteOne();

  res.json({ ok: true });
});

module.exports = { uploadImages, listMedia, updateAlt, removeMedia };

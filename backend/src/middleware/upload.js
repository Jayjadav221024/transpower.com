/* ==========================================================================
   Multer image upload — files land in backend/uploads
   ========================================================================== */
const multer = require('multer');
const crypto = require('node:crypto');
const fs     = require('node:fs');
const path   = require('node:path');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* The client-supplied MIME type is never trusted — the extension decides both
   the stored filename and the MIME we record. Anything unlisted is rejected. */
const ALLOWED = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.avif': 'image/avif',
  '.svg':  'image/svg+xml',
};

/* The reverse map, for files that arrive without a usable extension — a WebP
   dragged straight out of another browser tab, or one saved as "download".
   The MIME only ever picks between entries of ALLOWED above, so it decides
   nothing that was not already permitted. */
const EXT_FOR_MIME = {
  'image/jpeg':    '.jpg',
  'image/jpg':     '.jpg',
  'image/png':     '.png',
  'image/webp':    '.webp',
  'image/gif':     '.gif',
  'image/avif':    '.avif',
  'image/svg+xml': '.svg',
};

const MAX_BYTES = 8 * 1024 * 1024;   // 8 MB per image
const MAX_FILES = 10;

const extOf = (name) => path.extname(String(name)).toLowerCase();

/** The extension the file will be stored under, or '' when it is not an image
 *  type we accept. */
function resolveExt(file) {
  const ext = extOf(file.originalname);
  if (ext === '.jpeg') return '.jpg';
  if (ALLOWED[ext]) return ext;
  const mime = String(file.mimetype || '').split(';')[0].trim().toLowerCase();
  return EXT_FOR_MIME[mime] || '';
}

/* Filenames are generated, never taken from the client — no path traversal,
   no overwriting, no executable extensions. */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext  = resolveExt(file);
    const stem =
      path.basename(file.originalname, path.extname(file.originalname))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'image';
    cb(null, `${stem}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (!resolveExt(file)) {
      return cb(
        Object.assign(
          new Error(
            `Unsupported file type "${extOf(file.originalname) || file.mimetype || file.originalname}". Use JPG, PNG, WebP, GIF, AVIF or SVG.`
          ),
          { status: 400 }
        )
      );
    }
    cb(null, true);
  },
});

module.exports = { upload, UPLOAD_DIR, ALLOWED, MAX_FILES, extOf, resolveExt };

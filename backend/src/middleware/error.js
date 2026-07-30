/* ==========================================================================
   Centralised 404 + error handling
   ========================================================================== */
const multer = require('multer');
const { MAX_FILES } = require('./upload');

function notFound(req, res, next) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.path}` });
  }
  next();
}

/* eslint-disable-next-line no-unused-vars -- Express identifies handlers by arity */
function errorHandler(err, _req, res, _next) {
  /* Multer */
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'  ? 'Image is larger than the 8 MB limit'
      : err.code === 'LIMIT_FILE_COUNT' ? `Upload up to ${MAX_FILES} images at a time`
      : err.message;
    return res.status(400).json({ error: message });
  }

  /* Mongoose validation */
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(', ') });
  }

  /* Bad ObjectId in a route param */
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid ${err.path}` });
  }

  /* Duplicate key */
  if (err.code === 11000) {
    return res.status(409).json({ error: `That ${Object.keys(err.keyPattern || {})[0] || 'value'} is already taken` });
  }

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message || 'Internal server error' });
}

/** Wraps an async controller so rejected promises reach errorHandler. */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { notFound, errorHandler, asyncHandler };

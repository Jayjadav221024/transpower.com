/* ==========================================================================
   Express application — no listen() here so tests and the in-memory dev
   runner can mount it themselves.
   ========================================================================== */
const express      = require('express');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const fs           = require('node:fs');
const path         = require('node:path');

const { loadUser } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/error');
const routes = require('./routes');

const app = express();

const ROOT        = path.join(__dirname, '..');
const UPLOAD_DIR  = path.join(ROOT, 'uploads');
const CLIENT_DIST = path.join(ROOT, '..', 'frontend', 'dist');

app.set('trust proxy', 1);   // correct req.ip behind nginx / a PaaS proxy
app.disable('x-powered-by');

/* In dev the React app runs on its own port, so it needs credentialed CORS.
   In production both are served from this origin and CORS is a no-op.

   The browser's Origin header never carries a trailing slash or path, so the
   configured values are normalised to bare origins before comparison —
   CLIENT_ORIGIN="https://example.com/" would otherwise silently fail to match
   and every cross-origin request would surface as "Failed to fetch". */
const normaliseOrigin = (value) => {
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
};

const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(normaliseOrigin)
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin and server-to-server requests send no Origin header.
      if (!origin) return callback(null, true);
      return callback(null, ALLOWED_ORIGINS.includes(origin));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(loadUser);

/* ─── Uploaded images ────────────────────────────────────────────────────── */
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    maxAge: '30d',
    setHeaders: (res) => {
      // Uploads are never interpreted as script: nosniff pins the declared type,
      // and the CSP neutralises <script> embedded in an SVG opened directly.
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'");
    },
  })
);

/* ─── API ────────────────────────────────────────────────────────────────── */
app.use('/api', routes);

/* ─── Built React app (production) ───────────────────────────────────────── */
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;

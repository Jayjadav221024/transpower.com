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
const { ALLOWED, extOf } = require('./middleware/upload');
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
    setHeaders: (res, filePath) => {
      /* Declare the type from our own table rather than leaving it to the mime
         db bundled with `send`, which is old enough to miss AVIF and would
         serve it as application/octet-stream — a download prompt instead of an
         image. Set here because `send` only falls back to its own lookup when
         Content-Type is still unset. */
      const type = ALLOWED[extOf(filePath)];
      if (type) res.setHeader('Content-Type', type);

      // Uploads are never interpreted as script: nosniff pins the declared type,
      // and the CSP neutralises <script> embedded in an SVG opened directly.
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'");
    },
  })
);

/* ─── API ────────────────────────────────────────────────────────────────── */
app.use('/api', routes);

/* ─── Cron Job ───────────────────────────────────────────────────────────── */
app.get('/cron/subscription-check', async (req, res) => {
  if (!process.env.CRON_SECRET || req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  // Your cron logic here

  res.send("Cron executed");
});


/* ─── Built React app (production) ───────────────────────────────────────── */

/* Content types for the pre-compressed files below. Needed because the file on
   disk is "index-abc123.js.br", and left to itself the static handler would
   label that a binary download. */
const TYPE_BY_EXT = {
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
};

/**
 * Serves the .br / .gz written at build time by frontend/scripts/precompress.mjs.
 *
 * A first visit is a few hundred kB of JS and CSS; compressed it is roughly a
 * quarter of that, which on a phone connection is most of the wait. Doing it at
 * build time rather than per request costs no CPU here at all.
 *
 * Falls straight through when the file does not exist — which is also what
 * makes it safe in front of the SPA fallback below. Rewriting the URL to a
 * missing .br would otherwise have the catch-all answer a script request with
 * index.html, and the page would break with a syntax error rather than a 404.
 */
function servePreCompressed(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();

  const ext = path.extname(req.path).toLowerCase();
  if (!TYPE_BY_EXT[ext]) return next();

  const accepted = String(req.headers['accept-encoding'] || '');
  const encoding = /\bbr\b/.test(accepted) ? 'br' : /\bgzip\b/.test(accepted) ? 'gzip' : null;
  if (!encoding) return next();

  let decoded;
  try {
    decoded = decodeURIComponent(req.path);
  } catch {
    return next();   // malformed escape — let the normal handler deal with it
  }

  const suffix = encoding === 'br' ? '.br' : '.gz';
  const candidate = path.resolve(CLIENT_DIST, `.${decoded}${suffix}`);

  // Confined to the build directory: a traversal attempt resolves outside it.
  if (!candidate.startsWith(path.resolve(CLIENT_DIST) + path.sep)) return next();
  if (!fs.existsSync(candidate)) return next();

  /* Set before the rewrite: the static handler only reaches for its own mime
     lookup when Content-Type has not been decided already. */
  res.setHeader('Content-Type', TYPE_BY_EXT[ext]);
  res.setHeader('Content-Encoding', encoding);
  // Caches must key on the encoding, or a br body reaches a client wanting gzip.
  res.setHeader('Vary', 'Accept-Encoding');

  req.url = `${decoded}${suffix}`;
  return next();
}

/* Vite writes content-hashed names, so a change to a file changes its URL and
   the old one can be kept for as long as we like. Two exceptions: assets/images
   comes from public/ with stable names and can be replaced in place, and
   index.html must be re-read or a returning visitor keeps loading last week's
   asset hashes forever. */
function cacheHeaders(res, filePath) {
  const relative = path.relative(path.resolve(CLIENT_DIST), filePath).replace(/\\/g, '/');

  if (relative.startsWith('assets/images/')) {
    res.setHeader('Cache-Control', 'public, max-age=86400');       // a day
  } else if (relative.startsWith('assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'no-cache');
  }
}

/* The entry file, not the directory: a build that failed part way through can
   leave an empty dist behind, and serving from it would answer every deep link
   with a 404 that looks exactly like a missing catch-all. */
const CLIENT_INDEX = path.join(CLIENT_DIST, 'index.html');

if (fs.existsSync(CLIENT_INDEX)) {
  app.use(servePreCompressed);
  app.use(express.static(CLIENT_DIST, { index: false, setHeaders: cacheHeaders }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();

    /* A path with a file extension is asking for a file, not an app route. Left
       to the line below, a missing one is answered with index.html under a 200,
       and the browser reports "Unexpected token '<'" while parsing HTML as
       JavaScript — which is what a tab left open across a deploy does when it
       requests an asset hash that no longer exists. A plain 404 says what
       actually happened. No route in this app contains a dot. */
    const ext = path.extname(req.path);
    if (ext && ext !== '.html') return next();

    // Revalidated every time, so a deploy is picked up on the next navigation.
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(CLIENT_INDEX);
  });
} else {
  /* No React build on disk. Either this is an API-only deployment — the front
     end is a separate static site, which is how Render is set up — or a build
     step did not run. Both look identical from here, so say what is true and
     leave the diagnosis to whoever reads it. */
  console.warn(
    `\n  No React build at ${CLIENT_DIST} — serving the API only.\n` +
    '  Expected when the front end is deployed separately. If this server is\n' +
    '  meant to serve the site too, build it first:  npm run build  (repo root)\n'
  );

  /* 404, not 503: for an API-only deployment this state is correct, and a 5xx
     on / would fail an uptime or platform health check against the root path. */
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();
    res.status(404).type('text/plain').send(
      'This server hosts the API only — no page is served at this path.\n' +
      'Try /api/health.'
    );
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;

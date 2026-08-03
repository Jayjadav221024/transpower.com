/* ==========================================================================
   Backfills coverImage on posts that were imported without one, pulling each
   article's featured image from the old WordPress site.

     npm run backfill-covers                  # match, download, update
     npm run backfill-covers -- --dry-run     # report the matching, write nothing
     npm run backfill-covers -- --force       # also replace covers already set
     npm run backfill-covers -- --min=0.7     # fuzzy-match threshold (default 0.6)

   Matching is title-first on purpose. Posts imported from full URLs have slugs
   like "https-www-transpower-net-in-industrial-gearbox-maintenance-checkl…" —
   slugify() caps at 80 chars and the URL prefix alone eats 28, so the stored
   slug is a truncated version of the WordPress one and never compares equal.
   Titles survive intact (maxlength 200), so they are the reliable key.
   ========================================================================== */
require('dotenv').config();

const fs   = require('fs/promises');
const path = require('path');

const mongoose  = require('mongoose');
const connectDB = require('../config/db');
const Post      = require('../models/Post');

const SOURCE     = process.env.WP_SOURCE_URL || 'https://www.transpower.net.in';
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
const URL_PREFIX = /^https?-+(www-+)?transpower-+net-+in-+/;
const PER_PAGE   = 100;

const args    = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE   = args.includes('--force');
const MIN_SCORE = Number((args.find((a) => a.startsWith('--min=')) || '').split('=')[1]) || 0.6;

/* ─── Text matching ──────────────────────────────────────────────────────── */

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', deg: '°', times: '×', middot: '·',
};

function decodeEntities(str) {
  return String(str || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

/** Comparable form: lowercase, punctuation collapsed to single spaces. */
const norm = (s) =>
  decodeEntities(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Stored slug minus the URL prefix, as space-separated words. */
const slugWords = (slug) =>
  String(slug || '').replace(URL_PREFIX, '').replace(/[^a-z0-9]+/gi, ' ').trim().toLowerCase();

/** Jaccard overlap on word sets — order-independent and tolerant of truncation. */
function similarity(a, b) {
  const A = new Set(norm(a).split(' ').filter(Boolean));
  const B = new Set(norm(b).split(' ').filter(Boolean));
  if (A.size === 0 || B.size === 0) return 0;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / (A.size + B.size - shared);
}

/** How much of the (truncated) stored slug is a clean prefix of the WP slug. */
function prefixScore(dbSlug, wpSlug) {
  const a = slugWords(dbSlug).replace(/ /g, '-');
  const b = norm(wpSlug).replace(/ /g, '-');
  if (!a || !b) return 0;
  return b.startsWith(a) || a.startsWith(b) ? Math.min(a.length, b.length) / Math.max(a.length, b.length) : 0;
}

/* ─── WordPress ──────────────────────────────────────────────────────────── */

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'transpower-import' } });
  if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`);
  return res.json();
}

async function fetchAllPosts() {
  const all = [];
  for (let page = 1; ; page++) {
    const url = `${SOURCE}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_embed=1`;
    let batch;
    try {
      batch = await getJson(url);
    } catch (err) {
      if (String(err.message).includes('HTTP 400')) break;   // past the last page
      throw err;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    console.log(`  fetched page ${page} (${batch.length} posts, ${all.length} total)`);
    if (batch.length < PER_PAGE) break;
  }
  return all;
}

/** Saves a remote cover into backend/uploads, returns its public path. */
async function downloadCover(url, slug) {
  const clean = url.split('?')[0];
  const ext   = (path.extname(clean) || '.jpg').toLowerCase();
  const name  = `wp-${slug}${ext}`.replace(/[^a-z0-9.\-_]/gi, '-');
  const dest  = path.join(UPLOAD_DIR, name);

  try {
    await fs.access(dest);
    return `/uploads/${name}`;                    // already downloaded
  } catch {
    /* not cached yet — fetch it */
  }

  const res = await fetch(url, { headers: { 'User-Agent': 'transpower-import' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return `/uploads/${name}`;
}

/* ─── Run ────────────────────────────────────────────────────────────────── */

(async function run() {
  console.log(`\n  Source: ${SOURCE}`);
  if (DRY_RUN) console.log('  DRY RUN — nothing will be written');
  console.log('');

  const wpPosts = await fetchAllPosts();
  if (wpPosts.length === 0) {
    console.error('\n  No posts returned. Is the site reachable and the REST API public?\n');
    process.exit(1);
  }

  /* Only WordPress posts that actually carry a featured image are candidates. */
  const candidates = wpPosts
    .map((wp) => ({
      slug:  wp.slug,
      title: decodeEntities(wp.title?.rendered).trim(),
      image: wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    }))
    .filter((c) => c.image);

  console.log(`  ${candidates.length} of ${wpPosts.length} WordPress posts have a featured image\n`);

  await connectDB();

  const query = FORCE ? {} : { $or: [{ coverImage: '' }, { coverImage: null }] };
  const posts = await Post.find(query);
  console.log(`  ${posts.length} post(s) to fill\n`);

  const stats = { matched: 0, skipped: 0, failed: 0 };
  const unmatched = [];

  for (const post of posts) {
    /* Score every candidate; title carries the match, slug prefix breaks ties. */
    let best = null;
    for (const c of candidates) {
      const score = Math.max(
        similarity(post.title, c.title),
        prefixScore(post.slug, c.slug) * 0.95,   // slightly below a clean title hit
      );
      if (!best || score > best.score) best = { ...c, score };
    }

    if (!best || best.score < MIN_SCORE) {
      unmatched.push({ title: post.title, best: best?.title, score: best?.score ?? 0 });
      stats.skipped++;
      continue;
    }

    const pct = `${Math.round(best.score * 100)}%`;

    if (DRY_RUN) {
      console.log(`  ${pct.padStart(4)}  ${post.title}`);
      console.log(`        → ${best.image.split('/').pop()}`);
      stats.matched++;
      continue;
    }

    try {
      post.coverImage = await downloadCover(best.image, best.slug);
      await post.save();
      stats.matched++;
      console.log(`  ${pct.padStart(4)}  ${post.title}`);
      console.log(`        → ${post.coverImage}`);
    } catch (err) {
      stats.failed++;
      console.error(`  FAILED  ${post.title} — ${err.message}`);
    }
  }

  if (unmatched.length) {
    console.log(`\n  ${unmatched.length} post(s) below the ${MIN_SCORE} threshold — set these by hand in the admin:`);
    for (const u of unmatched) {
      console.log(`    · ${u.title}`);
      if (u.best) console.log(`        closest: ${u.best} (${Math.round(u.score * 100)}%)`);
    }
  }

  console.log(
    `\n  Done — ${stats.matched} matched, ${stats.skipped} unmatched, ${stats.failed} failed.\n`
  );

  await mongoose.disconnect();
  process.exit(stats.failed > 0 ? 1 : 0);
})();

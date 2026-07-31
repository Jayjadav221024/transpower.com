/* ==========================================================================
   Imports every published article from the old WordPress site into MongoDB.

     npm run import-blog                  # import everything
     npm run import-blog -- --dry-run     # report only, write nothing
     npm run import-blog -- --limit=5     # first N posts, for a trial run
     npm run import-blog -- --skip-images # keep remote cover URLs, download none

   Re-running is safe: posts are matched on their WordPress slug and updated
   in place rather than duplicated.
   ========================================================================== */
require('dotenv').config();

const fs   = require('fs/promises');
const path = require('path');

const mongoose  = require('mongoose');
const connectDB = require('../config/db');
const User      = require('../models/User');
const Post      = require('../models/Post');

const SOURCE     = process.env.WP_SOURCE_URL || 'https://www.transpower.net.in';
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
const PER_PAGE   = 100;

const args       = process.argv.slice(2);
const DRY_RUN    = args.includes('--dry-run');
const SKIP_IMAGES= args.includes('--skip-images');
const LIMIT      = Number((args.find((a) => a.startsWith('--limit=')) || '').split('=')[1]) || Infinity;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', deg: '°', times: '×', middot: '·',
};

/** WordPress returns titles and excerpts with HTML entities still encoded. */
function decodeEntities(str) {
  return String(str || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

function stripTags(html) {
  return decodeEntities(String(html || '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Post.excerpt is capped at 400 chars by the schema. */
function toExcerpt(html) {
  const plain = stripTags(html).replace(/\s*\[[^\]]*\]\s*$/, '').trim();
  return plain.length > 380 ? `${plain.slice(0, 380).trimEnd()}…` : plain;
}

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'transpower-import' } });
  if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`);
  return res.json();
}

/** Pulls every page of the posts collection. */
async function fetchAllPosts() {
  const all = [];
  for (let page = 1; ; page++) {
    const url = `${SOURCE}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_embed=1`;
    let batch;
    try {
      batch = await getJson(url);
    } catch (err) {
      /* WordPress 400s once you ask past the last page. */
      if (String(err.message).includes('HTTP 400')) break;
      throw err;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    console.log(`  fetched page ${page} (${batch.length} posts, ${all.length} total)`);
    if (batch.length < PER_PAGE) break;
  }
  return all;
}

/** Saves a remote cover image into backend/uploads, returns its public path. */
async function downloadCover(url, slug) {
  const clean = url.split('?')[0];
  const ext   = (path.extname(clean) || '.jpg').toLowerCase();
  const name  = `wp-${slug}${ext}`.replace(/[^a-z0-9.\-_]/gi, '-');
  const dest  = path.join(UPLOAD_DIR, name);

  try {
    await fs.access(dest);
    return `/uploads/${name}`;                  // already downloaded
  } catch {
    /* not cached yet — fall through and fetch it */
  }

  const res = await fetch(url, { headers: { 'User-Agent': 'transpower-import' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return `/uploads/${name}`;
}

/** Category and tag names attached by ?_embed, minus WordPress's "Uncategorized". */
function termNames(wp) {
  const groups = wp._embedded?.['wp:term'] || [];
  return [...new Set(groups.flat().map((t) => decodeEntities(t?.name)).filter(Boolean))]
    .filter((n) => n.toLowerCase() !== 'uncategorized')
    .slice(0, 12);
}

/* ─── Run ────────────────────────────────────────────────────────────────── */

(async function run() {
  console.log(`\n  Source: ${SOURCE}`);
  if (DRY_RUN) console.log('  DRY RUN — nothing will be written\n');

  const wpPosts = await fetchAllPosts();
  if (wpPosts.length === 0) {
    console.error('\n  No posts returned. Is the site reachable and the REST API public?\n');
    process.exit(1);
  }

  await connectDB();

  const admin = await User.findOne().sort({ createdAt: 1 });
  if (!admin) {
    console.error('\n  No admin user found. Run: npm run create-admin -- <user> <pass> "Name"\n');
    process.exit(1);
  }

  const stats = { created: 0, updated: 0, failed: 0 };

  for (const wp of wpPosts.slice(0, LIMIT)) {
    const slug  = wp.slug;
    const title = decodeEntities(wp.title?.rendered).trim();

    try {
      let coverImage = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      if (coverImage && !SKIP_IMAGES && !DRY_RUN) {
        try {
          coverImage = await downloadCover(coverImage, slug);
        } catch (err) {
          console.warn(`    ! cover download failed (${err.message}) — keeping remote URL`);
        }
      }

      const fields = {
        title,
        excerpt:     toExcerpt(wp.excerpt?.rendered),
        content:     wp.content?.rendered || '',
        coverImage,
        tags:        termNames(wp),
        status:      'published',
        author:      admin._id,
        publishedAt: new Date(wp.date_gmt ? `${wp.date_gmt}Z` : wp.date),
      };

      const existing = await Post.findOne({ slug });

      if (DRY_RUN) {
        console.log(`  ${existing ? 'update' : 'create'}  ${slug}`);
        console.log(`     title    ${title}`);
        console.log(`     date     ${fields.publishedAt.toISOString()}`);
        console.log(`     tags     ${fields.tags.join(', ') || '(none)'}`);
        console.log(`     cover    ${coverImage || '(none)'}`);
        console.log(`     excerpt  ${fields.excerpt.length} chars, content ${fields.content.length} chars`);
        stats[existing ? 'updated' : 'created']++;
        continue;
      }

      if (existing) {
        Object.assign(existing, fields);
        await existing.save();
        stats.updated++;
        console.log(`  updated  ${slug}`);
      } else {
        await Post.create({ ...fields, slug });
        stats.created++;
        console.log(`  created  ${slug}`);
      }
    } catch (err) {
      stats.failed++;
      console.error(`  FAILED   ${slug} — ${err.message}`);
    }
  }

  console.log(
    `\n  Done — ${stats.created} created, ${stats.updated} updated, ${stats.failed} failed.\n`
  );

  await mongoose.disconnect();
  process.exit(stats.failed > 0 ? 1 : 0);
})();

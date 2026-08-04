/* ==========================================================================
   Writes .br and .gz beside every compressible file in dist/.
   ==========================================================================
   The build output is content-hashed and never changes, so compressing it once
   here beats compressing the same bytes again on every request. The server
   picks the pre-made file when the browser accepts it (see backend/src/app.js).

   Node's own zlib does the work — no dependency. Brotli runs at maximum quality
   because this happens once per deploy, not per visitor.

   Harmless if a CDN in front already compresses: the extra files simply go
   unread.
   ========================================================================== */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname, relative } from 'node:path';
import { brotliCompress, gzip, constants } from 'node:zlib';
import { promisify } from 'node:util';

const toBrotli = promisify(brotliCompress);
const toGzip   = promisify(gzip);

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

const COMPRESSIBLE = new Set(['.js', '.css', '.html', '.svg', '.json', '.txt', '.xml', '.map']);

/* Under about a kilobyte the headers and framing cost more than the saving, and
   a packet is a packet. */
const MIN_BYTES = 1024;

/* Skip anything that is already a compressed format — re-compressing a webp or
   a PDF spends build time to make the file slightly larger. */
const ALREADY_COMPRESSED = /\.(br|gz|png|jpe?g|webp|avif|gif|woff2?|pdf|zip|mp4)$/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

let files = 0;
let rawTotal = 0;
let brTotal = 0;

try {
  for await (const file of walk(DIST)) {
    if (ALREADY_COMPRESSED.test(file)) continue;
    if (!COMPRESSIBLE.has(extname(file).toLowerCase())) continue;

    const raw = await readFile(file);
    if (raw.length < MIN_BYTES) continue;

    const [brotli, gzipped] = await Promise.all([
      toBrotli(raw, {
        params: {
          [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
          [constants.BROTLI_PARAM_SIZE_HINT]: raw.length,
        },
      }),
      toGzip(raw, { level: constants.Z_BEST_COMPRESSION }),
    ]);

    /* Keep them only if they actually won. An already-dense file can compress
       to more than it started as, and serving that would be a loss twice over. */
    if (brotli.length < raw.length) await writeFile(`${file}.br`, brotli);
    if (gzipped.length < raw.length) await writeFile(`${file}.gz`, gzipped);

    files += 1;
    rawTotal += raw.length;
    brTotal += Math.min(brotli.length, raw.length);

    if (extname(file) !== '.map') {
      console.log(`  ${relative(DIST, file).replace(/\\/g, '/')}  ${kb(raw.length)} → ${kb(brotli.length)} br`);
    }
  }

  console.log(
    `\n  pre-compressed ${files} file${files === 1 ? '' : 's'}: ` +
    `${kb(rawTotal)} → ${kb(brTotal)} brotli ` +
    `(${rawTotal ? Math.round((1 - brTotal / rawTotal) * 100) : 0}% smaller)\n`
  );
} catch (err) {
  /* A missing dist/ means the build did not get this far; that is the real
     error and it has already been reported. Never fail the build from here. */
  console.warn(`  precompress skipped: ${err.message}`);
}

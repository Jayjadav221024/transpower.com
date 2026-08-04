/* ==========================================================================
   Uploaded-asset URLs inside post markup
   ==========================================================================
   Post bodies are stored with root-relative upload paths ("/uploads/x.webp")
   so the markup stays portable — the DB never learns which host serves the
   files. That path only resolves on its own while the site and the API share
   an origin. Deployed apart (the front end on one Render service, the API on
   another) the browser asks the front end for /uploads/x.webp, gets the SPA's
   index.html back, and every inline image is broken — which is why a cover
   image works (it goes through assetUrl) and one inserted into the body did not.

   So: rewrite to absolute on the way into the DOM, and back to relative on the
   way to the database. The two are exact inverses, which matters in the editor
   — the contentEditable box holds display markup, and comparing it against the
   stored value is how the component avoids resetting the caret on every keypress.
   ========================================================================== */
import { API_BASE } from '../api/client';

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* src/href/poster covers <img>, a link to a PDF, and a <video> still. Anchored
   on the whitespace that always precedes an attribute, so a lazy-loader's
   data-src is left exactly as the author wrote it rather than half-rewritten.

   The quote character is captured and replayed rather than normalised:
   imported WordPress markup uses single quotes in places, and a roundtrip that
   rewrote them would look like an edit to the caret-preservation check. */
const TO_ABSOLUTE = /(\s(?:src|href|poster)=)(["'])\/uploads\//gi;
const TO_RELATIVE = new RegExp(`(\\s(?:src|href|poster)=)(["'])${escapeRe(API_BASE)}/uploads/`, 'gi');

/** Stored markup → markup the browser can load images from. */
export function toDisplayHtml(html) {
  if (!html || !API_BASE) return html || '';
  return String(html).replace(TO_ABSOLUTE, `$1$2${API_BASE}/uploads/`);
}

/** Markup out of the DOM → the host-independent form that gets saved. */
export function toStoredHtml(html) {
  if (!html || !API_BASE) return html || '';
  return String(html).replace(TO_RELATIVE, '$1$2/uploads/');
}

/** For values dropped into a hand-built attribute — alt text can hold a quote. */
export const escapeAttr = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Plain text destined for insertion as HTML. */
export const escapeHtml = (text) =>
  String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', deg: '°', times: '×', middot: '·',
};

export function decodeHtmlEntities(str) {
  if (!str) return '';
  return String(str)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

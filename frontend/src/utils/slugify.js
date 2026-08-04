/** Turn arbitrary text into a URL-safe slug.
 *
 *  Mirrors backend/src/utils/slugify.js so the preview shown in the editor
 *  matches the slug the server actually stores. Keep the two in step — the
 *  server still has the final say and may append -2, -3 … to break ties.
 */
export function slugify(text) {
  return (
    String(text)
      .toLowerCase()
      .normalize('NFKD')          // accents split off, stripped by the next line
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'post'
  );
}

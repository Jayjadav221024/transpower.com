/** Turn arbitrary text into a URL-safe slug. */
function slugify(text) {
  return (
    String(text)
      .toLowerCase()
      .normalize('NFKD')          // accents split off, stripped by the next line
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'post'
  );
}

module.exports = { slugify };

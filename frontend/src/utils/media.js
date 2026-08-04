/* File-dialog filter for image uploads. Kept in step with ALLOWED in
   backend/src/middleware/upload.js.

   The extensions are listed next to the MIME types on purpose: a Windows file
   dialog filters on extension, and a bare "image/*" leaves WebP and AVIF greyed
   out on machines where those types are not registered with the OS — the file
   is accepted server-side but cannot be picked in the first place. */
export const IMAGE_ACCEPT = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml',
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg',
].join(',');

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

/** Is this something worth handing to the upload endpoint?
 *
 *  A file dragged in from another browser window or a screenshot tool can
 *  arrive with an empty `type`, so the name is checked as well — the server
 *  makes the final call either way. */
export const isImageFile = (file) =>
  Boolean(file) && (String(file.type || '').startsWith('image/') || IMAGE_EXT.test(file.name || ''));

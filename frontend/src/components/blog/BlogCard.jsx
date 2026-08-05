import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format';
import { assetUrl } from '../../api/client';
import { decodeHtmlEntities } from '../../utils/contentHtml';

/* Decorative corner blobs, cycled by card position so a grid row never repeats
   the same pair. Each entry is [top-left, bottom-right]. */
const BLOB_PAIRS = [
  ['var(--accent-orange)', 'var(--accent-cyan)'],
  ['var(--accent-orange-bright)', 'var(--accent-cyan-bright)'],
  ['var(--accent-cyan)', 'var(--accent-orange)'],
  ['var(--accent-orange-deep)', 'var(--accent-orange-bright)'],
];

function getFallbackImage(title = '', tags = []) {
  const t = `${title} ${tags.join(' ')}`.toLowerCase();
  if (t.includes('motor') || t.includes('crompton') || t.includes('greaves')) {
    return '/assets/images/motor_crompton_3d.jpg';
  }
  if (t.includes('gear') || t.includes('rotomotive')) {
    return '/assets/images/gearbox_rotomotive_3d.jpg';
  }
  if (t.includes('tray') || t.includes('cable')) {
    return '/assets/images/cable_tray_product.webp';
  }
  if (t.includes('grating') || t.includes('molded')) {
    return '/assets/images/grating_grit_3d.jpg';
  }
  if (t.includes('switchgear') || t.includes('panel')) {
    return '/assets/images/switchgear_control_3d.png';
  }
  return '/assets/images/hero_frp_grating.webp';
}

export default function BlogCard({ post, index = 0 }) {
  const [blobA, blobB] = BLOB_PAIRS[index % BLOB_PAIRS.length];
  const cleanSlug = post.slug ? post.slug.replace(/^https-www-transpower-net-in-/, '') : '';
  const decodedTitle = decodeHtmlEntities(post.title);
  const decodedExcerpt = decodeHtmlEntities(post.excerpt);
  const authorName = post.authorName || (typeof post.author === 'object' ? post.author?.name : post.author) || 'Kajal Zakhariya';

  const fallback = getFallbackImage(decodedTitle, post.tags || []);

  return (
    <Link className="blog-card" to={`/blog/${cleanSlug}`}>
      <div className="blog-card-media">
        <img 
          src={post.coverImage ? assetUrl(post.coverImage) : fallback} 
          alt={post.coverAlt ? decodeHtmlEntities(post.coverAlt) : decodedTitle} 
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallback;
          }}
        />
        <span className="blog-blob blog-blob-a" style={{ background: blobA }} />
        <span className="blog-blob blog-blob-b" style={{ background: blobB }} />
      </div>

      <div className="blog-card-body">
        {post.tags?.[0] && <span className="blog-card-badge">{decodeHtmlEntities(post.tags[0])}</span>}

        <div className="blog-card-meta">
          <span className="blog-card-author">{authorName}</span>
          <span className="blog-card-dot">·</span>
          <span>{formatDate(post.publishedAt, { long: true })}</span>
        </div>

        <h2>{decodedTitle}</h2>
        <p>{decodedExcerpt}</p>
      </div>
    </Link>
  );
}

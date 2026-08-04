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

export default function BlogCard({ post, index = 0 }) {
  const [blobA, blobB] = BLOB_PAIRS[index % BLOB_PAIRS.length];
  const cleanSlug = post.slug ? post.slug.replace(/^https-www-transpower-net-in-/, '') : '';
  const decodedTitle = decodeHtmlEntities(post.title);
  const decodedExcerpt = decodeHtmlEntities(post.excerpt);
  const authorName = post.authorName || (typeof post.author === 'object' ? post.author?.name : post.author) || 'Kajal Zakhariya';

  return (
    <Link className="blog-card" to={`/blog/${cleanSlug}`}>
      <div className="blog-card-media">
        <img 
          src={post.coverImage ? assetUrl(post.coverImage) : '/assets/images/hero_frp_grating.webp'} 
          alt={post.coverAlt ? decodeHtmlEntities(post.coverAlt) : decodedTitle} 
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/hero_frp_grating.webp';
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

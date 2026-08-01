import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format';
import { assetUrl } from '../../api/client';

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

  return (
    <Link className="blog-card" to={`/blog/${post.slug}`}>
      <div className="blog-card-media">
        {post.coverImage ? (
          <img src={assetUrl(post.coverImage)} alt={post.title} loading="lazy" />
        ) : (
          <div className="blog-card-media-fallback">⚙️</div>
        )}
        <span className="blog-blob blog-blob-a" style={{ background: blobA }} />
        <span className="blog-blob blog-blob-b" style={{ background: blobB }} />
      </div>

      <div className="blog-card-body">
        {post.tags?.[0] && <span className="blog-card-badge">{post.tags[0]}</span>}

        <div className="blog-card-meta">
          {post.author && (
            <>
              <span className="blog-card-author">{post.author}</span>
              <span className="blog-card-dot">·</span>
            </>
          )}
          <span>{formatDate(post.publishedAt, { long: true })}</span>
          {post.readTime > 0 && (
            <>
              <span className="blog-card-dot">·</span>
              <span>{post.readTime} min read</span>
            </>
          )}
        </div>

        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
      </div>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format';

export default function BlogCard({ post, showViews = true }) {
  return (
    <Link className="blog-card" to={`/blog/${post.slug}`}>
      {post.coverImage ? (
        <div className="blog-card-img">
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        </div>
      ) : (
        <div className="blog-card-img placeholder">⚙️</div>
      )}

      <div className="blog-card-body">
        {post.tags?.length > 0 && (
          <div className="blog-card-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span className="blog-card-tag" key={tag}>{tag}</span>
            ))}
          </div>
        )}

        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>

        <div className="blog-card-meta">
          <span>{formatDate(post.publishedAt)}</span>
          {showViews && <span>{post.views} views</span>}
          <span className="blog-card-more">Read →</span>
        </div>
      </div>
    </Link>
  );
}

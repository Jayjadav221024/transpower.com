import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../api/client';
import BlogCard from '../blog/BlogCard';
import '../../styles/blog.css';

export default function HomeBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .listPosts({ page: 1, limit: 3 })
      .then((res) => setPosts(res.posts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="section home-blog-section" id="home-blog">
      <style>{`
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.5rem;
        }
        .home-blog-section .blog-grid {
          margin-top: 2rem;
        }
        @media (max-width: 600px) {
          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.2rem;
          }
          .home-blog-section .view-all-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
      <div className="container">
        <div className="section-header-row">
          <div>
            <div className="badge-tag">📰 Technical Insights</div>
            <h2 className="section-title" style={{ marginTop: '0.75rem' }}>Engineering Blog & Guides</h2>
          </div>
          <Link to="/blog" className="btn btn-secondary view-all-btn">
            View All Articles
          </Link>
        </div>

        <div className="blog-grid">
          {loading ? (
            <div className="blog-loading">Loading latest articles…</div>
          ) : (
            posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)
          )}
        </div>
      </div>
    </section>
  );
}

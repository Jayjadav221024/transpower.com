import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi, assetUrl } from '../api/client';
import BlogCard from '../components/blog/BlogCard';
import { formatDate, readingTime } from '../utils/format';
import '../styles/blog.css';

export default function PostPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', post: null, related: [] });

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading', post: null, related: [] });

    publicApi
      .getPost(slug)
      .then(({ post, related }) => alive && setState({ status: 'ready', post, related }))
      .catch(() => alive && setState({ status: 'error', post: null, related: [] }));

    return () => { alive = false; };
  }, [slug]);

  /* Keep the document title and meta description in step with the article. */
  useEffect(() => {
    if (state.status !== 'ready') return undefined;
    const previous = document.title;
    document.title = `${state.post.title} | Transpower Technologies Pvt. Ltd.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', state.post.excerpt);
    return () => { document.title = previous; };
  }, [state]);

  if (state.status === 'loading') {
    return (
      <article className="post-page">
        <div className="container"><div className="blog-loading">Loading article…</div></div>
      </article>
    );
  }

  if (state.status === 'error') {
    return (
      <article className="post-page">
        <div className="container">
          <div className="blog-empty">
            <p><strong>Article not found.</strong></p>
            <p>It may have been unpublished, or the link is out of date.</p>
            <p><Link to="/blog">Back to the blog</Link></p>
          </div>
        </div>
      </article>
    );
  }

  const { post, related } = state;

  return (
    <>
      <article className="post-page">
        <div className="container">
          <Link className="post-back" to="/blog">← All articles</Link>

          <header className="post-header">
            {post.tags.length > 0 && (
              <div className="blog-card-tags">
                {post.tags.map((tag) => (
                  <Link className="blog-card-tag" key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <h1>{post.title}</h1>

            <div className="post-meta">
              {post.author && <span>By {post.author}</span>}
              <span>{formatDate(post.publishedAt, { long: true })}</span>
              <span>{readingTime(post.content)} min read</span>
              <span>{post.views} views</span>
            </div>
          </header>

          {post.coverImage && (
            <div className="post-cover">
              <img src={assetUrl(post.coverImage)} alt={post.title} />
            </div>
          )}

          {/* Content is authored by the site admin in the panel, so its HTML is
              rendered as-is — see the trust note in the README. */}
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="post-cta">
            <h3>NEED A SPEC FOR YOUR SITE?</h3>
            <p>Our engineers size FRP gratings, cable trays, gearboxes and switchgear panels to your load and environment.</p>
            <a href="/#quote" className="btn btn-primary"><span>Request a B2B Quote</span></a>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">More <span className="text-orange">Articles</span></h2>
            <div className="blog-grid">
              {related.map((r) => <BlogCard key={r.id} post={r} showViews={false} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

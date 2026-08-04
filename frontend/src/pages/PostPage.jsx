import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi, assetUrl } from '../api/client';
import BlogCard from '../components/blog/BlogCard';
import { toDisplayHtml, decodeHtmlEntities } from '../utils/contentHtml';
import { formatDate, readingTime } from '../utils/format';
import '../styles/blog.css';

export default function PostPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', post: null, related: [] });

  useEffect(() => {
    if (slug === 'mccb-vs-acb-siemens-switchgear') {
      window.location.replace('/blog/mccb-vs-acb-switchgear-right-for-your-facility');
      return undefined;
    }

    if (slug && slug.startsWith('https-www-transpower-net-in-')) {
      const clean = slug.replace(/^https-www-transpower-net-in-/, '');
      window.location.replace(`/blog/${clean}`);
      return undefined;
    }

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
    const decodedTitle = decodeHtmlEntities(state.post.title);
    document.title = `${decodedTitle} | Transpower Technologies Pvt. Ltd.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', decodeHtmlEntities(state.post.excerpt));
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
  const decodedTitle = decodeHtmlEntities(post.title);
  const authorName = post.authorName || (typeof post.author === 'object' ? post.author?.name : post.author) || 'Kajal Zakhariya';

  return (
    <>
      <article className="post-page">
        <div className="container">
          <Link className="post-back" to="/blog">← All articles</Link>

          <header className="post-header">
            {post.tags && post.tags.length > 0 && (
              <div className="blog-card-tags">
                {post.tags.map((tag) => (
                  <Link className="blog-card-tag" key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>
                    {decodeHtmlEntities(tag)}
                  </Link>
                ))}
              </div>
            )}

            <h1>{decodedTitle}</h1>

            <div className="post-meta">
              <span>By {authorName}</span>
              <span className="post-meta-divider">·</span>
              <span>{formatDate(post.publishedAt, { long: true })}</span>
              <span className="post-meta-divider">·</span>
              <span>{readingTime(post.content)} min read</span>
            </div>
          </header>

          <div className="post-cover">
            <img 
              src={post.coverImage ? assetUrl(post.coverImage) : '/assets/images/hero_frp_grating.webp'} 
              alt={post.coverAlt ? decodeHtmlEntities(post.coverAlt) : decodedTitle} 
              width="800" 
              height="450" 
              decoding="async" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/hero_frp_grating.webp';
              }}
            />
          </div>

          {/* Content is authored by the site admin in the panel, so its HTML is
              rendered as-is — see the trust note in the README. Only the upload
              paths are touched, so inline images resolve against the API host
              rather than this one. */}
          <div className="post-body" dangerouslySetInnerHTML={{ __html: toDisplayHtml(post.content) }} />

          <div className="post-cta">
            <h3>NEED A SPEC FOR YOUR SITE?</h3>
            <p>Our group engineers size FRP gratings, cable trays, gearboxes and switchgear panels to your load and environment.</p>
            <a href="/#quote" className="btn btn-primary"><span>Request a B2B Quote</span></a>
          </div>
        </div>
      </article>

      {related && related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">More <span className="text-orange">Articles</span></h2>
            <div className="blog-grid">
              {related.map((r) => <BlogCard key={r.id || r._id} post={r} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

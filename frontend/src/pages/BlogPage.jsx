import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '../api/client';
import BlogCard from '../components/blog/BlogCard';
import SEO from '../components/common/SEO';
import '../styles/blog.css';

const PAGE_SIZE = 9;

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get('tag') || '';

  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');   // debounced copy of `search`
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState({ posts: [], totalPages: 1 });
  const [tags, setTags]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  /* Debounce the search box so typing doesn't fire a request per keystroke. */
  useEffect(() => {
    const id = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    publicApi
      .listPosts({ page, limit: PAGE_SIZE, tag, q: query })
      .then((res) => alive && setData(res))
      .catch((ex) => alive && setError(ex.message))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [page, tag, query]);

  useEffect(() => {
    publicApi.getTags().then(({ tags: t }) => setTags(t)).catch(() => {});
  }, []);

  function selectTag(next) {
    setSearchParams(next ? { tag: next } : {});
    setPage(1);
  }

  function changePage(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <SEO 
        title="Technical Engineering Blog & Guides" 
        description="Read technical guides, comparisons, specifications, and installation tips on industrial FRP gratings, composite cable trays, and gearbox solutions." 
        keywords="engineering blog, FRP articles, composite materials guides, industrial power systems, gearbox specs, Transpower blog"
      />
      <section className="blog-hero">
        <div className="container">
          <div className="badge-tag">📰 Technical Insights</div>
          <h1>ENGINEERING <span className="text-orange">INSIGHTS</span></h1>
          <p>
            Specification guides, material comparisons and site-installation notes from our FRP composite
            and power transmission engineers.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-toolbar">
            <input
              type="search"
              className="form-control"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {tags.length > 0 && (
              <div className="tag-filters">
                <button
                  type="button"
                  className={`tag-chip${tag === '' ? ' active' : ''}`}
                  onClick={() => selectTag('')}
                >
                  All
                </button>
                {tags.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    className={`tag-chip${tag === t.name ? ' active' : ''}`}
                    onClick={() => selectTag(t.name)}
                  >
                    {t.name} ({t.count})
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="blog-grid">
            {loading && <div className="blog-loading">Loading articles…</div>}

            {!loading && error && (
              <div className="blog-empty">Could not load articles — {error}</div>
            )}

            {!loading && !error && data.posts.length === 0 && (
              <div className="blog-empty">
                <p><strong>No articles found{tag || query ? ' for this filter' : ' yet'}.</strong></p>
                <p>Check back soon — our engineers publish new technical notes regularly.</p>
              </div>
            )}

            {!loading && !error && data.posts.map((post) => <BlogCard key={post.id} post={post} />)}
          </div>

          {data.totalPages > 1 && !loading && (
            <div className="blog-pagination">
              <button
                type="button" className="page-btn"
                disabled={page === 1} onClick={() => changePage(page - 1)}
              >
                ‹ Prev
              </button>

              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n} type="button"
                  className={`page-btn${n === page ? ' active' : ''}`}
                  onClick={() => changePage(n)}
                >
                  {n}
                </button>
              ))}

              <button
                type="button" className="page-btn"
                disabled={page === data.totalPages} onClick={() => changePage(page + 1)}
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

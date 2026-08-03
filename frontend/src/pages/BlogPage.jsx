import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '../api/client';
import BlogCard from '../components/blog/BlogCard';
import SEO from '../components/common/SEO';
import '../styles/blog.css';

const PAGE_SIZE = 9;
const PILL_LIMIT = 4;   // tags shown as pills; the rest live in the dropdown

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  /* Close the categories dropdown on an outside click or Escape. */
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
    const onKey  = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  function selectTag(next) {
    setSearchParams(next ? { tag: next } : {});
    setPage(1);
    setMenuOpen(false);
  }

  function changePage(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pillTags = tags.slice(0, PILL_LIMIT);
  /* An active tag from the dropdown is promoted into the pill row so the
     current filter is always visible. */
  if (tag && !pillTags.some((t) => t.name === tag)) {
    const active = tags.find((t) => t.name === tag);
    if (active) pillTags[pillTags.length - 1] = active;
  }

  return (
    <>
      <SEO
        title="Technical Engineering Blog & Guides"
        description="Read technical guides, comparisons, specifications, and installation tips on industrial FRP gratings, composite cable trays, and gearbox solutions."
        keywords="engineering blog, FRP articles, composite materials guides, industrial power systems, gearbox specs, Transpower blog"
      />

      <section className="blog-hero">
        <div className="container blog-hero-inner">
          <div className="blog-hero-copy">
            <h1>Our Blog &amp; Insight</h1>
            <p>
              We delve into the world of FRP composites and power transmission — exploring the latest
              standards, material comparisons and site-installation practices that keep industrial
              plants running.
            </p>
          </div>
          <div className="blog-hero-art">
            <img src="/assets/images/blog_hero_art.svg" alt="" aria-hidden="true" width="400" height="300" decoding="async" />
          </div>
        </div>
      </section>

      <section className="blog-listing">
        <div className="container">
          <div className="blog-toolbar">
            <div className="tag-filters">
              <button
                type="button"
                className={`tag-chip${tag === '' ? ' active' : ''}`}
                onClick={() => selectTag('')}
              >
                All
              </button>
              {pillTags.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  className={`tag-chip${tag === t.name ? ' active' : ''}`}
                  onClick={() => selectTag(t.name)}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div className="blog-toolbar-right">
              <input
                type="search"
                className="blog-search"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="blog-categories" ref={menuRef}>
                <button
                  type="button"
                  className={`blog-categories-btn${menuOpen ? ' open' : ''}`}
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  aria-haspopup="listbox"
                >
                  <span className="blog-categories-icon" aria-hidden="true" />
                  Categories
                  <span className="blog-categories-caret" aria-hidden="true" />
                </button>

                {menuOpen && (
                  <div className="blog-categories-menu" role="listbox">
                    <button
                      type="button" role="option" aria-selected={tag === ''}
                      className={`blog-categories-item${tag === '' ? ' active' : ''}`}
                      onClick={() => selectTag('')}
                    >
                      All articles
                    </button>
                    {tags.map((t) => (
                      <button
                        key={t.name} type="button" role="option" aria-selected={tag === t.name}
                        className={`blog-categories-item${tag === t.name ? ' active' : ''}`}
                        onClick={() => selectTag(t.name)}
                      >
                        {t.name} <span>{t.count}</span>
                      </button>
                    ))}
                    {tags.length === 0 && <div className="blog-categories-empty">No categories yet</div>}
                  </div>
                )}
              </div>
            </div>
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

            {!loading && !error && data.posts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
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

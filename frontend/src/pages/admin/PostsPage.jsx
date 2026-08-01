import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import { formatDate } from '../../utils/format';

const STATUS_TABS = [
  { key: 'all',       label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft',     label: 'Drafts' },
];

export default function PostsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [posts, setPosts]   = useState([]);
  const [stats, setStats]   = useState({ total: 0, published: 0, drafts: 0, views: 0 });
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [query, setQuery]   = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleXmlUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const res = await adminApi.uploadXml(file);
      toast(res.message || `Successfully imported blogs! Created: ${res.created}, Updated: ${res.updated}`, false);
      load();
    } catch (ex) {
      toast(ex.message, true);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 250);
    return () => clearTimeout(id);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.listPosts({ status: status === 'all' ? '' : status, q: query });
      setPosts(res.posts);
      setStats(res.stats);
    } catch (ex) {
      toast(ex.message, true);
    } finally {
      setLoading(false);
    }
  }, [status, query, toast]);

  useEffect(() => { load(); }, [load]);

  return (
    <section className="view">
      <header className="view-head">
        <div>
          <h1>Blog Posts</h1>
          <p className="muted">Write, publish and edit articles shown on the public blog.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <label className="btn btn-ghost" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px dashed var(--border)' }}>
            <span>{uploading ? 'Importing...' : '📥 Import XML'}</span>
            <input 
              type="file" 
              accept=".xml" 
              disabled={uploading}
              onChange={handleXmlUpload} 
              style={{ display: 'none' }} 
            />
          </label>
          <Link to="/admin/posts/new" className="btn btn-primary">+ New Post</Link>
        </div>
      </header>

      <div className="stat-row">
        {[
          ['Total Posts', stats.total],
          ['Published',   stats.published],
          ['Drafts',      stats.drafts],
          ['Total Views', stats.views],
        ].map(([label, value]) => (
          <div className="stat" key={label}>
            <div className="stat-val">{value}</div>
            <div className="stat-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <input
          type="search" className="input" placeholder="Search posts by title…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <div className="seg">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key} type="button"
              className={`seg-btn${status === tab.key ? ' active' : ''}`}
              onClick={() => setStatus(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="post-list">
        {loading && <div className="empty-state">Loading posts…</div>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <p><strong>No posts yet.</strong></p>
            <p className="muted">Click “+ New Post” to write your first article.</p>
          </div>
        )}

        {!loading && posts.map((post) => (
          <article
            className="post-row" key={post.id}
            role="button" tabIndex={0}
            onClick={() => navigate(`/admin/posts/${post.id}`)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/admin/posts/${post.id}`)}
          >
            {post.coverImage
              ? <img className="post-thumb" src={post.coverImage} alt="" />
              : <div className="post-thumb placeholder">🖼</div>}

            <div className="post-info">
              <h2>{post.title}</h2>
              <p>{post.excerpt || <span className="muted">No excerpt</span>}</p>
              <div className="post-meta">
                <span className={`pill pill-${post.status}`}>{post.status}</span>
                <span>
                  {post.status === 'published'
                    ? formatDate(post.publishedAt)
                    : `Updated ${formatDate(post.updatedAt)}`}
                </span>
                <span>{post.views} views</span>
                {post.tags.map((tag) => <span className="pill pill-tag" key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

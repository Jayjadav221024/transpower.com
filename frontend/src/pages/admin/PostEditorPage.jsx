import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import MediaPicker from '../../components/admin/MediaPicker';
import { formatDate } from '../../utils/format';

const BLANK = {
  title: '', excerpt: '', content: '', tags: '', slug: '', coverImage: '', status: 'draft',
};

export default function PostEditorPage() {
  const { id } = useParams();
  const isNew  = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const contentRef = useRef(null);

  const [form, setForm]       = useState(BLANK);
  const [meta, setMeta]       = useState(null);      // server-side details, edit mode only
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [picker, setPicker]   = useState(null);      // 'cover' | 'content' | null

  /* Load an existing post. */
  useEffect(() => {
    if (isNew) { setForm(BLANK); setMeta(null); setLoading(false); return undefined; }

    let alive = true;
    setLoading(true);
    adminApi
      .getPost(id)
      .then(({ post }) => {
        if (!alive) return;
        setForm({
          title: post.title, excerpt: post.excerpt, content: post.content,
          tags: post.tags.join(', '), slug: post.slug,
          coverImage: post.coverImage, status: post.status,
        });
        setMeta(post);
      })
      .catch((ex) => alive && setError(ex.message))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [id, isNew]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const save = useCallback(
    async (status) => {
      if (!form.title.trim()) {
        setError('A title is required before saving.');
        return;
      }

      setSaving(true);
      setError('');

      try {
        const payload = { ...form, status };
        const { post } = isNew
          ? await adminApi.createPost(payload)
          : await adminApi.updatePost(id, payload);

        setMeta(post);
        setForm((f) => ({ ...f, slug: post.slug, excerpt: post.excerpt, status: post.status }));
        toast(status === 'published' ? 'Post is live on the blog' : 'Draft saved');

        if (isNew) navigate(`/admin/posts/${post.id}`, { replace: true });
      } catch (ex) {
        setError(ex.message);
      } finally {
        setSaving(false);
      }
    },
    [form, id, isNew, navigate, toast]
  );

  /* Ctrl/Cmd+S saves without leaving the keyboard. */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save(form.status === 'published' ? 'published' : 'draft');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [save, form.status]);

  async function handleDelete() {
    if (!window.confirm('Delete this post permanently? This cannot be undone.')) return;
    try {
      await adminApi.deletePost(id);
      toast('Post deleted');
      navigate('/admin/posts', { replace: true });
    } catch (ex) {
      toast(ex.message, true);
    }
  }

  /* Insert an <img> tag at the caret, not blindly at the end. */
  function insertIntoContent(image) {
    const tag = `\n<img src="${image.url}" alt="${image.alt}" loading="lazy">\n`;
    const box = contentRef.current;
    const at  = box ? box.selectionStart : form.content.length;
    setForm((f) => ({ ...f, content: f.content.slice(0, at) + tag + f.content.slice(at) }));
  }

  if (loading) return <div className="empty-state">Loading post…</div>;

  return (
    <section className="view">
      <header className="view-head">
        <div>
          <h1>{isNew ? 'New Post' : 'Edit Post'}</h1>
          <p className="muted">
            {form.status === 'published' && meta
              ? `Published ${formatDate(meta.publishedAt)} · /blog/${form.slug}`
              : 'Draft — not visible on the site yet.'}
          </p>
        </div>
        <div className="head-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/posts')}>
            Cancel
          </button>
          <button type="button" className="btn btn-outline" onClick={() => save('draft')} disabled={saving}>
            Save Draft
          </button>
          <button type="button" className="btn btn-primary" onClick={() => save('published')} disabled={saving}>
            {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="editor-grid">
        <div className="editor-main">
          <label className="field">
            <span>Title</span>
            <input
              type="text" className="input input-lg" maxLength={200}
              placeholder="e.g. Why FRP Gratings Outlast Steel in Chemical Plants"
              value={form.title} onChange={update('title')}
            />
          </label>

          <label className="field">
            <span>Excerpt <em>optional — auto-generated from the body if left blank</em></span>
            <textarea
              className="input" rows="2" maxLength={400}
              placeholder="One or two lines shown on the blog listing card."
              value={form.excerpt} onChange={update('excerpt')}
            />
          </label>

          <label className="field">
            <span>Content <em>HTML allowed: &lt;p&gt; &lt;h2&gt; &lt;ul&gt; &lt;strong&gt; &lt;img&gt; &lt;a&gt;</em></span>
            <textarea
              ref={contentRef} className="input input-editor" rows="20"
              placeholder="Write the article here…"
              value={form.content} onChange={update('content')}
            />
          </label>

          <div className="inline-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setPicker('content')}>
              Insert image into content
            </button>
            <span className="muted small">Drops an &lt;img&gt; tag at the cursor position.</span>
          </div>
        </div>

        <aside className="editor-side">
          <div className="panel">
            <h3>Cover Image</h3>
            <div className={`cover-preview${form.coverImage ? '' : ' empty'}`}>
              {form.coverImage
                ? <img src={form.coverImage} alt="Cover preview" />
                : 'No cover image selected'}
            </div>
            <button type="button" className="btn btn-outline btn-block btn-sm" onClick={() => setPicker('cover')}>
              Choose from library
            </button>
            <button
              type="button" className="btn btn-ghost btn-block btn-sm"
              onClick={() => setForm((f) => ({ ...f, coverImage: '' }))}
            >
              Remove cover
            </button>
          </div>

          <div className="panel">
            <h3>Tags</h3>
            <input
              type="text" className="input" placeholder="frp, gratings, safety"
              value={form.tags} onChange={update('tags')}
            />
            <p className="muted small">Comma separated — used for blog filtering.</p>
          </div>

          <div className="panel">
            <h3>URL Slug</h3>
            <input
              type="text" className="input" placeholder="auto-generated from title"
              value={form.slug} onChange={update('slug')}
            />
            <p className="muted small">The post lives at <code>/blog/&lt;slug&gt;</code>.</p>
          </div>

          {meta && (
            <div className="panel">
              <h3>Details</h3>
              <dl className="meta-list">
                <dt>Status</dt><dd>{meta.status}</dd>
                <dt>Views</dt><dd>{meta.views}</dd>
                <dt>Created</dt><dd>{formatDate(meta.createdAt)}</dd>
                <dt>Updated</dt><dd>{formatDate(meta.updatedAt)}</dd>
              </dl>
              <button type="button" className="btn btn-danger btn-block btn-sm" onClick={handleDelete}>
                Delete Post
              </button>
            </div>
          )}
        </aside>
      </div>

      {picker && (
        <MediaPicker
          mode={picker}
          onClose={() => setPicker(null)}
          onSelect={(image) => {
            if (picker === 'cover') setForm((f) => ({ ...f, coverImage: image.url }));
            else insertIntoContent(image);
            setPicker(null);
          }}
        />
      )}
    </section>
  );
}

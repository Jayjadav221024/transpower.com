import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi, assetUrl } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import MediaPicker from '../../components/admin/MediaPicker';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { formatDate } from '../../utils/format';
import { slugify } from '../../utils/slugify';

const BLANK = {
  title: '', excerpt: '', content: '', tags: '', slug: '', coverImage: '', coverAlt: '', status: 'draft',
};

export default function PostEditorPage() {
  const { id } = useParams();
  const isNew  = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const editorRef = useRef(null);

  /* Once the slug is hand-edited it stops tracking the title, matching how
     WordPress stops touching a permalink you have set yourself. */
  const [slugTouched, setSlugTouched] = useState(false);

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
          coverImage: post.coverImage, coverAlt: post.coverAlt || '', status: post.status,
        });
        setMeta(post);
      })
      .catch((ex) => alive && setError(ex.message))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [id, isNew]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  /* A published URL is left alone — changing it would break every existing
     link to the article. Drafts keep following the title until edited. */
  const slugFollowsTitle = form.status !== 'published' && !slugTouched;

  const updateTitle = (e) => {
    const title = e.target.value;
    setForm((f) => ({ ...f, title, slug: slugFollowsTitle ? slugify(title) : f.slug }));
  };

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
    const tag = `<img src="${image.url}" alt="${image.alt}" loading="lazy">`;
    editorRef.current?.insertHtml(tag);
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
              value={form.title} onChange={updateTitle}
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

          <div className="field">
            <span>Content</span>
            <RichTextEditor
              ref={editorRef}
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              onRequestImage={() => setPicker('content')}
            />
          </div>

          <div className="inline-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setPicker('content')}>
              Insert image into content
            </button>
            <span className="muted small">Drops the image at the cursor position.</span>
          </div>
        </div>

        <aside className="editor-side">
          <div className="panel">
            <h3>Cover Image</h3>
            <div className={`cover-preview${form.coverImage ? '' : ' empty'}`}>
              {form.coverImage
                ? <img src={assetUrl(form.coverImage)} alt={form.coverAlt || 'Cover preview'} />
                : 'No cover image selected'}
            </div>
            <button type="button" className="btn btn-outline btn-block btn-sm" onClick={() => setPicker('cover')}>
              Choose from library
            </button>
            <button
              type="button" className="btn btn-ghost btn-block btn-sm"
              onClick={() => setForm((f) => ({ ...f, coverImage: '', coverAlt: '' }))}
            >
              Remove cover
            </button>

            <label className="field" style={{ marginTop: '0.75rem' }}>
              <span>Alt Text <em>optional — falls back to the post title</em></span>
              <input
                type="text" className="input" maxLength={200}
                placeholder="e.g. FRP grating walkway installed at a chemical plant"
                value={form.coverAlt} onChange={update('coverAlt')}
              />
            </label>
            <p className="muted small">
              Describes the image for screen readers and search engines. Skip phrases like
              “image of” — just say what is shown.
            </p>
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
            <h3>Permalink</h3>
            <p className="permalink-preview">
              /blog/<strong>{form.slug || slugify(form.title) || '…'}</strong>
            </p>
            <input
              type="text" className="input" placeholder="auto-generated from title"
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
              /* Normalise on blur rather than per keystroke, so typing a space
                 mid-word doesn't jump the caret over a hyphen. */
              onBlur={(e) => setForm((f) => ({ ...f, slug: e.target.value.trim() ? slugify(e.target.value) : '' }))}
            />
            {slugFollowsTitle ? (
              <p className="muted small">Following the title. Edit to set it yourself.</p>
            ) : form.status === 'published' ? (
              <p className="muted small">Locked to the title no longer — changing this breaks existing links.</p>
            ) : (
              <button
                type="button" className="btn btn-ghost btn-sm"
                onClick={() => { setSlugTouched(false); setForm((f) => ({ ...f, slug: slugify(f.title) })); }}
              >
                Reset to title
              </button>
            )}
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
            /* Seed the alt from the library entry, but never clobber alt text
               the author has already written for this post. */
            if (picker === 'cover') {
              setForm((f) => ({
                ...f,
                coverImage: image.url,
                coverAlt: f.coverAlt || image.alt || '',
              }));
            }
            else insertIntoContent(image);
            setPicker(null);
          }}
        />
      )}
    </section>
  );
}

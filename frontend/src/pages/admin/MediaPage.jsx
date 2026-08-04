import { useEffect, useRef, useState } from 'react';
import { adminApi, assetUrl } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import { formatDate, formatFileSize } from '../../utils/format';
import { IMAGE_ACCEPT, isImageFile } from '../../utils/media';

export default function MediaPage() {
  const toast = useToast();
  const fileInput = useRef(null);

  const [media, setMedia]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(0);   // number of files in flight
  const [dragging, setDragging]   = useState(false);

  useEffect(() => {
    let alive = true;
    adminApi
      .listMedia()
      .then(({ media: list }) => alive && setMedia(list))
      .catch((ex) => alive && toast(ex.message, true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [toast]);

  async function upload(fileList) {
    const files = [...(fileList || [])].filter(isImageFile);
    if (!files.length) {
      toast('Only image files can be uploaded', true);
      return;
    }

    setUploading(files.length);
    try {
      const { media: uploaded } = await adminApi.uploadMedia(files);
      setMedia((prev) => [...uploaded, ...prev]);
      toast(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
    } catch (ex) {
      toast(ex.message, true);
    } finally {
      setUploading(0);
    }
  }

  async function copyUrl(image) {
    const full = window.location.origin + image.url;
    try {
      await navigator.clipboard.writeText(full);
      toast('Image URL copied');
    } catch {
      window.prompt('Copy this URL:', full);
    }
  }

  async function remove(image) {
    if (!window.confirm(`Delete "${image.originalName}"? Posts using it will show a broken image.`)) return;
    try {
      await adminApi.deleteMedia(image.id);
      setMedia((prev) => prev.filter((m) => m.id !== image.id));
      toast('Image deleted');
    } catch (ex) {
      toast(ex.message, true);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer?.files);
  }

  return (
    <section className="view">
      <header className="view-head">
        <div>
          <h1>Image Library</h1>
          <p className="muted">JPG, PNG, WebP, GIF, AVIF or SVG — up to 8 MB each, 10 at a time.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => fileInput.current?.click()}>
          + Upload Images
        </button>
      </header>

      <div
        className={`dropzone${dragging ? ' dragover' : ''}`}
        role="button" tabIndex={0}
        onClick={() => fileInput.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileInput.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <strong>Drag &amp; drop images here</strong>
        <span className="muted">or click to browse your computer</span>
      </div>

      <input
        ref={fileInput} type="file" accept={IMAGE_ACCEPT} multiple hidden
        onChange={(e) => { upload(e.target.files); e.target.value = ''; }}
      />

      {uploading > 0 && (
        <div className="alert alert-info">
          Uploading {uploading} image{uploading > 1 ? 's' : ''}…
        </div>
      )}

      <div className="media-grid">
        {loading && <div className="empty-state" style={{ gridColumn: '1/-1' }}>Loading library…</div>}

        {!loading && media.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <p><strong>No images uploaded yet.</strong></p>
            <p className="muted">Drop files above to build your library.</p>
          </div>
        )}

        {media.map((m) => (
          <div className="media-card" key={m.id}>
            <img src={assetUrl(m.url)} alt={m.alt} loading="lazy" />
            <div className="media-body">
              <div className="media-name" title={m.originalName}>{m.originalName}</div>
              <div className="media-sub">{formatFileSize(m.size)} · {formatDate(m.createdAt)}</div>
              <div className="media-actions">
                <button type="button" className="btn btn-outline" onClick={() => copyUrl(m)}>Copy URL</button>
                <button type="button" className="btn btn-danger" onClick={() => remove(m)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

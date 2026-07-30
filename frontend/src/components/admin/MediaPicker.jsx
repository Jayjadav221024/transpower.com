import { useEffect, useRef, useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from './Toast';

/**
 * Modal image chooser. `mode` only changes the heading — the caller decides
 * what to do with the picked image via onSelect({ url, alt }).
 */
export default function MediaPicker({ mode = 'cover', onSelect, onClose }) {
  const toast = useToast();
  const fileInput = useRef(null);

  const [media, setMedia]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let alive = true;
    adminApi
      .listMedia()
      .then(({ media: list }) => alive && setMedia(list))
      .catch((ex) => alive && toast(ex.message, true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [toast]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleUpload(files) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const { media: uploaded } = await adminApi.uploadMedia(files);
      setMedia((prev) => [...uploaded, ...prev]);
      toast(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
    } catch (ex) {
      toast(ex.message, true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <header className="modal-head">
          <h2>{mode === 'cover' ? 'Choose a cover image' : 'Insert image into content'}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>×</button>
        </header>

        <div className="modal-body">
          <button
            type="button" className="btn btn-outline btn-sm"
            onClick={() => fileInput.current?.click()} disabled={uploading}
          >
            {uploading ? 'Uploading…' : '+ Upload new'}
          </button>
          <input
            ref={fileInput} type="file" accept="image/*" multiple hidden
            onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }}
          />

          <div className="media-grid picker-grid">
            {loading && <div className="empty-state" style={{ gridColumn: '1/-1' }}>Loading library…</div>}

            {!loading && media.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <p className="muted">No images yet — upload one to get started.</p>
              </div>
            )}

            {media.map((m) => (
              <div
                className="media-card" key={m.id}
                role="button" tabIndex={0}
                onClick={() => onSelect(m)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(m)}
              >
                <img src={m.url} alt={m.alt} loading="lazy" />
                <div className="media-body">
                  <div className="media-name" title={m.originalName}>{m.originalName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

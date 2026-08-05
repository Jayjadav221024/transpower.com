import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import SEO from '../components/common/SEO';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../data/gallery';
import { SITE_ORIGIN } from '../config/site';
import { assetUrl, publicApi } from '../api/client';
import '../styles/gallery.css';

/* The admin panel stores overrides against [data-edit-key="…"], so anything
   changed in the customiser has to win over the placeholder in gallery.js. */
const overrideFor = (overrides, key) => overrides?.[`[data-edit-key="${key}"]`];

const captionKey = (item) => `${item.key}_caption`;
const detailKey  = (item) => `${item.key}_detail`;

/* Caption and detail hang off the image key, so retitling a swapped photo is
   the same click-and-type as replacing it. Resolving them here — rather than
   letting App.jsx rewrite the DOM afterwards — means the lightbox and the
   aria-labels read the new title too, not just the tile the editor clicked. */
function resolveItem(item, overrides) {
  const caption = overrideFor(overrides, captionKey(item)) || item.caption;
  return {
    ...item,
    src: assetUrl(overrideFor(overrides, item.key) || item.src),
    caption,
    detail: overrideFor(overrides, detailKey(item)) ?? item.detail,
    /* A swapped photo makes the hand-written alt text stale, and alt is not
       something the customiser can reach. Falling back to the new title keeps
       it describing the photo actually on screen. */
    alt: overrideFor(overrides, captionKey(item)) ? caption : item.alt,
  };
}

export default function GalleryPage() {
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState(null);   // index into `visible`, or null
  const [overrides, setOverrides] = useState(null);
  const triggerRef = useRef(null);

  /* Same endpoint App.jsx uses for DOM-level overrides. Reading it here too
     means the <img> is correct on first paint instead of being rewritten a
     moment later, which would otherwise show the placeholder then flicker. */
  useEffect(() => {
    let cancelled = false;
    publicApi.getPageContent('gallerypage')
      .then((res) => {
        if (!cancelled && res?.content?.overrides) setOverrides(res.content.overrides);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(
    () => (active === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === active))
      .map((i) => resolveItem(i, overrides)),
    [active, overrides],
  );

  /* Only offer a filter chip if that category actually has photos, so removing
     entries from gallery.js can never leave a chip that shows nothing. */
  const categories = useMemo(
    () => GALLERY_CATEGORIES.filter(
      (c) => c.id === 'all' || GALLERY_ITEMS.some((i) => i.category === c.id),
    ),
    [],
  );

  const close = useCallback(() => {
    setLightbox(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback((delta) => {
    setLightbox((i) => (i === null ? null : (i + delta + visible.length) % visible.length));
  }, [visible.length]);

  /* Keyboard control + background scroll lock while the lightbox is open. */
  useEffect(() => {
    if (lightbox === null) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };

    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [lightbox, close, step]);

  const openAt = (index, e) => {
    triggerRef.current = e.currentTarget;
    setLightbox(index);
  };

  const current = lightbox === null ? null : visible[lightbox];

  return (
    <>
      <SEO
        title="Gallery"
        description="Photographs of the Transpower Technologies manufacturing facility in Vadodara, our FRP gratings, cable trays, gear boxes and switchgear products, and completed site installations."
        keywords="Transpower gallery, FRP grating factory photos, cable tray manufacturing Vadodara, industrial gear box supplier photos, Transpower facility"
        canonical="/gallery"
        image={GALLERY_ITEMS[0]?.src}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: 'Transpower Technologies — Company Gallery',
          url: `${SITE_ORIGIN}/gallery`,
          image: GALLERY_ITEMS.map((i) => `${SITE_ORIGIN}${i.src}`),
        }}
      />

      <section className="section gallery-hero">
        <div className="container">
          <div className="section-header">
            <div className="badge-tag">Inside Transpower</div>
            <h2 data-edit-page="gallerypage" data-edit-key="galleryTitle">
              Company <span className="text-orange">Gallery</span>
            </h2>
            <p data-edit-page="gallerypage" data-edit-key="gallerySubtitle">
              Our manufacturing floor, our products and the sites they are installed on.
            </p>
          </div>

          {categories.length > 2 && (
            <div className="gallery-filters" role="tablist" aria-label="Filter gallery by category">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active === c.id}
                  className={`gallery-chip ${active === c.id ? 'is-active' : ''}`}
                  onClick={() => { setActive(c.id); setLightbox(null); }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <div className="gallery-grid">
            {visible.map((item, index) => (
              <button
                key={item.key}
                type="button"
                className="gallery-tile"
                onClick={(e) => openAt(index, e)}
                aria-label={`Open photo: ${item.caption}`}
              >
                <img
                  data-edit-page="gallerypage"
                  data-edit-key={item.key}
                  src={item.src}
                  alt={item.alt}
                  width="400"
                  height="300"
                  loading={index < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <span className="gallery-tile-overlay">
                  <span
                    className="gallery-tile-caption"
                    data-edit-page="gallerypage"
                    data-edit-key={captionKey(item)}
                  >
                    {item.caption}
                  </span>
                  {/* Rendered even when empty so a slot that starts without a
                      detail line still has something to click in the editor. */}
                  <span
                    className="gallery-tile-detail"
                    data-edit-page="gallerypage"
                    data-edit-key={detailKey(item)}
                  >
                    {item.detail}
                  </span>
                </span>
                <span className="gallery-tile-zoom" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
                    <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </span>
              </button>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="gallery-empty">No photos in this category yet.</p>
          )}
        </div>
      </section>

      {current && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          onClick={close}
        >
          <button type="button" className="gallery-lb-close" onClick={close} aria-label="Close photo">&times;</button>

          {visible.length > 1 && (
            <button
              type="button"
              className="gallery-lb-nav prev"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous photo"
            >
              &#8249;
            </button>
          )}

          {/* Stop propagation so clicking the photo itself does not close. */}
          <figure className="gallery-lb-figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} decoding="async" />
            <figcaption>
              <strong>{current.caption}</strong>
              {current.detail && <span>{current.detail}</span>}
              <span className="gallery-lb-count">{lightbox + 1} / {visible.length}</span>
            </figcaption>
          </figure>

          {visible.length > 1 && (
            <button
              type="button"
              className="gallery-lb-nav next"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next photo"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </>
  );
}

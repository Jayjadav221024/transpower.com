import { useEffect, useRef, useState } from 'react';
import { HERO_PRODUCTS } from '../../data/products';
import { GradientShimmer } from '../ui/gradient-shimmer';
import { assetUrl } from '../../api/client';

/* 3s was not long enough to read a product name, let alone the description
   under it — the slide changed while a visitor was still reaching for the chip
   row. Six gives the copy time to be read and halves how often the crossfade
   interrupts. */
const AUTO_MS = 6000;
const TEXT_SWAP_MS = 240;   // midpoint of the 0.5s image crossfade

export default function HeroCarousel({ pageData }) {
  const [index, setIndex]     = useState(0);   // product whose text is shown
  const [imgIndex, setImgIndex] = useState(0); // product whose image is on the active layer
  const [activeLayer, setActiveLayer] = useState('a');
  const [layers, setLayers]   = useState({ a: HERO_PRODUCTS[0], b: null });
  const [fading, setFading]   = useState(false);
  const [paused, setPaused]   = useState(false);

  const textTimer = useRef(null);
  const doneTimer = useRef(null);
  const dotsContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* Crossfade: paint the incoming image on the hidden layer, flip which layer
     is visible, and swap the text at the midpoint of the fade. */
  function goTo(next) {
    if (next === imgIndex || fading) return;
    setFading(true);
    setImgIndex(next);

    const incoming = activeLayer === 'a' ? 'b' : 'a';
    setLayers((prev) => ({ ...prev, [incoming]: HERO_PRODUCTS[next] }));

    // midpoint: swap text content
    textTimer.current = setTimeout(() => {
      setIndex(next);
      setActiveLayer(incoming);
    }, TEXT_SWAP_MS);

    // end of 0.5s transition: declare done
    doneTimer.current = setTimeout(() => {
      setFading(false);
    }, 500);
  }

  // Auto-advance loop (3s)
  useEffect(() => {
    if (paused || fading) return;
    const id = setTimeout(() => goTo((imgIndex + 1) % HERO_PRODUCTS.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [imgIndex, paused, fading]);

  // Clean up timers on unmount — both, or a navigation mid-crossfade leaves a
  // setState firing against a component that is gone.
  useEffect(() => {
    return () => {
      clearTimeout(textTimer.current);
      clearTimeout(doneTimer.current);
    };
  }, []);

  // Keep the active chip centred inside its own strip on mobile.
  // Scroll the strip directly instead of scrollIntoView(): scrollIntoView also
  // walks up and scrolls the window, so every 3s auto-advance would yank the
  // page back up to the hero while the visitor is reading further down.
  useEffect(() => {
    const strip = dotsContainerRef.current;
    if (!strip) return;
    if (strip.scrollWidth <= strip.clientWidth) return;   // nothing to scroll
    const activeChip = strip.querySelector('.dot.active');
    if (!activeChip) return;
    const stripRect = strip.getBoundingClientRect();
    const chipRect = activeChip.getBoundingClientRect();
    const left = strip.scrollLeft + (chipRect.left - stripRect.left)
               - (strip.clientWidth - chipRect.width) / 2;
    const max = strip.scrollWidth - strip.clientWidth;
    strip.scrollTo({ left: Math.min(Math.max(0, left), max), behavior: 'smooth' });
  }, [imgIndex]);

  // Touch handlers for swipes
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe left -> next slide
        goTo((imgIndex + 1) % HERO_PRODUCTS.length);
      } else {
        // swipe right -> previous slide
        goTo((imgIndex - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length);
      }
    }
  };

  const product = HERO_PRODUCTS[index];
  const pause  = () => setPaused(true);
  const resume = () => setPaused(false);

  // If index is 0 and pageData from database is available, override values
  const displayTitle = (index === 0 && pageData?.heroTitle) ? pageData.heroTitle : `${product.accent} ${product.rest}`;
  const displayDesc = (index === 0 && pageData?.heroSubtitle) ? pageData.heroSubtitle : product.desc;

  return (
    <section id="hero" className="hero-section">
      <div 
        className="container hero-grid"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Left: animated product copy ─────────────────────────────── */}
        <div
          className="hero-left-content"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {/* Only the per-slide copy crossfades. The chip row and the stats sit
              outside it: they do not change between slides, and fading them
              meant the control a visitor was about to tap went invisible. */}
          <div className={`hero-copy${fading ? ' is-fading' : ''}`}>
            <div className="badge-tag">{product.badge}</div>
            {/* `display: inline` overrides the shimmer's own inline-block.
                An inline-block is sized shrink-to-fit against the *containing
                block*, not the space left on the current line — so as soon as
                the title was long enough to exceed the column, the shimmer
                claimed the full width and shoved the "FRP" prefix onto a line
                of its own. Inline lets the two flow as one sentence.
                The prefix has to stay outside this element: the admin inline
                editor writes back whatever is inside it, keyed on
                data-edit-key, and would save the "FRP " along with the title. */}
            <h1>
              FRP <GradientShimmer gradient="orange" duration={2} spread={4} baseColor="var(--text-main)" style={{ display: 'inline' }} data-edit-page="homepage" data-edit-key="heroTitle">{displayTitle}</GradientShimmer>
            </h1>
            <p data-edit-page="homepage" data-edit-key="heroSubtitle">{displayDesc}</p>

            <div className="hero-feature-pills">
              {product.pills.map((pill) => (
                <div className="spec-pill" key={pill.text}>
                  <div className="spec-pill-icon">{pill.icon}</div>
                  <div>{pill.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chip Row slide selector */}
          {/* The active dot fills as a progress bar, so it has to know both how
              long a slide lasts and when the auto-advance is paused. The fill
              starts the moment the class lands, which is a crossfade ahead of
              the timer actually restarting — hence the TEXT_SWAP offset. */}
          <div
            className="carousel-dots"
            ref={dotsContainerRef}
            role="tablist"
            data-paused={paused}
            style={{ '--hero-dot-ms': `${AUTO_MS + 500}ms` }}
          >
            {HERO_PRODUCTS.map((p, i) => (
              <button
                key={p.accent + p.rest}
                className={`dot${i === imgIndex ? ' active' : ''}`}
                role="tab"
                aria-selected={i === imgIndex}
                aria-label={`Show ${p.accent} ${p.rest}`}
                onClick={() => goTo(i)}
              >
                <span className="dot-text">{p.accent} {p.rest}</span>
              </button>
            ))}
          </div>

          <div className="hero-inline-stats">
            <div>
              <strong>60+</strong>
              <span>Years Experience</span>
            </div>
            <div>
              <strong>8000+</strong>
              <span>Happy Customers</span>
            </div>
            <div>
              <strong>99%</strong>
              <span>Retention</span>
            </div>
            <div>
              <strong>10000+</strong>
              <span>Stock Keeping Units</span>
            </div>
          </div>
        </div>

        {/* ── Right: two-layer crossfading showcase ──────────────────── */}
        <div className="hero-center-product">
          <div className="hero-image-stage" onMouseEnter={pause} onMouseLeave={resume}>
            {['a', 'b'].map((layer) => {
              const item = layers[layer];
              if (!item) return null;
              const itemIdx = HERO_PRODUCTS.findIndex((p) => p.accent === item.accent);
              const imgSrc = (pageData && pageData[`heroImage_${itemIdx}`]) ? pageData[`heroImage_${itemIdx}`] : item.image;
              return (
                <img
                  key={layer}
                  src={assetUrl(imgSrc)}
                  data-edit-page="homepage"
                  data-edit-key={`heroImage_${itemIdx}`}
                  alt={activeLayer === layer ? item.imgAlt : ''}
                  className={`hero-product-image${activeLayer === layer ? ' is-active' : ''}`}
                  width="490"
                  height="390"
                  decoding="async"
                  fetchpriority={layer === "a" ? "high" : undefined}
                  aria-hidden={activeLayer !== layer}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom spec + quantity bar ─────────────────────────────────── */}
      <div className="container">
        <div className="hero-bottom-bar">
          <div className="bar-spec-item">
            <span className="bar-spec-label">Selected Model</span>
            <span className="bar-spec-value">{product.model}</span>
          </div>

          <div className="bar-spec-item">
            <span className="bar-spec-label">Resin Matrix</span>
            <span className="bar-spec-value">{product.resin}</span>
          </div>

          <a href="#quote" className="btn btn-primary">Request Factory Direct Quote</a>
        </div>
      </div>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="remove-black" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              3 3 3 0 -0.15
            " />
          </filter>
        </defs>
      </svg>
    </section>
  );
}

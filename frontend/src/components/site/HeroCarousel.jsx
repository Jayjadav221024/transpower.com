import { useEffect, useRef, useState } from 'react';
import { HERO_PRODUCTS } from '../../data/products';
import { GradientShimmer } from '../ui/gradient-shimmer';
import { assetUrl } from '../../api/client';

const AUTO_MS = 3000;
const TEXT_SWAP_MS = 240;   // midpoint of the 0.5s image crossfade

export default function HeroCarousel({ pageData }) {
  const [index, setIndex]     = useState(0);   // product whose text is shown
  const [imgIndex, setImgIndex] = useState(0); // product whose image is on the active layer
  const [activeLayer, setActiveLayer] = useState('a');
  const [layers, setLayers]   = useState({ a: HERO_PRODUCTS[0], b: null });
  const [fading, setFading]   = useState(false);
  const [paused, setPaused]   = useState(false);

  const textTimer = useRef(null);
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
    setTimeout(() => {
      setFading(false);
    }, 500);
  }

  // Auto-advance loop (3s)
  useEffect(() => {
    if (paused || fading) return;
    const id = setTimeout(() => goTo((imgIndex + 1) % HERO_PRODUCTS.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [imgIndex, paused, fading]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearTimeout(textTimer.current);
  }, []);

  // Auto-scroll active chip into view on mobile
  useEffect(() => {
    if (!dotsContainerRef.current) return;
    const activeChip = dotsContainerRef.current.querySelector('.dot.active');
    if (activeChip) {
      activeChip.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
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
          className={`hero-left-content${fading ? ' is-fading' : ''}`}
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          <div className="badge-tag">{product.badge}</div>
          <h1>
            FRP <GradientShimmer gradient="orange" duration={2} spread={4} baseColor="var(--text-main)" data-edit-page="homepage" data-edit-key="heroTitle">{displayTitle}</GradientShimmer>
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

          {/* Chip Row slide selector */}
          <div 
            className="carousel-dots" 
            ref={dotsContainerRef} 
            role="tablist"
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
                  fetchPriority={layer === 'a' ? 'high' : undefined}
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

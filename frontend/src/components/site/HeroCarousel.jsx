import { useEffect, useRef, useState } from 'react';
import { HERO_PRODUCTS } from '../../data/products';
import { GradientShimmer } from '../ui/gradient-shimmer';

const AUTO_MS = 3000;
const TEXT_SWAP_MS = 240;   // midpoint of the 0.5s image crossfade

export default function HeroCarousel() {
  const [index, setIndex]     = useState(0);   // product whose text is shown
  const [imgIndex, setImgIndex] = useState(0); // product whose image is on the active layer
  const [activeLayer, setActiveLayer] = useState('a');
  const [layers, setLayers]   = useState({ a: HERO_PRODUCTS[0], b: null });
  const [fading, setFading]   = useState(false);
  const [paused, setPaused]   = useState(false);
  const [qty, setQty]         = useState(1);

  const textTimer = useRef(null);

  /* Crossfade: paint the incoming image on the hidden layer, flip which layer
     is visible, and swap the text at the midpoint of the fade. */
  function goTo(next) {
    if (next === imgIndex) return;
    const incoming = activeLayer === 'a' ? 'b' : 'a';

    setLayers((prev) => ({ ...prev, [incoming]: HERO_PRODUCTS[next] }));
    setFading(true);
    setImgIndex(next);

    // One frame so the browser paints the new src before opacity flips.
    requestAnimationFrame(() => setActiveLayer(incoming));

    clearTimeout(textTimer.current);
    textTimer.current = setTimeout(() => {
      setIndex(next);
      setFading(false);
    }, TEXT_SWAP_MS);
  }

  /* Auto-advance, paused while the pointer rests on the hero. Restarting on
     imgIndex means a manual dot click also resets the countdown. */
  useEffect(() => {
    if (paused) return undefined;
    const id = setTimeout(() => goTo((imgIndex + 1) % HERO_PRODUCTS.length), AUTO_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, imgIndex]);

  useEffect(() => () => clearTimeout(textTimer.current), []);

  const product = HERO_PRODUCTS[index];
  const pause  = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-grid">
        {/* ── Left: animated product copy ─────────────────────────────── */}
        <div
          className={`hero-left-content${fading ? ' is-fading' : ''}`}
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          <div className="badge-tag">{product.badge}</div>
          <h1>
            FRP <GradientShimmer gradient="sunrise" duration={2} spread={4} baseColor="var(--text-main)">{`${product.accent} ${product.rest}`}</GradientShimmer>
          </h1>
          <p>{product.desc}</p>

          <div className="hero-feature-pills">
            {product.pills.map((pill) => (
              <div className="spec-pill" key={pill.text}>
                <div className="spec-pill-icon">{pill.icon}</div>
                <div>{pill.text}</div>
              </div>
            ))}
          </div>

          <div className="carousel-dots">
            {HERO_PRODUCTS.map((p, i) => (
              <span
                key={p.accent + p.rest}
                className={`dot${i === imgIndex ? ' active' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Show ${p.accent} ${p.rest}`}
                onClick={() => goTo(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goTo(i)}
              />
            ))}
          </div>

          <div className="hero-inline-stats">
            <div>
              <strong>30+</strong>
              <span>Years Expected Life</span>
            </div>
            <div>
              <strong>500+</strong>
              <span>Global Plants</span>
            </div>
            <div>
              <strong>ISO 9001</strong>
              <span>Certified Facility</span>
            </div>
          </div>
        </div>

        {/* ── Right: two-layer crossfading showcase ──────────────────── */}
        <div className="hero-center-product">
          <div className="hero-image-stage" onMouseEnter={pause} onMouseLeave={resume}>
            {['a', 'b'].map((layer) => {
              const item = layers[layer];
              return item ? (
                <img
                  key={layer}
                  src={item.image}
                  alt={activeLayer === layer ? item.imgAlt : ''}
                  className={`hero-product-image${activeLayer === layer ? ' is-active' : ''}`}
                  width="490"
                  height="390"
                  decoding="async"
                  fetchPriority={layer === 'a' ? 'high' : undefined}
                  aria-hidden={activeLayer !== layer}
                />
              ) : null;
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

          <div className="bar-spec-item">
            <span className="bar-spec-label">Estimated Unit Price</span>
            <span className="bar-spec-value text-orange">${(product.price * qty).toFixed(2)}</span>
          </div>

          <div className="bar-counter">
            <span className="bar-spec-label" style={{ marginRight: '0.5rem' }}>Qty:</span>
            <button
              type="button"
              className="counter-btn"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="counter-val">{qty}</span>
            <button
              type="button"
              className="counter-btn"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </button>
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

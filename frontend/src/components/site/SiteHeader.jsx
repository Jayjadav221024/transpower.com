import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { scrollToHash } from '../../utils/scroll';

const BRAND_NAME = 'TRANSPOWER';

const CATEGORIES = [
  {
    key: 'switchgears',
    label: 'SIEMENS Switchgears',
    items: [
      { label: 'Low Voltage Power Distribution Product' },
      { label: 'Low Voltage Control Product' },
      { label: 'MCB' },
      { label: 'Sinova' }
    ]
  },
  {
    key: 'electric-motors',
    label: 'Motors',
    items: [
      { label: 'Siemens Motor' },
      { label: 'Crompton Greaves Motor' },
      { label: 'Hindustan Electric Motor' }
    ]
  },
  {
    key: 'molded-gratings',
    label: 'FRP Gratings',
    items: [
      { label: 'Meniscus Top' },
      { label: 'Grit Top' },
      { label: 'Chequered Plate' }
    ]
  },
  {
    key: 'cable-trays',
    label: 'FRP Cable Tray',
    items: [
      { label: 'Ladder Type Cable Tray' },
      { label: 'Perforated Cable Tray' }
    ]
  },
  {
    key: 'gear-boxes',
    label: 'Gear Box',
    items: [
      { label: 'Gear Box' }
    ]
  }
];

/* Products now has its own route, so it is a NavLink rather than a hash jump
   that only worked on the home page. */
const SECTIONS = [
  { hash: 'calculator',   label: 'Load Specs' },
  { hash: 'comparison',   label: 'Why FRP' },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const brandRef = useRef(null);

  /* Mouse-tracked 3D tilt on the logo. Written straight to CSS custom
     properties rather than state — this fires on every mousemove and must not
     re-render the header. */
  const tiltBrand = useCallback((e) => {
    const el = brandRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--tilt-y', `${(dx * 18).toFixed(2)}deg`);
    el.style.setProperty('--tilt-x', `${(-dy * 14).toFixed(2)}deg`);
  }, []);

  const resetBrandTilt = useCallback(() => {
    const el = brandRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-y', '0deg');
    el.style.setProperty('--tilt-x', '0deg');
  }, []);

  // Esc key & body scroll block
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Focus trapping inside mobile drawer
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!drawer) return;
    const focusable = drawer.querySelectorAll('a, button');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [menuOpen]);

  /* Always handled client-side. Letting the browser follow href="/#quote" from
     another route would reload the whole document just to reach an anchor. */
  const goToSection = useCallback((e, hash) => {
    e.preventDefault();
    setMenuOpen(false);

    if (onHome) {
      scrollToHash(hash, { smooth: true });
      navigate(`/#${hash}`, { replace: true });
      return;
    }
    /* Off the home page: route there first — ScrollToTop picks up the hash. */
    navigate(`/#${hash}`);
  }, [onHome, navigate]);

  return (
    <header className="site-header-new">
      <div className="container header-container-new">
        <Link
          to="/"
          className="brand-logo-new"
          ref={brandRef}
          onClick={() => setMenuOpen(false)}
          onMouseMove={tiltBrand}
          onMouseLeave={resetBrandTilt}
          onBlur={resetBrandTilt}
        >
          {/* Decorative animation layers — all aria-hidden, the <img> alt and
              the wordmark's aria-label carry the accessible name. */}
          <span className="logo-mark">
            <span className="logo-ring" aria-hidden="true" />
            <span className="logo-pulse" aria-hidden="true" />
            <span className="logo-pulse logo-pulse-delayed" aria-hidden="true" />
            <span className="logo-orbit" aria-hidden="true">
              <i className="logo-spark" />
              <i className="logo-spark logo-spark-alt" />
            </span>
            <img
              className="logo-3d-svg"
              src="/favicon.png"
              alt="Transpower Logo"
              width="40"
              height="40"
              style={{ objectFit: 'contain' }}
            />
          </span>
          <div className="logo-text-wrapper">
            {/* Each letter animates on its own delay, so the wordmark assembles
                itself on load and re-shines on hover. */}
            <span className="logo-text-new" aria-label={BRAND_NAME}>
              {BRAND_NAME.split('').map((char, i) => (
                <span
                  key={`${char}-${i}`}
                  className="logo-char"
                  style={{ '--char-index': i }}
                  aria-hidden="true"
                >
                  {char}
                </span>
              ))}
              <span className="logo-shine" aria-hidden="true" />
            </span>
            <span className="logo-subtext-new">Technologies Pvt. Ltd.</span>
          </div>
          <span className="logo-beam" aria-hidden="true" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <ul className="nav-links-new">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/our-teams" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')}>
                Our Teams
              </NavLink>
            </li>
            <li 
              onMouseEnter={() => setIsProductsHovered(true)}
              onMouseLeave={() => {
                setIsProductsHovered(false);
                setHoveredCategory(null);
              }}
              style={{ position: 'relative' }}
            >
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')}>
                Products
              </NavLink>

              {/* Main Dropdown Menu */}
              {isProductsHovered && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: '#ffffff',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  borderRadius: '6px',
                  padding: '0.8rem 0',
                  minWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 10000,
                  border: '1px solid #e2e8f0'
                }}>
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat.key}
                      onMouseEnter={() => setHoveredCategory(cat.key)}
                      style={{
                        position: 'relative',
                        padding: '0.6rem 1.5rem',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        color: hoveredCategory === cat.key ? 'var(--accent-orange)' : '#1e293b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        background: hoveredCategory === cat.key ? '#f8fafc' : 'transparent',
                        transition: 'color 0.15s, background-color 0.15s'
                      }}
                      onClick={() => {
                        navigate(`/product/${cat.key}`);
                        setIsProductsHovered(false);
                      }}
                    >
                      <span>{cat.label}</span>

                      {/* Sub flyout menu */}
                      {hoveredCategory === cat.key && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '100%',
                          background: '#ffffff',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                          borderRadius: '6px',
                          padding: '0.8rem 0',
                          minWidth: '280px',
                          display: 'flex',
                          flexDirection: 'column',
                          zIndex: 10001,
                          border: '1px solid #e2e8f0'
                        }}>
                          {cat.items.map(subItem => (
                            <Link
                              key={subItem.label}
                              to={`/product/${cat.key}`}
                              style={{
                                padding: '0.6rem 1.5rem',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                color: '#1e293b',
                                textDecoration: 'none',
                                display: 'block',
                                transition: 'color 0.15s, background-color 0.15s',
                                whiteSpace: 'nowrap'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.color = 'var(--accent-orange)';
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.color = '#1e293b';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsProductsHovered(false);
                                setHoveredCategory(null);
                              }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
            {SECTIONS.map((s) => (
              <li key={s.hash}>
                <a href={`/#${s.hash}`} className="nav-link-new" onClick={(e) => goToSection(e, s.hash)}>
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <NavLink to="/locations" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')}>
                Locations
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')}>
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')}>
                Blog
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Desktop Right Actions */}
        <div className="header-actions-new desktop-actions">
          <Link to="/contact" className="nav-link-new">
            Contact
          </Link>
          <a href="/#quote" className="btn-pill" onClick={(e) => goToSection(e, 'quote')}>
            Get B2B Quote
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className={`menu-toggle-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div 
          className="mobile-nav-backdrop open" 
          onClick={() => setMenuOpen(false)} 
        />
      )}

      {/* Mobile Drawer Menu Overlay */}
      <div 
        id="mobile-nav-drawer" 
        className={`mobile-nav-drawer ${menuOpen ? 'open' : ''}`}
      >
        <div className="drawer-header">
          <button 
            className="drawer-close-btn" 
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            &times;
          </button>
        </div>
        <ul className="mobile-nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active-mobile' : 'mobile-link')} onClick={() => setMenuOpen(false)} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-mobile' : 'mobile-link')} onClick={() => setMenuOpen(false)}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/our-teams" className={({ isActive }) => (isActive ? 'active-mobile' : 'mobile-link')} onClick={() => setMenuOpen(false)}>
              Our Teams
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) => (isActive ? 'active-mobile' : 'mobile-link')} onClick={() => setMenuOpen(false)}>
              Products
            </NavLink>
          </li>
          {SECTIONS.map((s) => (
            <li key={s.hash}>
              <a href={`/#${s.hash}`} className="mobile-link" onClick={(e) => goToSection(e, s.hash)}>
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <NavLink to="/locations" className={({ isActive }) => (isActive ? 'active-mobile' : 'mobile-link')} onClick={() => setMenuOpen(false)}>
              Locations
            </NavLink>
          </li>
          <li>
            <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active-mobile' : 'mobile-link')} onClick={() => setMenuOpen(false)}>
              Gallery
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active-mobile' : 'mobile-link')} onClick={() => setMenuOpen(false)}>
              Blog
            </NavLink>
          </li>
          <li style={{ marginTop: '20px' }}>
            <a href="/#quote" className="mobile-btn" onClick={(e) => goToSection(e, 'quote')}>
              Get B2B Quote
            </a>
          </li>
        </ul>
      </div>

    </header>
  );
}

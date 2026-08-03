import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

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

  function goToSection(e, hash) {
    setMenuOpen(false);
    if (!onHome) return;
    e.preventDefault();
    const el = document.getElementById(hash);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 85, behavior: 'smooth' });
      navigate(`/#${hash}`, { replace: true });
    }
  }

  return (
    <header className="site-header-new">
      <div className="container header-container-new">
        {/* Left Tilted Diamond Logo */}
        <Link to="/" className="brand-logo-new" onClick={() => setMenuOpen(false)}>
          <svg className="logo-3d-svg" width="40" height="40" viewBox="10 10 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grey-face-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#9ca3af" />
              </linearGradient>
              <linearGradient id="grey-face-2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              <linearGradient id="orange-face-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9f67" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="orange-face-2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>

            {/* Left/Back Grey 3D Block */}
            <g className="block-grey">
              {/* Top Face */}
              <path d="M22 38 L38 28 L54 38 L38 48 Z" fill="#e5e7eb" />
              {/* Left Face */}
              <path d="M22 38 L38 48 L38 78 L22 68 Z" fill="url(#grey-face-1)" />
              {/* Right Face */}
              <path d="M38 48 L54 38 L54 68 L38 78 Z" fill="url(#grey-face-2)" />
              {/* Bending extension top */}
              <path d="M38 28 L54 18 L70 28 L54 38 Z" fill="#f3f4f6" />
              {/* Bending extension right face */}
              <path d="M54 38 L70 28 L70 58 L54 68 Z" fill="url(#grey-face-2)" />
            </g>

            {/* Right/Front Orange 3D Block */}
            <g className="block-orange">
              {/* Top Face */}
              <path d="M42 58 L58 48 L74 58 L58 68 Z" fill="#ffedd5" />
              {/* Left Face */}
              <path d="M42 58 L58 68 L58 98 L42 88 Z" fill="url(#orange-face-1)" />
              {/* Right Face */}
              <path d="M58 68 L74 58 L74 88 L58 98 Z" fill="url(#orange-face-2)" />
              {/* Bending extension top */}
              <path d="M58 48 L74 38 L90 48 L74 58 Z" fill="#ffedd5" />
              {/* Bending extension right face */}
              <path d="M74 58 L90 48 L90 78 L74 88 Z" fill="url(#orange-face-2)" />
            </g>
          </svg>
          <div className="logo-text-wrapper">
            <span className="logo-text-new">TRANSPOWER</span>
            <span className="logo-subtext-new">Technologies Pvt. Ltd.</span>
          </div>
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
            <li 
              onMouseEnter={() => setIsProductsHovered(true)}
              onMouseLeave={() => {
                setIsProductsHovered(false);
                setHoveredCategory(null);
              }}
              style={{ position: 'relative' }}
            >
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')}>
                Products <span style={{ fontSize: '0.62rem', marginLeft: '2px', verticalAlign: 'middle' }}>▼</span>
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
                  border: '1px solid #e2e8f0',
                  marginTop: '0.5rem'
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
                        justifyContent: 'space-between',
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
                      <span style={{ fontSize: '0.7rem', color: hoveredCategory === cat.key ? 'var(--accent-orange)' : '#cbd5e1' }}>▶</span>

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
                          border: '1px solid #e2e8f0',
                          marginLeft: '4px'
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
              <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active-pill' : 'nav-link-new')}>
                Blog
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Desktop Right Actions */}
        <div className="header-actions-new desktop-actions">
          <a href="/#quote" className="nav-link-new" onClick={(e) => goToSection(e, 'quote')}>
            Contact
          </a>
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

      {/* Floating Bottom Teaser */}
      <div className="floating-teaser-container">
        <a href="/#quote" className="floating-teaser-btn">
          Get a Free Quote <span className="arrow">→</span>
        </a>
      </div>
    </header>
  );
}

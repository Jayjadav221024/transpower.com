import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicApi } from '../../api/client';

const GROUP_COMPANIES = [
  { name: 'Apidel', logo: '/assets/images/logo_apidel.jpg' },
  { name: 'Shree Raj', logo: '/assets/images/logo_shree_raj.jpg' },
  { name: 'Techno', logo: '/assets/images/logo_techno.jpg' },
  { name: 'Yash', logo: '/assets/images/logo_yash.png' },
  { name: 'Kaival', logo: '/assets/images/logo_kaival_poultry.png' }
];

export default function SiteFooter() {
  const { pathname } = useLocation();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [interest, setInterest] = useState('FRP Composite Products');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await publicApi.sendInquiry({
        name: `Quick Lead (${interest})`,
        email,
        phone,
        product: interest,
        message: query
      });
      setSuccess(true);
      setPhone('');
      setEmail('');
      setQuery('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Error sending inquiry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="site-footer-new">
      <div className="container">
        {/* Top Footer Section */}
        <div className="footer-top-grid">
          {/* Col 1: About Us Text */}
          <div className="footer-brand-col">
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.2rem' }}>ABOUT US</h4>
            <p className="footer-description" style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#cbd5e1' }}>
              "Transpower" is a Globally Leading Group and is amongst the few leading names in the Electro-Mechanical Industry. With a presence of over six decades, Transpower has achieved a consistent growth and a reputed clientele. The constant zest to learn, lead and innovate has earned the company a strong position in the Electro-Mechanical Industry.
            </p>
          </div>

          {/* Col 2: Contact Info & Socials */}
          <div className="footer-contact-col">
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.2rem' }}>CONTACT US</h4>
            <div className="footer-contact-details-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>Phone:</strong>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>+91 98255 07527</span>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>+91 98255 07517</span>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>+91 99099 57390</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>Email:</strong>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>baroda@transpower.net.in</span>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>sales@transpower.net.in</span>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>frp@transpower.net.in</span>
              </div>
              <div>
                <strong>Address:</strong> <span style={{ marginLeft: '0.5rem' }}>346 GIDC, Makarpura, Vadodara - 390010, Gujarat (India)</span>
              </div>
            </div>
            
            <div className="footer-social-icons" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem' }}>
              <a href="https://www.facebook.com/TranspowerTech" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8.02 9.71v-6.87H7.54V12h2.48V9.8c0-2.45 1.45-3.81 3.7-3.81 1.08 0 2.22.19 2.22.19v2.44h-1.25c-1.21 0-1.59.75-1.59 1.52V12h2.75l-.44 2.83h-2.31v6.87C18.56 20.87 22 16.84 22 12z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/transpower.technologies/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/transpowertech/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764.785.79.785 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://x.com/Transpower_Tech" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter/X" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@TranspowerTechnologies" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Our Group of Companies */}
          <div className="footer-frameworks-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.2rem' }}>OUR GROUP OF COMPANIES</h4>
            <div className="footer-group-grid">
              {GROUP_COMPANIES.map((company) => (
                <div className="footer-group-logo" key={company.name}>
                  <img src={company.logo} alt={company.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Quick Inquiry Form */}
          <div className="footer-form-col">
            <h4>Quick Inquiry</h4>
            <form onSubmit={handleQuickSubmit} className="footer-quick-form">
              <input 
                type="tel" 
                placeholder="+91 Mobile Number" 
                required 
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Your Query" 
                required 
                className="form-control"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select 
                className="form-control"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              >
                <option value="FRP Composite Products">Interested in FRP Products</option>
                <option value="Industrial Gearboxes">Interested in Gearboxes</option>
                <option value="Power Switchgears">Interested in Switchgears</option>
              </select>

              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.74rem', color: '#94a3b8', cursor: 'pointer', marginTop: '0.4rem', userSelect: 'none' }}>
                <input type="checkbox" required style={{ accentColor: 'var(--accent-orange)' }} />
                <span>I agree to the <Link to="/privacy-policy" target="_blank" style={{ color: 'var(--accent-orange)', textDecoration: 'underline' }}>Privacy Policy</Link> and data terms.</span>
              </label>

              {error && <div className="quick-feedback error">{error}</div>}
              {success && <div className="quick-feedback success">✓ Inquiry Sent!</div>}

              <button type="submit" disabled={sending || success} className="btn-quick-submit">
                {sending ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>


        {/* Footer Bottom Rights */}
        <div className="footer-bottom-new">
          <div>© {new Date().getFullYear()} Transpower Technologies Pvt. Ltd. All Rights Reserved.</div>
          <div className="footer-bottom-links">
            <Link to="/blog">Blog</Link>
            <Link to="/products">Products</Link>
            <Link to="/our-teams">Our Teams</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

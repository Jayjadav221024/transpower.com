import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicApi } from '../../api/client';

const CITIES = [
  'Vadodara', 'Ahmedabad', 'Anand', 'Ankleshwar', 'Bharuch', 
  'Surat', 'Rajkot', 'Godhra', 'Navsari', 'Vapi', 'Bhuj', 'Amreli', 'Dahod'
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
          {/* Col 1: Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo-new" style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>
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
            <p className="footer-description">
              Transpower Technologies Pvt. Ltd. is a pioneer in manufacturing high-strength Fiberglass Reinforced Polymer (FRP/GRP) composite products, Industrial Gear Boxes, and Power Switchgears.
            </p>
          </div>

          {/* Col 2: Social & Contacts */}
          <div className="footer-contact-col">
            <h4>Social &amp; Contact</h4>
            <div className="footer-social-icons">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">in</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">f</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">ig</a>
            </div>
            
            <div className="footer-contact-details-list">
              <div>
                <strong>📞 Phone / WhatsApp</strong>
                <span>+91 98765 43210</span>
              </div>
              <div>
                <strong>✉️ Email Address</strong>
                <span>sales@transpower.co.in</span>
              </div>
              <div>
                <strong>📍 Factory Address</strong>
                <span>Plot No. 302, GIDC Estate, Makarpura, Vadodara, Gujarat 390010</span>
              </div>
            </div>
          </div>

          {/* Col 3: Frameworks & Corporate Profiles */}
          <div className="footer-frameworks-col">
            <h4>Verification &amp; Standards</h4>
            <a 
              href="https://www.zaubacorp.com/company/TRANSPOWER-TECHNOLOGIES-PRIVATE-LIMITED/U74900MH2012PTC236681" 
              target="_blank" 
              rel="noopener noreferrer"
              className="zauba-badge-link"
            >
              <div className="zauba-badge">
                <span className="badge-org">ZaubaCorp</span>
                <span className="badge-status">Verified Listing</span>
              </div>
            </a>
            <p className="framework-text">
              Registered under Ministry of Corporate Affairs (MCA), Government of India. CIN: U74900MH2012PTC236681.
            </p>
            <div className="certification-stamp">
              <span>ISO 9001</span>
              <span>ASTM E84 Class 1</span>
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

              {error && <div className="quick-feedback error">{error}</div>}
              {success && <div className="quick-feedback success">✓ Inquiry Sent!</div>}

              <button type="submit" disabled={sending || success} className="btn-quick-submit">
                {sending ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>

        {/* Network & Cities Row (Only rendered on Home Page) */}
        {pathname === '/' && (
          <div className="footer-cities-row">
            <div className="cities-heading">Available Offline &amp; Online in Gujarat</div>
            <div className="cities-grid">
              {CITIES.map((city) => (
                <a href="/#quote" key={city} className="city-link">{city}</a>
              ))}
            </div>
          </div>
        )}

        {/* Footer Bottom Rights */}
        <div className="footer-bottom-new">
          <div>© 2026 Transpower Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="footer-bottom-links">
            <Link to="/blog">Blog</Link>
            <a href="/#products">Products</a>
            <Link to="/admin">Admin Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

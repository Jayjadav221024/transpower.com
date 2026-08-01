import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicApi } from '../../api/client';
import { CITIES } from '../../data/cities';

const GROUP_COMPANIES = [
  { name: 'Apidel', logo: '/assets/images/logo_apidel.jpg' },
  { name: 'Shree Raj', logo: '/assets/images/logo_shree_raj.jpg' },
  { name: 'Techno', logo: '/assets/images/logo_techno.jpg' },
  { name: 'Transpower Exports', logo: '/assets/images/logo_transpower.png' }
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
              "Transpower" is a Globally Leading Group and is amongst the few leading names in Electro-Mechanical Industry. With a presence of more than 7 decades, Transpower has achieved a consistent growth and a reputed clientele. The constant zest to learn, lead and innovate has earned the company a strong position in the Electro-Mechanical Industry.
            </p>
          </div>

          {/* Col 2: Contact Info & Socials */}
          <div className="footer-contact-col">
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.2rem' }}>CONTACT US</h4>
            <div className="footer-contact-details-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div>
                <strong>Phone:</strong> <span style={{ marginLeft: '0.5rem' }}>+91 98255 07517 / 37</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>Email:</strong>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>baroda@transpower.net.in</span>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>sales@transpower.com</span>
                <span style={{ paddingLeft: '0.5rem', fontSize: '0.82rem' }}>frp@transpower.net.in</span>
              </div>
              <div>
                <strong>Address:</strong> <span style={{ marginLeft: '0.5rem' }}>346 GIDC, Makarpura, Vadodara - 390010, Gujarat (India)</span>
              </div>
            </div>
            
            <div className="footer-social-icons" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem' }}>
              <a href="https://facebook.com/TranspowerTech" target="_blank" rel="noopener noreferrer" className="social-icon">f</a>
              <a href="https://instagram.com/transpower.technologies" target="_blank" rel="noopener noreferrer" className="social-icon">ig</a>
              <a href="https://linkedin.com/company/transpowertech" target="_blank" rel="noopener noreferrer" className="social-icon">in</a>
              <a href="https://x.com/Transpower_Tech" target="_blank" rel="noopener noreferrer" className="social-icon">tw</a>
              <a href="https://youtube.com/@TranspowerTechnologies" target="_blank" rel="noopener noreferrer" className="social-icon">yt</a>
            </div>
          </div>

          {/* Col 3: Our Group of Company */}
          <div className="footer-frameworks-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.2rem' }}>OUR GROUP OF COMPANY</h4>
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

              {error && <div className="quick-feedback error">{error}</div>}
              {success && <div className="quick-feedback success">✓ Inquiry Sent!</div>}

              <button type="submit" disabled={sending || success} className="btn-quick-submit">
                {sending ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>

        {/* Network & Cities Row — home page plus the location pages, where the
            city cross-links are directly relevant. */}
        {(pathname === '/' || pathname.startsWith('/locations')) && (
          <div className="footer-cities-row">
            <div className="cities-heading">Available Offline &amp; Online in Gujarat</div>
            <div className="cities-grid">
              {CITIES.map((city) => (
                <Link to={`/locations/${city.slug}`} key={city.slug} className="city-link">
                  {city.name}
                </Link>
              ))}
            </div>
            <Link to="/locations" className="cities-all-link">
              View all service locations <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* Footer Bottom Rights */}
        <div className="footer-bottom-new">
          <div>© 2026 Transpower Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="footer-bottom-links">
            <Link to="/blog">Blog</Link>
            <Link to="/products">Products</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

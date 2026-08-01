import { useState } from 'react';
import { publicApi } from '../../api/client';

export default function BrochureDownloadSection() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', company: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      // Send Lead data to the API client (triggers DB storage & email sending)
      const res = await publicApi.sendInquiry({
        name: `${formData.name} (${formData.company || 'No Company'})`,
        email: formData.email,
        phone: formData.phone,
        product: 'Brochure Request',
        message: `Requested corporate catalog. Company: ${formData.company}`
      });

      setEmailed(Boolean(res?.emailed));
      setSuccess(true);

      // Trigger automatic PDF brochure download locally
      const link = document.createElement('a');
      link.href = '/assets/transpower_corporate_brochure.pdf';
      link.download = 'Transpower_Corporate_Brochure.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset form after short delay
      setTimeout(() => {
        setSuccess(false);
        setEmailed(false);
        setFormData({ name: '', phone: '', email: '', company: '' });
      }, 5000);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="download-brochure" className="brochure-section section">
      <div className="container brochure-grid">
        {/* Left Side: Stunning visual presentation of the catalog */}
        <div className="brochure-info-card">
          <div className="badge-tag">Corporate Catalog</div>
          <h2>Get Our Complete <span className="text-orange">Product Brochure</span></h2>
          <p className="subtitle">
            Download our latest 5-page PDF catalog containing comprehensive details, dimensions, and specifications for all Transpower products.
          </p>
          
          <div className="brochure-preview-box">
            <div className="brochure-mockup-book">
              <div className="book-spine"></div>
              <div className="book-cover">
                <div className="book-logo">TRANSPOWER</div>
                <div className="book-title">CORPORATE<br/>CATALOG</div>
                <div className="book-footer">FRP Composites & Power Systems</div>
                <div className="download-indicator-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="brochure-highlights">
              <h4>What's inside the catalog:</h4>
              <ul>
                <li>
                  <span className="dot"></span>
                  <div><strong>Molded FRP Gratings:</strong> Mesh sizes, load tables & finishes.</div>
                </li>
                <li>
                  <span className="dot"></span>
                  <div><strong>FRP Cable Trays:</strong> Ladder & perforated type specifications.</div>
                </li>
                <li>
                  <span className="dot"></span>
                  <div><strong>Electric Motors:</strong> IE2/IE3/IE4 Siemens & CG industrial lineups.</div>
                </li>
                <li>
                  <span className="dot"></span>
                  <div><strong>Industrial Gearboxes:</strong> Rotomotive Qubo & Robus engineering details.</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek input card */}
        <div className="brochure-form-card">
          <h3>Request Instant Download</h3>
          <p>Fill in your business details to download the high-resolution brochure instantly and receive a copy in your inbox.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="brochure-name">Full Name</label>
              <input
                type="text"
                id="brochure-name"
                className="form-control"
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleInputChange('name')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="brochure-phone">Phone / WhatsApp</label>
              <input
                type="tel"
                id="brochure-phone"
                className="form-control"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange('phone')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="brochure-email">Business Email</label>
              <input
                type="email"
                id="brochure-email"
                className="form-control"
                required
                placeholder="john@company.com"
                value={formData.email}
                onChange={handleInputChange('email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="brochure-company">Company Name</label>
              <input
                type="text"
                id="brochure-company"
                className="form-control"
                required
                placeholder="e.g. Apex Engineering"
                value={formData.company}
                onChange={handleInputChange('company')}
              />
            </div>

            {error && <div className="feedback-error">{error}</div>}
            {success && (
              <div className="feedback-success">
                {emailed
                  ? '✓ Success! Your PDF download is starting, and a copy has been sent to your email.'
                  : '✓ Your PDF download is starting. We could not email a copy right now — our team has your request and will follow up.'}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={sending || success}
            >
              {sending ? 'Processing...' : 'Download Catalog PDF'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

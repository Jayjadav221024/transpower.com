import { useEffect, useState } from 'react';
import { publicApi } from '../../api/client';

export default function StickyActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', company: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      // Send Lead data to the API client
      await publicApi.sendInquiry({
        name: `${formData.name} (${formData.company || 'No Company'})`,
        email: formData.email,
        phone: formData.phone,
        product: 'Brochure Request',
        message: `Requested product brochure. Company: ${formData.company || 'Not Specified'}`
      });

      setSuccess(true);

      // Trigger automatic PDF brochure download
      const link = document.createElement('a');
      link.href = '/brochure.pdf';
      link.download = 'Transpower_Brochure.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clear Form and close modal after short delay
      setTimeout(() => {
        setModalOpen(false);
        setSuccess(false);
        setFormData({ name: '', phone: '', email: '', company: '' });
      }, 3000);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* ── Vertical Sticky Brochure Tab on right scroll bar ── */}
      <button
        onClick={() => setModalOpen(true)}
        className="vertical-brochure-tab"
        title="Download Brochure"
        aria-label="Download Brochure"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Download Brochure</span>
      </button>

      {/* ── Right Bottom actions: WhatsApp + Scroll Top ── */}
      <div className="sticky-actions-container">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919876543210?text=Hi,%20I'm%20interested%20in%20FRP%20Composite%20products."
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-action-btn whatsapp-btn"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </a>

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className={`sticky-action-btn scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
          title="Scroll to Top"
          aria-label="Scroll to Top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {/* ── Lead Form Dialog / Modal ── */}
      {modalOpen && (
        <div className="brochure-modal-overlay">
          <div className="brochure-modal-card">
            <button
              className="modal-close-btn"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            
            <div className="modal-header">
              <h3>Download Brochure</h3>
              <p>Please provide your business details to receive the high-resolution catalog PDF instantly.</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-name">Full Name</label>
                <input
                  type="text"
                  id="modal-name"
                  className="form-control"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-phone">Phone / WhatsApp</label>
                <input
                  type="tel"
                  id="modal-phone"
                  className="form-control"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-email">Business Email</label>
                <input
                  type="email"
                  id="modal-email"
                  className="form-control"
                  required
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-company">Company Name</label>
                <input
                  type="text"
                  id="modal-company"
                  className="form-control"
                  required
                  placeholder="e.g. Apex Composites"
                  value={formData.company}
                  onChange={handleInputChange('company')}
                />
              </div>

              {error && <div className="modal-error">{error}</div>}
              {success && (
                <div className="modal-success">
                  ✓ Success! Downloading brochure now...
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary modal-submit-btn"
                disabled={sending || success}
              >
                {sending ? 'Sending...' : 'Download Catalog PDF'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

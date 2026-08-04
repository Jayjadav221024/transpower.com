import { useState, useEffect } from 'react';
import { publicApi } from '../../api/client';
import { RFQ_PRODUCTS } from '../../data/products';

const EMPTY = {
  name: '', email: '', phone: '',
  product: RFQ_PRODUCTS[0].value, quantity: '', message: '',
};

export default function RfqForm() {
  const [values, setValues]   = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const handlePrefill = (e) => {
      const { product, message } = e.detail;
      setValues((v) => ({
        ...v,
        product: product || v.product,
        message: message || v.message,
      }));
    };
    window.addEventListener('prefillRFQ', handlePrefill);
    return () => window.removeEventListener('prefillRFQ', handlePrefill);
  }, []);

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      await publicApi.sendInquiry(values);
      setValues(EMPTY);
      setSent(true);
      setTimeout(() => setSent(false), 8000);
    } catch (ex) {
      setError(ex.message);
      // Scroll the first invalid field/error into view if needed
      const formEl = e.target;
      const invalidField = formEl.querySelector(':invalid') || formEl.querySelector('.form-control');
      if (invalidField) {
        invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="quote" className="rfq-section-new">
      <div className="container rfq-grid-new">
        {/* Left Column: Heading + Direct Contact Details */}
        <div className="rfq-info-col">
          <div className="badge-tag">Factory Pricing &amp; Engineering</div>
          <h2>Request a <span className="text-orange">B2B Quote</span></h2>
          <p>Get technical consultation, CAD drawings, and factory direct price quotes tailored to your spec.</p>
          
          <div className="rfq-contact-details">
            <div>
              <strong>📞 Call / WhatsApp</strong>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <a href="tel:+919825507517" style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}>+91 98255 07517</a>
                <a href="tel:+919825507537" style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}>+91 98255 07537</a>
              </span>
            </div>
            <div>
              <strong>✉️ Email Address</strong>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.92rem' }}>
                <a href="mailto:sales@transpower.net.in" style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center', color: 'inherit' }}>sales@transpower.net.in</a>
                <a href="mailto:baroda@transpower.net.in" style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center', color: 'inherit' }}>baroda@transpower.net.in</a>
                <a href="mailto:frp@transpower.net.in" style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center', color: 'inherit' }}>frp@transpower.net.in</a>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Request Form Card */}
        <div className="rfq-form-col">
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="rfq-name">Full Name / Company Name</label>
              <input
                type="text" 
                id="rfq-name" 
                className="form-control" 
                required
                placeholder="e.g. John Doe - Apex Engineering"
                value={values.name} 
                onChange={update('name')}
                autoComplete="name"
              />
            </div>

            <div className="rfq-form-row-2">
              <div className="form-group">
                <label htmlFor="rfq-email">Business Email</label>
                <input
                  type="email" 
                  id="rfq-email" 
                  className="form-control" 
                  required
                  placeholder="john@company.com"
                  value={values.email} 
                  onChange={update('email')}
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                />
              </div>
              <div className="form-group">
                <label htmlFor="rfq-phone">Phone / WhatsApp</label>
                <input
                  type="tel" 
                  id="rfq-phone" 
                  className="form-control" 
                  required
                  placeholder="+91 98765 43210"
                  value={values.phone} 
                  onChange={update('phone')}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="rfq-form-row-2">
              <div className="form-group">
                <label htmlFor="rfq-product">Product Interest</label>
                <select id="rfq-product" className="form-control" value={values.product} onChange={update('product')}>
                  {RFQ_PRODUCTS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rfq-qty">Estimated Quantity / Area</label>
                <input
                  type="text" 
                  id="rfq-qty" 
                  className="form-control"
                  placeholder="e.g. 500 Sq. Meters / 10 Units"
                  value={values.quantity} 
                  onChange={update('quantity')}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="rfq-msg">Project Requirements &amp; Specifications</label>
              <textarea
                id="rfq-msg" 
                className="form-control" 
                rows="3"
                placeholder="Detail your resin requirements, gear ratio, power rating, or target timeline..."
                value={values.message} 
                onChange={update('message')}
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" required style={{ accentColor: 'var(--accent-orange)' }} />
                <span>I agree to the <a href="/privacy-policy" target="_blank" style={{ color: 'var(--accent-orange)', textDecoration: 'underline' }}>Privacy Policy</a> and authorize processing of my business contact data for this quote.</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={sending}
            >
              {sending ? 'Processing Inquiry…' : 'Submit Inquiry For Quote'}
            </button>

            <div aria-live="polite" style={{ marginTop: '0.5rem' }}>
              {sent && (
                <div className="rfq-feedback rfq-feedback-success">
                  ✓ Thank you! Your RFQ has been received. Our technical team will reach out shortly.
                </div>
              )}
              {error && <div className="rfq-feedback rfq-feedback-error">{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

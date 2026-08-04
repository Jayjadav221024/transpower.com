import { useState } from 'react';
import SEO from '../components/common/SEO';
import { publicApi } from '../api/client';
import { COMPANY_DETAILS, DEPARTMENTS, GROUP_OFFICES } from '../data/company';
import { RFQ_PRODUCTS } from '../data/products';

export default function ContactPage() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    product: RFQ_PRODUCTS[0].value,
    quantity: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await publicApi.sendInquiry(values);
      setValues({
        name: '',
        email: '',
        phone: '',
        product: RFQ_PRODUCTS[0].value,
        quantity: '',
        message: ''
      });
      setSent(true);
      setTimeout(() => setSent(false), 8000);
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us - Transpower Technologies Pvt. Ltd." 
        description="Contact our department representatives for switchgears, motors, and FRP composite solutions. Find Vadodara head office, Ankleshwar and Ahmedabad branch details."
        keywords="Transpower contact, switchgear department Vadodara, motor division Gujarat, FRP products sales Ankleshwar"
      />

      <section style={{ padding: '8rem 1.5rem 4rem', background: '#090e18', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <span style={{ background: 'rgba(225, 89, 11, 0.15)', color: '#ff7a29', padding: '4px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 800 }}>Connect With Us</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '1rem' }}>Contact Our Engineering Divisions</h1>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: '#94a3b8', lineHeight: 1.6 }}>
            Reach out to our dedicated specialists for direct B2B pricing, technical design support, and supply coordination.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 1.5rem', background: '#f8fafc' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
          
          {/* Left Column: Department Contacts & Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Department grid */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Department Specialists</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-orange)', margin: '0 0 0.5rem 0' }}>🔌 Switchgear Department</h3>
                  {DEPARTMENTS.SWITCHGEAR.map((c) => (
                    <div key={c.name} style={{ fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                      <strong style={{ display: 'block' }}>{c.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Call: {c.phone} | {c.email}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-orange)', margin: '0 0 0.5rem 0' }}>🔄 Motor Division</h3>
                  {DEPARTMENTS.MOTOR.map((c) => (
                    <div key={c.name} style={{ fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                      <strong style={{ display: 'block' }}>{c.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Call: {c.phone} | {c.email}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-orange)', margin: '0 0 0.5rem 0' }}>🧪 FRP Composite Products</h3>
                  {DEPARTMENTS.FRP.map((c) => (
                    <div key={c.name} style={{ fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                      <strong style={{ display: 'block' }}>{c.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Call: {c.phone} | {c.email}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-orange)', margin: '0 0 0.5rem 0' }}>⚙️ General Industrial Sales</h3>
                  {DEPARTMENTS.SALES.map((c) => (
                    <div key={c.name} style={{ fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                      <strong style={{ display: 'block' }}>{c.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Call: {c.phone} | {c.email}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Submission Form */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Submit Specifications</h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Our sales engineers will review your inputs and supply a formal commercial proposal.</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Your Name / Company</label>
                    <input type="text" required value={values.name} onChange={update('name')} className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Business Phone</label>
                    <input type="tel" required value={values.phone} onChange={update('phone')} className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Business Email</label>
                    <input type="email" required value={values.email} onChange={update('email')} className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Estimated Quantity</label>
                    <input type="text" value={values.quantity} onChange={update('quantity')} className="form-control" placeholder="e.g. 50 panels / 5 units" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Product Division</label>
                  <select value={values.product} onChange={update('product')} className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff' }}>
                    {RFQ_PRODUCTS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Project Specifications</label>
                  <textarea rows="4" value={values.message} onChange={update('message')} className="form-control" placeholder="Detail span size, torque values, environmental requirements..." style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', resize: 'vertical' }} />
                </div>

                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer', userSelect: 'none' }}>
                  <input type="checkbox" required style={{ accentColor: 'var(--accent-orange)' }} />
                  <span>I agree to the <a href="/privacy-policy" target="_blank" style={{ color: 'var(--accent-orange)', textDecoration: 'underline' }}>Privacy Policy</a> and authorize processing of my business details for this quote.</span>
                </label>

                <button type="submit" disabled={sending} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontWeight: 800 }}>
                  {sending ? 'Submitting...' : 'Submit Spec Inquiry'}
                </button>

                {sent && <div style={{ color: 'green', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.5rem' }}>✓ Inquiry submitted successfully. Our specialists will connect with you.</div>}
                {error && <div style={{ color: 'red', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{error}</div>}
              </form>
            </div>

          </div>

          {/* Right Column: Office Address Details & Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Registered Offices &amp; Locations</h2>

            {GROUP_OFFICES.map((office) => (
              <div key={office.name} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{office.name}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{office.description}</span>
                <p style={{ fontSize: '0.85rem', margin: '0.2rem 0', lineHeight: 1.4 }}>{office.address}, Pincode: {office.pincode}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Phone: </strong>{office.phone.join(', ')}
                </div>
                {office.mapEmbedUrl && (
                  <div style={{ marginTop: '0.75rem', borderRadius: '8px', overflow: 'hidden', height: '150px', border: '1px solid var(--border)' }}>
                    <iframe 
                      title={`Map of ${office.name}`} 
                      src={office.mapEmbedUrl} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            ))}

          </div>

        </div>
      </section>
    </>
  );
}

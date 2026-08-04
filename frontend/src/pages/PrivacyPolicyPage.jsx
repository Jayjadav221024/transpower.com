import SEO from '../components/common/SEO';

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO 
        title="Privacy Policy - Transpower Technologies Pvt. Ltd." 
        description="Privacy policy and data protection terms for Transpower Technologies Pvt. Ltd."
      />

      <section style={{ padding: '8rem 1.5rem 4rem', background: '#090e18', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Privacy Policy</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Effective Date: August 4, 2026</p>
        </div>
      </section>

      <section style={{ padding: '4rem 1.5rem', background: '#fff', color: 'var(--text-main)', lineHeight: 1.6 }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>1. Introduction</h2>
          <p>
            Transpower Technologies Pvt. Ltd. ("we", "us", or "our") respects your privacy and is committed to protecting the personal and business data you share with us. This Privacy Policy describes how we collect, use, and safeguard information when you use our website, send inquiries, or request technical specification quotes.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>2. Information We Collect</h2>
          <p>
            We collect information that you voluntarily provide to us when submitting quotation requests, contact forms, or quick inquiries. This data includes:
          </p>
          <ul>
            <li>Full Name and Job Title</li>
            <li>Company Name</li>
            <li>Business Email Address</li>
            <li>Business Phone / WhatsApp Number</li>
            <li>Specific product requirements, quantity estimates, and project details</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>3. How We Use Your Information</h2>
          <p>
            The information we collect is strictly used to process your engineering inquiries and generate formal commercial quotations. We do not sell, rent, or distribute your data to third-party marketers. Specifically, we use your data to:
          </p>
          <ul>
            <li>Evaluate material, load, span, or electric motor frame specifications.</li>
            <li>Send formal price quotations and technical drawings.</li>
            <li>Coordinate supply logistics, orders, and engineering support.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>4. Data Retention Policy</h2>
          <p>
            We retain business inquiry and contact information only as long as necessary to fulfill the purposes for which it was collected, including standard financial audit cycles, customer support history, and product lifetime tracking. Typical retention periods for inactive business correspondence are five (5) years.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>5. Cookies and Tracking</h2>
          <p>
            Our website uses cookies to store preference selections, prevent redundant popups (such as the cookie banner itself), and run basic, anonymous website usage analytics to ensure page performance.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>6. Contact and Grievances</h2>
          <p>
            If you have questions about our data practices, or wish to request the deletion or correction of your business records, please contact our head office:
          </p>
          <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong>Transpower Technologies Pvt. Ltd.</strong><br />
            Address: 346, Makarpura GIDC, Vadodara, Gujarat 390010<br />
            Email: sales@transpower.net.in | baroda@transpower.net.in
          </p>

        </div>
      </section>
    </>
  );
}

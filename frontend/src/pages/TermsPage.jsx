import SEO from '../components/common/SEO';

export default function TermsPage() {
  return (
    <>
      <SEO 
        title="Terms of Use - Transpower Technologies Pvt. Ltd." 
        description="Terms and conditions governing the use of the Transpower Technologies website."
      />

      <section style={{ padding: '8rem 1.5rem 4rem', background: '#090e18', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Terms of Use</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Effective Date: August 4, 2026</p>
        </div>
      </section>

      <section style={{ padding: '4rem 1.5rem', background: '#fff', color: 'var(--text-main)', lineHeight: 1.6 }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>1. Agreement to Terms</h2>
          <p>
            By accessing or using the website of Transpower Technologies Pvt. Ltd., you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree to these terms, please do not use this website.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>2. Business Identity and Scope</h2>
          <p>
            Transpower Technologies Pvt. Ltd. operates as an authorized distributor, dealer, and channel partner for industrial engineering manufacturers including Siemens, Crompton Greaves, Innomotics, Hindustan Electric Motors, and Rotomotive. We supply mechanical and electrical products, and represent these brands under their official guidelines.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>3. Inquiry Form Submissions</h2>
          <p>
            When you submit information through our inquiry or RFQ forms, you warrant that the details provided are accurate and represent a legitimate business requirement. Any false or spam inquiries may be filtered or discarded.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>4. Disclaimer of Quotations</h2>
          <p>
            Any prices, estimations, or engineering sizing parameters provided through form replies, calculators, or email correspondence are for initial estimation purposes only. A formal, binding commercial contract is only established when a signed quotation, purchase order, and standard transactional terms are mutually agreed upon in writing.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem' }}>5. Intellectual Property</h2>
          <p>
            All brand logos (Siemens, Crompton Greaves, Innomotics, Hindustan Electric Motors, and Rotomotive) and trademarks displayed on this site belong to their respective corporate owners and are used strictly under our authorized distribution/channel partnership representation. All original website structure, code, and composite specifications are copyrighted by Transpower Technologies Pvt. Ltd.
          </p>

        </div>
      </section>
    </>
  );
}

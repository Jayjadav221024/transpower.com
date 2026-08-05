import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import '../styles/locations.css';
import { PRODUCT_CARDS } from '../data/products';
import { SITE_NAME, absoluteUrl } from '../config/site';
import { GROUP_OFFICES } from '../data/company';
import { CITIES } from '../data/cities';
import SEOKeywordsBlock from '../components/common/SEOKeywordsBlock';

export default function LocationsPage() {
  const title = 'Where We Supply';
  const description = 'Transpower Technologies Pvt. Ltd. supplies high-performance FRP molded gratings, cable trays, industrial gearboxes, and electrical switchgears through our offices and extensive supply network in Vadodara, Ahmedabad, Anand, Ankleshwar, Bharuch, Surat, Rajkot, Godhra, Navsari, Vapi, Bhuj, Amreli, and Dahod.';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Locations', item: absoluteUrl('/locations') },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${SITE_NAME} Office Network`,
      numberOfItems: GROUP_OFFICES.length,
      itemListElement: GROUP_OFFICES.map((o, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: o.name,
        address: o.address
      })),
    },
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords="FRP gratings supplier Gujarat, industrial gear boxes Vadodara, switchgears Ankleshwar, Shreeraj Traders Ahmedabad, Techno Sales Agency Ankleshwar"
        canonical="/locations"
        jsonLd={jsonLd}
      />

      <section className="locations-hero" style={{ padding: '8rem 1.5rem 4rem', textAlign: 'center', background: '#090e18', color: '#fff' }}>
        <div className="container">
          <nav className="city-breadcrumb" aria-label="Breadcrumb" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#475569' }}>/</span>
            <span style={{ color: '#f8fafc' }}>Where We Supply</span>
          </nav>

          <span className="badge-tag" style={{ background: 'rgba(225, 89, 11, 0.15)', color: '#ff7a29', padding: '4px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 800 }}>Our Office Network</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '1rem', letterSpacing: '-0.02em' }}>Where We Supply Across Gujarat</h1>
          <p className="locations-hero-lead" style={{ maxWidth: '680px', margin: '1rem auto 0', color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
            Transpower Technologies Pvt. Ltd. coordinates supply, B2B distribution, and engineering support for our complete industrial infrastructure line from our registered offices and group stock points across major industrial hubs in Gujarat.
          </p>
        </div>
      </section>

      <section className="section" style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <div className="locations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2rem' }}>
            {GROUP_OFFICES.map((office) => (
              <div 
                className="location-card" 
                key={office.name} 
                style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <div className="location-card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{office.name}</h2>
                  {!office.isSalesOffice && <span className="location-hq" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>Support</span>}
                  {office.isSalesOffice && office.name.includes('Head') && <span className="location-hq" style={{ background: 'rgba(225, 89, 11, 0.1)', color: 'var(--accent-orange)', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>Head Office</span>}
                </div>
                <span className="location-district" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{office.description}</span>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5, margin: '0.5rem 0' }}>{office.address}, Pincode: {office.pincode}</p>
                
                {office.phone.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Phone: </strong>{office.phone.join(', ')}
                  </div>
                )}
                
                {office.email.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Email: </strong>{office.email.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section locations-cities" style={{ padding: '4rem 1.5rem', background: '#fff', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Service Locations We Cover</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              We supply and support our entire industrial product line across major industrial estates and cities in Gujarat. Click on any city to view local details, industries served, and nearby areas.
            </p>
          </div>
          <div className="locations-cities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {CITIES.map((city) => (
              <Link
                to={`/locations/${city.slug}`}
                key={city.slug}
                className="city-card-link"
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--accent-orange)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <strong style={{ fontSize: '1.1rem', fontWeight: 800 }}>{city.name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{city.district} District</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-orange)', fontWeight: 700, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View details <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section locations-products" style={{ background: '#f8fafc', padding: '4rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Supplied Across Our Network</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Our complete range of industrial composite products and electric drives is distributed through all locations.</p>
          </div>
          <div className="locations-product-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
            {PRODUCT_CARDS.map((p) => (
              <Link 
                to={`/product/${p.id}`} 
                className="locations-product-chip" 
                key={p.id}
                style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '180px', textDecoration: 'none', color: 'var(--text-main)', transition: 'transform 0.2s' }}
              >
                <img src={p.image} alt={p.title} width="140" height="100" loading="lazy" decoding="async" style={{ borderRadius: '6px', objectFit: 'contain' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{p.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SEOKeywordsBlock placement="locations" />
    </>
  );
}

import { Link } from 'react-router-dom';

import SEO from '../components/common/SEO';
import '../styles/locations.css';
import { CITIES } from '../data/cities';
import { PRODUCT_CARDS } from '../data/products';
import { SITE_NAME, absoluteUrl } from '../config/site';

export default function LocationsPage() {
  const title = 'FRP Gratings, Cable Trays & Gearbox Suppliers Across Gujarat';
  const description = `Transpower supplies FRP molded gratings, fiberglass cable trays, pultruded profiles, industrial gear boxes and power switchgears across ${CITIES.length} cities in Gujarat — including ${CITIES.slice(0, 6).map((c) => c.name).join(', ')}.`;

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
      name: `${SITE_NAME} service locations in Gujarat`,
      numberOfItems: CITIES.length,
      itemListElement: CITIES.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `FRP & industrial products in ${c.name}`,
        url: absoluteUrl(`/locations/${c.slug}`),
      })),
    },
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={`FRP gratings Gujarat, FRP cable trays Gujarat, industrial gear boxes Gujarat, power switchgears Gujarat, ${CITIES.map((c) => `FRP supplier ${c.name}`).join(', ')}`}
        canonical="/locations"
        jsonLd={jsonLd}
      />

      <section className="locations-hero">
        <div className="container">
          <nav className="city-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Locations</span>
          </nav>

          <span className="badge-tag">Available Offline &amp; Online in Gujarat</span>
          <h1>Where We Supply Across Gujarat</h1>
          <p className="locations-hero-lead">
            Every product is manufactured at our Makarpura, Vadodara facility and supplied to
            industrial clients across {CITIES.length} cities in Gujarat. Choose your city to see the
            product lines specified most often in that region, the industrial estates we cover, and
            local enquiry details.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="locations-grid">
            {CITIES.map((city) => (
              <Link to={`/locations/${city.slug}`} className="location-card" key={city.slug}>
                <div className="location-card-head">
                  <h2>{city.name}</h2>
                  {city.isHeadOffice && <span className="location-hq">Plant</span>}
                </div>
                <span className="location-district">{city.district} district, Gujarat</span>
                <p>{city.industries[0]}</p>
                <div className="location-card-foot">
                  <span>{city.areas.length} zones covered</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section locations-products">
        <div className="container">
          <div className="section-header">
            <h2>Supplied in Every Location</h2>
            <p>The complete Transpower range is available across all cities listed above.</p>
          </div>
          <div className="locations-product-strip">
            {PRODUCT_CARDS.map((p) => (
              <Link to={`/product/${p.id}`} className="locations-product-chip" key={p.id}>
                <img src={p.image} alt={p.title} width="160" height="120" loading="lazy" decoding="async" />
                <span>{p.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

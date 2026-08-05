import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';

import SEO from '../components/common/SEO';
import RfqForm from '../components/site/RfqForm';
import '../styles/locations.css';
import { PRODUCT_CARDS } from '../data/products';
import { getCityBySlug, orderedProductIds, nearbyCities, cityFaqs } from '../data/cities';
import { SITE_ORIGIN, SITE_NAME, HEAD_OFFICE, absoluteUrl } from '../config/site';

const productById = (id) => PRODUCT_CARDS.find((p) => p.id === id);

export default function CityPage() {
  const { citySlug } = useParams();
  const city = getCityBySlug(citySlug);
  const [openFaq, setOpenFaq] = useState(0);

  /* Unknown slug falls through to the 404 route rather than rendering an empty
     shell that Google could index. */
  if (!city) return <Navigate to="/404" replace />;

  const products = orderedProductIds(city).map(productById).filter(Boolean);
  const productTitles = products.map((p) => p.title);
  const faqs = cityFaqs(city, productTitles.slice(0, 3));
  const nearby = nearbyCities(city);
  const path = `/locations/${city.slug}`;

  const title = `FRP Gratings, Cable Trays, Gear Boxes & Switchgears in ${city.name}`;
  const description = `Transpower supplies FRP molded gratings, fiberglass cable trays, pultruded profiles, industrial gear boxes and power switchgears to plants in ${city.name}, ${city.district} district, Gujarat. ISO 9001:2015 and ASTM E84 Class 1 certified.`;
  const keywords = [
    `FRP gratings ${city.name}`,
    `FRP cable trays ${city.name}`,
    `industrial gear boxes ${city.name}`,
    `power switchgears ${city.name}`,
    `pultruded FRP profiles ${city.name}`,
    `FRP manufacturer ${city.name}`,
    `FRP supplier ${city.district} Gujarat`,
    ...city.areas.slice(0, 3).map((a) => `FRP grating ${a}`),
  ].join(', ');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${absoluteUrl(path)}#business`,
      name: `${SITE_NAME} — ${city.name}`,
      url: absoluteUrl(path),
      description,
      telephone: HEAD_OFFICE.phone,
      email: HEAD_OFFICE.email,
      image: `${SITE_ORIGIN}/assets/images/hero_frp_grating.webp`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: HEAD_OFFICE.street,
        addressLocality: HEAD_OFFICE.city,
        addressRegion: HEAD_OFFICE.region,
        postalCode: HEAD_OFFICE.postalCode,
        addressCountry: HEAD_OFFICE.country,
      },
      areaServed: {
        '@type': 'City',
        name: city.name,
        containedInPlace: { '@type': 'AdministrativeArea', name: `${city.district}, Gujarat, India` },
      },
      makesOffer: products.map((p) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Product', name: p.title, description: p.desc },
        areaServed: city.name,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Locations', item: absoluteUrl('/locations') },
        { '@type': 'ListItem', position: 3, name: city.name, item: absoluteUrl(path) },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        canonical={path}
        jsonLd={jsonLd}
      />

      <section className="city-hero">
        <div className="container">
          <nav className="city-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/locations">Locations</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{city.name}</span>
          </nav>

          <span className="badge-tag">
            {city.isHeadOffice ? 'Manufacturing Facility' : `Serving ${city.district} District`}
          </span>

          <h1>
            FRP Gratings, Cable Trays &amp; Industrial Drives in{' '}
            <span className="city-hero-accent">{city.name}</span>
          </h1>

          <p className="city-hero-lead">{city.lead}</p>

          <div className="city-hero-meta">
            <div className="city-meta-item">
              <strong>{products.length}</strong>
              <span>Product lines supplied</span>
            </div>
            <div className="city-meta-item">
              <strong>{city.isHeadOffice ? 'On site' : `~${city.distanceKm} km`}</strong>
              <span>{city.isHeadOffice ? 'Plant located here' : 'From Vadodara plant'}</span>
            </div>
            <div className="city-meta-item">
              <strong>{city.areas.length}</strong>
              <span>Industrial zones covered</span>
            </div>
          </div>

          <div className="city-hero-actions">
            <a href="#city-quote" className="btn btn-primary">Get a {city.name} Quote</a>
            <a href={`tel:${HEAD_OFFICE.phone.replace(/[^+\d]/g, '')}`} className="btn btn-secondary">
              Call +91 98255 07517
            </a>
          </div>
        </div>
      </section>

      <section className="section city-products">
        <div className="container">
          <div className="section-header">
            <h2>Products Available in {city.name}</h2>
            <p>
              The full Transpower range is supplied to {city.name}. The lines below are ordered by
              what {city.name}&apos;s industries specify most often.
            </p>
          </div>

          <div className="city-product-grid">
            {products.map((product, i) => (
              <article className="city-product-card" key={product.id}>
                <div className="city-product-media">
                  <img 
                    src={product.image} 
                    alt={`${product.title} supplied in ${city.name}`} 
                    width="300" 
                    height="200" 
                    loading="lazy" 
                    decoding="async" 
                  />
                  {i < city.focus.length && <span className="city-product-flag">Most specified here</span>}
                </div>
                <div className="city-product-body">
                  <span className="city-product-cat">{product.badge}</span>
                  <h3>{product.title} in {city.name}</h3>
                  <p>{product.desc}</p>
                  <ul className="city-product-specs">
                    {product.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                  <Link to={`/product/${product.id}`} className="city-product-link">
                    View specifications <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section city-industries-section">
        <div className="container">
          <div className="city-two-col">
            <div>
              <h2>Industries We Supply in {city.name}</h2>
              <p className="city-col-lead">
                {city.name} sits in the {city.district} industrial belt. These are the sectors where
                our composite and power transmission products are specified.
              </p>
              <ul className="city-industry-list">
                {city.industries.map((industry) => (
                  <li key={industry}>{industry}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2>Areas Covered Around {city.name}</h2>
              <p className="city-col-lead">
                Supply and site support extends across {city.name} city and the surrounding estates
                and GIDC zones listed below.
              </p>
              <ul className="city-area-list">
                {city.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section city-faq-section">
        <div className="container city-faq-container">
          <div className="section-header">
            <h2>{city.name} — Frequently Asked Questions</h2>
          </div>

          <div className="city-faq-list">
            {faqs.map((faq, i) => (
              <div className={`city-faq-item${openFaq === i ? ' open' : ''}`} key={faq.q}>
                <button
                  type="button"
                  className="city-faq-q"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span>{faq.q}</span>
                  <span className="city-faq-icon" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div className="city-faq-a"><p>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section city-nearby-section">
        <div className="container">
          <h2>We Also Supply Nearby</h2>
          <div className="city-nearby-grid">
            {nearby.map((c) => (
              <Link to={`/locations/${c.slug}`} className="city-nearby-card" key={c.slug}>
                <strong>{c.name}</strong>
                <span>{c.district} district</span>
              </Link>
            ))}
          </div>
          <Link to="/locations" className="city-all-link">
            View all service locations in Gujarat <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <div id="city-quote">
        <RfqForm />
      </div>
    </>
  );
}

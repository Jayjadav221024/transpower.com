import { Link } from 'react-router-dom';

import SEO from '../components/common/SEO';
import ProductCatalog from '../components/site/ProductCatalog';
import AuthorizedBrands from '../components/site/AuthorizedBrands';
import RfqForm from '../components/site/RfqForm';
import { PRODUCT_CARDS } from '../data/products';
import { SITE_NAME, absoluteUrl } from '../config/site';
import '../styles/locations.css';

export default function ProductsPage() {
  const title = 'Industrial Product Catalog — FRP, Gear Boxes, Motors & Switchgears';
  const description = `Full Transpower product range: ${PRODUCT_CARDS.map((p) => p.title).join(', ')}. Manufactured and supplied from Vadodara, Gujarat. ISO 9001:2015 certified.`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Products', item: absoluteUrl('/products') },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${SITE_NAME} product catalog`,
      numberOfItems: PRODUCT_CARDS.length,
      itemListElement: PRODUCT_CARDS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: absoluteUrl(`/product/${p.id}`),
      })),
    },
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={PRODUCT_CARDS.map((p) => p.title).join(', ')}
        canonical="/products"
        jsonLd={jsonLd}
      />

      <section className="locations-hero">
        <div className="container">
          <nav className="city-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Products</span>
          </nav>

          <span className="badge-tag">Full Industrial Lineup</span>
          <h1>Our Product Catalog</h1>
          <p className="locations-hero-lead">
            {PRODUCT_CARDS.length} product lines spanning FRP composites, power transmission and
            electrical distribution — manufactured and supplied from our Makarpura, Vadodara
            facility. All items are quoted to your span, load and duty specification.
          </p>
        </div>
      </section>

      <ProductCatalog />
      <AuthorizedBrands />
      <RfqForm />
    </>
  );
}

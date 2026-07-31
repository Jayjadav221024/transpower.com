import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_CARDS, PRODUCT_FILTERS } from '../../data/products';

export default function ProductCatalog() {
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all'
    ? PRODUCT_CARDS
    : PRODUCT_CARDS.filter((p) => p.category === filter);

  return (
    <section id="products" className="section">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Full Industrial Lineup</div>
          <h2>Our Core <span className="text-orange">Product Catalog</span></h2>
          <p>Engineered for chemical plants, power sub-stations, marine platforms, and heavy manufacturing facilities.</p>
        </div>

        <div className="product-tabs">
          {PRODUCT_FILTERS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab-btn${filter === tab.key ? ' active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {visible.map((p) => (
            <article className="product-card" key={p.title}>
              <div className="product-badge">{p.badge}</div>
              <div className="product-image-wrap">
                <img src={p.image} alt={p.imgAlt} width="400" height="220" loading="lazy" decoding="async" />
              </div>
              <div className="product-body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <ul className="product-specs-list">
                  {p.specs.map((s) => <li key={s}>{s}</li>)}
                </ul>
                <Link to={`/product/${p.id}`} className="btn btn-secondary">{p.cta}</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { publicApi } from '../api/client';
import SEO from '../components/common/SEO';

export default function ProductPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const [data, setData] = useState({
    // Categories List
    catAll: 'ALL PRODUCTS',
    catFrp: 'FRP & GRATINGS',
    catTrays: 'FRP CABLE TRAYS',
    catBoxes: 'GEAR BOXES',
    catSwitch: 'SWITCHGEARS',

    // Product 1: FRP Cable Trays
    title1: 'FRP CABLE TRAYS',
    badge1: 'TOP SELLER',
    desc1: 'Heavy-duty ladder, perforated, and trough composite cable management systems engineered with non-conductive UV-resistant fiberglass.',
    bullet1_1: 'Ladder & Perforated Channel types',
    bullet1_2: 'Dielectric - Zero short circuit risk',
    bullet1_3: 'Corrosion proof for chemical & marine environments',
    btnText1: 'GET CABLE TRAY SPECS',
    image1: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=500&q=80',

    // Product 2: Industrial Gear Boxes
    title2: 'INDUSTRIAL GEAR BOXES',
    badge2: 'NEW LINE',
    desc2: 'High-torque helical, bevel, worm, and planetary gearmotors designed for continuous heavy duty industrial drives and conveyors.',
    bullet2_1: 'Helical & Bevel-Helical Gear Drives',
    bullet2_2: 'High efficiency (> 96% output transfer)',
    bullet2_3: 'Rugged cast iron / alloy housing options',
    btnText2: 'GET GEARBOX CATALOG',
    image2: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80',

    // Product 3: Power Switchgears
    title3: 'POWER SWITCHGEARS',
    badge3: 'POWER SYSTEMS',
    desc3: 'Industrial circuit breakers, motor control centers (MCC), contactors, and power distribution switchgears for plant electrical safety.',
    bullet3_1: 'Air Circuit Breakers (ACB) & MCCB range',
    bullet3_2: 'Motor Control & Power Distribution Panels',
    bullet3_3: 'Tested for high short-circuit withstand capacity',
    btnText3: 'GET SWITCHGEAR SPECS',
    image3: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=500&q=80',

    // Product 4: FRP Gratings
    title4: 'FRP GRATINGS & PROFILES',
    badge4: 'BEST SELLER',
    desc4: 'High-strength molded and pultruded fiberglass composite gratings for industrial flooring, walkways, and drainage covers.',
    bullet4_1: 'Quartz grit slip-resistant top surface',
    bullet4_2: 'Bi-directional mechanical loading capacity',
    bullet4_3: 'Inert to acidic and alkaline environments',
    btnText4: 'GET GRATING SPECS',
    image4: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80'
  });

  useEffect(() => {
    publicApi.getPageContent('productpage')
      .then(res => {
        if (res && res.content) {
          setData(prev => ({ ...prev, ...res.content }));
        }
      })
      .catch(() => {});
  }, []);

  // Simple category filtering map
  const categories = [
    { id: 'all', labelKey: 'catAll' },
    { id: 'frp', labelKey: 'catFrp' },
    { id: 'trays', labelKey: 'catTrays' },
    { id: 'boxes', labelKey: 'catBoxes' },
    { id: 'switch', labelKey: 'catSwitch' }
  ];

  const productsList = [
    {
      id: 1,
      cat: 'trays',
      titleKey: 'title1',
      badgeKey: 'badge1',
      descKey: 'desc1',
      bulletKeys: ['bullet1_1', 'bullet1_2', 'bullet1_3'],
      btnTextKey: 'btnText1',
      imageKey: 'image1'
    },
    {
      id: 2,
      cat: 'boxes',
      titleKey: 'title2',
      badgeKey: 'badge2',
      descKey: 'desc2',
      bulletKeys: ['bullet2_1', 'bullet2_2', 'bullet2_3'],
      btnTextKey: 'btnText2',
      imageKey: 'image2'
    },
    {
      id: 3,
      cat: 'switch',
      titleKey: 'title3',
      badgeKey: 'badge3',
      descKey: 'desc3',
      bulletKeys: ['bullet3_1', 'bullet3_2', 'bullet3_3'],
      btnTextKey: 'btnText3',
      imageKey: 'image3'
    },
    {
      id: 4,
      cat: 'frp',
      titleKey: 'title4',
      badgeKey: 'badge4',
      descKey: 'desc4',
      bulletKeys: ['bullet4_1', 'bullet4_2', 'bullet4_3'],
      btnTextKey: 'btnText4',
      imageKey: 'image4'
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? productsList 
    : productsList.filter(p => p.cat === activeCategory);

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const apiBase = import.meta.env.VITE_API_URL || '';
    return `${apiBase}${path}`;
  };

  return (
    <>
      <SEO 
        title="Transpower Products Catalog - FRP Systems & Industrial Gearboxes" 
        description="Explore Transpower's certified FRP gratings, composite cable trays, heavy-duty industrial gearboxes, and power switchgears." 
        keywords="FRP cable trays, industrial gear boxes, power switchgears, composite gratings"
      />

      <div className="product-catalog-container container" style={{ padding: '6rem 1.5rem 4rem', marginTop: '2rem' }}>
        
        {/* Navigation Category Filters */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '50px',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                border: activeCategory === c.id ? 'none' : '1px solid #cbd5e1',
                background: activeCategory === c.id ? 'var(--accent-orange)' : '#fff',
                color: activeCategory === c.id ? '#fff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeCategory === c.id ? '0 4px 10px rgba(217, 101, 59, 0.15)' : 'none'
              }}
            >
              <span data-edit-page="productpage" data-edit-key={c.labelKey}>{data[c.labelKey]}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {filteredProducts.map((p) => (
            <div 
              key={p.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image Block with Dark Background */}
              <div style={{ background: '#0e1a2b', padding: '1rem', height: '260px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span 
                  data-edit-page="productpage" 
                  data-edit-key={p.badgeKey}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(20, 96, 122, 0.9)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '40px',
                    letterSpacing: '0.05em'
                  }}
                >
                  {data[p.badgeKey]}
                </span>
                
                <img 
                  data-edit-page="productpage"
                  data-edit-key={p.imageKey}
                  src={getFullImageUrl(data[p.imageKey])} 
                  alt={data[p.titleKey]} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                />
              </div>

              {/* Description Block */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 
                    data-edit-page="productpage" 
                    data-edit-key={p.titleKey}
                    style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0e1a2b', marginBottom: '0.8rem', letterSpacing: '-0.01em' }}
                  >
                    {data[p.titleKey]}
                  </h3>
                  
                  <p 
                    data-edit-page="productpage" 
                    data-edit-key={p.descKey}
                    style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}
                  >
                    {data[p.descKey]}
                  </p>

                  {/* Bullet checkmarks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                    {p.bulletKeys.map((bk, bidx) => (
                      <div key={bidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: '#475569' }}>
                        <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>✓</span>
                        <span data-edit-page="productpage" data-edit-key={bk}>{data[bk]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action button */}
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '30px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-orange)';
                    e.currentTarget.style.color = 'var(--accent-orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.color = '#1e293b';
                  }}
                >
                  <span data-edit-page="productpage" data-edit-key={p.btnTextKey}>{data[p.btnTextKey]}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </>
  );
}

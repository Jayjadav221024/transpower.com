import { useState, useEffect } from 'react';
import { publicApi } from '../api/client';
import SEO from '../components/common/SEO';

export default function ProductPage() {
  const [data, setData] = useState({
    title: 'Transpower FRP Grating Profile',
    category: 'High-Performance composite',
    badge: 'Industrial Grade',
    price: '$59.99',
    originalPrice: '$79.99',
    discount: 'Save 25%',
    description: 'Promotes high load stability and corrosion resistance for chemical plants, walkways, platforms, and heavy industrial facilities.',
    activeTab: 'details',
    detailsText: 'Our pultruded and molded FRP gratings provide ultimate strength and electrical insulation. Engineered to replace steel in high-acid or corrosive environments.',
    benefitsText: 'Provides zero short-circuit risks, light weight for easy installation, and runs completely maintenance-free for over 30 years.',
    useText: 'Ideal for chemical processing walkways, oil & gas decks, electrical substation flooring, and marine platforms.',
    quantityOption: '2 Pack',
    purchaseType: 'once',
    feature1: 'Corrosion Resistant',
    feature2: 'Non-Conductive',
    feature3: 'Lightweight',
    feature4: 'Flame Retardant',
    benefit1: 'High Load',
    benefit2: 'Anti-Slip',
    benefit3: 'Long Life',
    benefit4: 'Easy Install'
  });

  const [activeTabState, setActiveTabState] = useState('details');
  const [activeQty, setActiveQty] = useState('2');
  const [purchaseTypeState, setPurchaseTypeState] = useState('once');

  useEffect(() => {
    publicApi.getPageContent('productpage')
      .then(res => {
        if (res && res.content) {
          setData(prev => ({ ...prev, ...res.content }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO 
        title="Industrial FRP Product Catalog & Ordering" 
        description="Configure and request quotes for high-efficiency composite FRP gratings, structural profiles, and custom panels." 
        keywords="FRP grating order, composite profile ordering, industrial composite supply"
      />

      <div className="product-page-container container" style={{ padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', marginTop: '2.5rem' }}>
        
        {/* Left Side: Product Showcase & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Far Left Vertical Feature Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 101, 59, 0.08)', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>🧪</span>
                <span data-edit-page="productpage" data-edit-key="feature1" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.feature1}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 101, 59, 0.08)', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>⚡</span>
                <span data-edit-page="productpage" data-edit-key="feature2" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.feature2}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 101, 59, 0.08)', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>⚖️</span>
                <span data-edit-page="productpage" data-edit-key="feature3" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.feature3}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 101, 59, 0.08)', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>🔥</span>
                <span data-edit-page="productpage" data-edit-key="feature4" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.feature4}</span>
              </div>
            </div>

            {/* Central Product Showcase Image */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
              <img 
                data-edit-page="productpage"
                data-edit-key="productImage"
                src={data.productImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'} 
                alt="Product" 
                style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', mixBlendMode: 'multiply' }} 
              />
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '95px' }}>
            <div style={{ width: '70px', height: '70px', border: '2px solid var(--accent-orange)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: '4px', background: '#fff' }}>
              <img src={data.productImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&q=80'} alt="Thumb 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ width: '70px', height: '70px', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: '4px', background: '#fff' }}>
              <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=150&q=80" alt="Thumb 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ width: '70px', height: '70px', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: '4px', background: '#fff' }}>
              <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80" alt="Thumb 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Benefit Badge Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginLeft: '95px', marginTop: '1rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.6rem 0.3rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🛡️ <span data-edit-page="productpage" data-edit-key="benefit1">{data.benefit1}</span>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.6rem 0.3rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ⚙️ <span data-edit-page="productpage" data-edit-key="benefit2">{data.benefit2}</span>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.6rem 0.3rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🔋 <span data-edit-page="productpage" data-edit-key="benefit3">{data.benefit3}</span>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.6rem 0.3rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🔧 <span data-edit-page="productpage" data-edit-key="benefit4">{data.benefit4}</span>
            </div>
          </div>

        </div>

        {/* Right Side: Product Details & Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Breadcrumb badges */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span data-edit-page="productpage" data-edit-key="category" style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-orange)' }}>{data.category}</span>
            <span style={{ color: 'var(--border-strong)' }}>/</span>
            <span data-edit-page="productpage" data-edit-key="badge" style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{data.badge}</span>
          </div>

          <h1 data-edit-page="productpage" data-edit-key="title" style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: 1.1 }}>
            {data.title}
          </h1>

          {/* Pricing Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fafafa', padding: '0.8rem 1.2rem', borderRadius: '8px', border: '1px solid var(--border)', width: 'fit-content' }}>
            <span data-edit-page="productpage" data-edit-key="price" style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>{data.price}</span>
            <span data-edit-page="productpage" data-edit-key="originalPrice" style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>{data.originalPrice}</span>
            <span data-edit-page="productpage" data-edit-key="discount" style={{ background: 'var(--accent-orange)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{data.discount}</span>
          </div>

          {/* Dynamic Tabs Block */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '1.5rem', marginBottom: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setActiveTabState('details')}
                style={{ paddingBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: activeTabState === 'details' ? 'var(--accent-orange)' : 'var(--text-muted)', borderBottom: activeTabState === 'details' ? '2.5px solid var(--accent-orange)' : 'none', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
              >
                Details
              </button>
              <button 
                type="button" 
                onClick={() => setActiveTabState('benefits')}
                style={{ paddingBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: activeTabState === 'benefits' ? 'var(--accent-orange)' : 'var(--text-muted)', borderBottom: activeTabState === 'benefits' ? '2.5px solid var(--accent-orange)' : 'none', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
              >
                Benefits
              </button>
              <button 
                type="button" 
                onClick={() => setActiveTabState('use')}
                style={{ paddingBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: activeTabState === 'use' ? 'var(--accent-orange)' : 'var(--text-muted)', borderBottom: activeTabState === 'use' ? '2.5px solid var(--accent-orange)' : 'none', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
              >
                How to Use
              </button>
            </div>
            
            {/* Tab content displays */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '80px', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {activeTabState === 'details' && <p data-edit-page="productpage" data-edit-key="detailsText">{data.detailsText}</p>}
              {activeTabState === 'benefits' && <p data-edit-page="productpage" data-edit-key="benefitsText">{data.benefitsText}</p>}
              {activeTabState === 'use' && <p data-edit-page="productpage" data-edit-key="useText">{data.useText}</p>}
            </div>
          </div>

          {/* Package / Quantity Selectors */}
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.6rem' }}>Select Quantity Options:</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
              <div 
                onClick={() => setActiveQty('1')}
                style={{ border: activeQty === '1' ? '2px solid var(--accent-orange)' : '1px solid var(--border)', background: activeQty === '1' ? 'rgba(217, 101, 59, 0.03)' : '#fff', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>📦</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>Single Pack</div>
              </div>
              <div 
                onClick={() => setActiveQty('2')}
                style={{ border: activeQty === '2' ? '2px solid var(--accent-orange)' : '1px solid var(--border)', background: activeQty === '2' ? 'rgba(217, 101, 59, 0.03)' : '#fff', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s', position: 'relative' }}
              >
                <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-orange)', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '10px' }}>Best Value</span>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>📦📦</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>Double Pack</div>
              </div>
              <div 
                onClick={() => setActiveQty('3')}
                style={{ border: activeQty === '3' ? '2px solid var(--accent-orange)' : '1px solid var(--border)', background: activeQty === '3' ? 'rgba(217, 101, 59, 0.03)' : '#fff', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🏭</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>Bulk Industrial</div>
              </div>
            </div>
          </div>

          {/* Option select box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
            <label 
              onClick={() => setPurchaseTypeState('once')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', cursor: 'pointer', background: purchaseTypeState === 'once' ? 'rgba(217, 101, 59, 0.02)' : '#fff' }}
            >
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <input type="radio" checked={purchaseTypeState === 'once'} onChange={() => {}} style={{ accentColor: 'var(--accent-orange)' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>One Time Purchase</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Single batch shipment</span>
                </div>
              </div>
              <strong style={{ fontSize: '0.9rem' }}>{data.price}</strong>
            </label>

            <label 
              onClick={() => setPurchaseTypeState('sub')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', cursor: 'pointer', background: purchaseTypeState === 'sub' ? 'rgba(217, 101, 59, 0.02)' : '#fff' }}
            >
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <input type="radio" checked={purchaseTypeState === 'sub'} onChange={() => {}} style={{ accentColor: 'var(--accent-orange)' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>Flexible Supply Contract</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Deliver batch recurring monthly (Save 10%)</span>
                </div>
              </div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--accent-orange)' }}>$53.99</strong>
            </label>
          </div>

          {/* CTA Add to cart */}
          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 800, marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            🛒 Add To Order / Request B2B Quote
          </button>

          {/* Trust guarantee seal */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <span>✅</span>
            <span><strong>30-Day Guarantee:</strong> If the product specifications do not fit your span load requirements, we offer full exchange support.</span>
          </div>

        </div>

      </div>
    </>
  );
}

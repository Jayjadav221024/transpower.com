import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../api/client';
import SEO from '../components/common/SEO';

const PRODUCT_DEFAULTS = {
  'cable-trays': {
    title: 'FRP Cable Trays',
    category: 'Cable Management',
    badge: '⚡ Non-Conductive',
    feature1: 'Corrosion Proof',
    feature2: 'Non-Conductive',
    feature3: 'UV Stabilised',
    feature4: 'Flame Retardant',
    benefit1: 'Zero Sparking',
    benefit2: 'Anti-Slip',
    benefit3: 'Long Life',
    benefit4: 'Easy Install',
    detailsText: 'Non-conductive ladder and perforated trough cable management trays engineered for high-voltage power stations and marine offshore platforms.',
    benefitsText: 'Provides zero short-circuit risks, runs maintenance-free, and handles high physical load and spans in highly corrosive zones.',
    useText: 'Commonly utilized in chemical walkways, oil & gas decks, electrical substations, and coastal installations.',
    productImage: '/assets/images/cable_tray_product.webp'
  },
  'gear-boxes': {
    title: 'Industrial Gear Boxes',
    category: 'Power Transmission',
    badge: '⚙️ High-Torque',
    feature1: 'High Torque',
    feature2: 'Helical & Bevel',
    feature3: 'Cast Iron Body',
    feature4: 'Low Maintenance',
    benefit1: 'Helical Gears',
    benefit2: 'Smooth Run',
    benefit3: 'Heavy Load',
    benefit4: 'Compact Fit',
    detailsText: 'High-torque helical, bevel, worm, and planetary gearmotors designed for continuous heavy-duty industrial drives and conveyors.',
    benefitsText: 'Engineered for high power transmission efficiency. Rugged housing options built for harsh industrial atmospheres.',
    useText: 'Widely used in mining conveyors, chemical mixers, water treatment drives, and material handling systems.',
    productImage: '/assets/images/gearboxes_product.webp'
  },
  'switchgears': {
    title: 'Power Switchgears',
    category: 'Power Distribution',
    badge: '🔌 High-Voltage',
    feature1: 'Tested Safety',
    feature2: 'ACB & MCCB',
    feature3: 'Modular Panels',
    feature4: 'Arc Resistant',
    benefit1: 'Fast Break',
    benefit2: 'Thermal Sensor',
    benefit3: 'Solid Enclosure',
    benefit4: 'Busbar System',
    detailsText: 'Industrial circuit breakers, motor control centers (MCC), contactors, and power distribution switchgears for plant electrical safety.',
    benefitsText: 'Fully compliant with IEC safety standards to guard critical factory machinery.',
    useText: 'Installed in main substations, plant control rooms, and commercial power supply grids.',
    productImage: '/assets/images/switchgears_product.webp'
  },
  'molded-gratings': {
    title: 'Molded FRP Gratings',
    category: 'FRP Composites',
    badge: '🏋️ Structural',
    feature1: 'Grit Top Grip',
    feature2: 'Acid Proof',
    feature3: 'Bidirectional',
    feature4: 'Rust Free',
    benefit1: 'Slip Resistant',
    benefit2: 'Long Lifespan',
    benefit3: 'Low Weight',
    benefit4: 'Fire Safe',
    detailsText: 'Bi-directional strength molded fiberglass mesh panels for chemical plant walkways, trench covers, and platform flooring.',
    benefitsText: 'Features quartz-grit anti-slip top coat. Lightweight panels cut and install on site with zero hot-work permits required.',
    useText: 'Ideal for refinery walkways, drainage trench covers, access stairs, and water treatment decks.',
    productImage: '/assets/images/hero_frp_grating.webp'
  },
  'electric-motors': {
    title: 'Electric Motors',
    category: 'Rotating Equipment',
    badge: '🔄 Authorized Dealer',
    feature1: 'Three-Phase',
    feature2: 'Standard Frames',
    feature3: 'Induction Type',
    feature4: 'Enclosed Frame',
    benefit1: 'Energy Saving',
    benefit2: 'Low Vibration',
    benefit3: 'Long Bearing Life',
    benefit4: 'Wide Frame Range',
    detailsText: 'Three-phase induction and energy-efficient motors supplied as an authorised channel partner for Siemens, Crompton Greaves, Innomotics, Hindustan Electric Motors and Rotomotive.',
    benefitsText: 'Induction motor frames cut running costs on continuous-duty loads, with designs suitable for demanding chemical and engineering applications.',
    useText: 'Driving pumps, compressors, conveyors, agitators, fans and blowers across chemical, textile, water treatment and engineering plants.',
    productImage: '/assets/images/gearboxes_product.webp'
  }
};

export default function ProductPage() {
  const { id } = useParams();
  const productKey = id || 'cable-trays';
  const defaultData = PRODUCT_DEFAULTS[productKey] || PRODUCT_DEFAULTS['cable-trays'];

  const [data, setData] = useState(defaultData);
  const [activeTabState, setActiveTabState] = useState('details');
  const [activeQty, setActiveQty] = useState('2');
  const [purchaseTypeState, setPurchaseTypeState] = useState('once');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Reset state to default first on product key swap
    setData(defaultData);
    
    // Fetch overrides from backend for this specific product key
    publicApi.getPageContent(`productpage_${productKey}`)
      .then(res => {
        if (res && res.content) {
          setData(prev => ({ ...prev, ...res.content }));
        }
      })
      .catch(() => {});
  }, [productKey]);

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    if (path.startsWith('/assets/')) {
      return path;
    }
    const apiBase = import.meta.env.VITE_API_URL || '';
    return `${apiBase}${path}`;
  };

  const pageKey = `productpage_${productKey}`;

  // Specifications and details for each switchgear sub-product
  const SWITCHGEAR_SUB_PRODUCTS = [
    {
      id: 'distribution',
      title: 'Low Voltage Power Distribution Product',
      desc: 'Our Electrical Control Products ensure efficient and safe operation of your electrical systems. From versatile contactors and switching devices to advanced protection devices and motor protection circuit breakers, we offer comprehensive solutions. The SIMOCODE smart motor control device enhances motor monitoring, protection, and control for optimal performance.',
      image: '/assets/images/switchgear_distribution_3d.png',
      specs: {
        'Current Rating': '630A to 6300A',
        'Breaking Capacity': 'Up to 150 kA',
        'Standard': 'IEC 60947-2 Compliant',
        'Releases': 'Intelligent Microprocessor-based releases (Modbus/Profibus support)',
        'Application': 'Main power intake, heavy-duty industrial substations'
      }
    },
    {
      id: 'control',
      title: 'Low Voltage Control Product',
      desc: 'Explore our professional range of Low Voltage Control Products, designed to enable maximum safety and efficiency in your electrical systems. Our MCCBs provide outstanding protection for low-voltage systems by safeguarding against damage due to overload and short circuits.',
      image: '/assets/images/switchgear_control_3d.png',
      specs: {
        'Device Type': 'Contactors, Relays, MPCBs, and MCCBs',
        'Operating Voltage': 'Up to 690 V AC',
        'Mechanical Life': 'Up to 10 Million operations',
        'Coil Types': 'Wide range AC/DC operating coils',
        'Application': 'Motor control centers (MCC), process automation boards'
      }
    },
    {
      id: 'mcb',
      title: 'MCB',
      desc: 'Our MCBs offer reliable circuit protection, adhering to high standards for performance and safety. Designed for various voltage systems, they feature ISI marking, multiple pole options, and high breaking capacity. These MCBs are also RoHS compliant, ensuring they meet environmental and safety regulations.',
      image: '/assets/images/switchgear_mcb_3d.png',
      specs: {
        'Poles': 'SP, DP, TP, FP (1P, 2P, 3P, 4P)',
        'Trip Curves': 'B, C, and D curves',
        'Rated Current': '0.5 A to 125 A',
        'Breaking Capacity': 'Up to 15 kA',
        'Standards': 'IS/IEC 60898-1 certified, CE & RoHS marked'
      }
    },
    {
      id: 'sinova',
      title: 'Sinova',
      desc: 'The electrical protection solutions from Sinova include MCCBs with rated currents from 16A to 630A, ACBs for industrial applications up to 4000A, Load Break Switches for manual circuit switching, accurate Control Switches, Energy Management Systems for effective usage, and Fuses for overcurrent protection in various areas.',
      image: '/assets/images/switchgear_sinova_3d.png',
      specs: {
        'Brand Line': 'Siemens Partnered Sinova range',
        'MCCB Rating': '16 A to 630 A',
        'ACB Rating': 'Up to 4000 A',
        'Trip Units': 'Thermal-magnetic & electronic options',
        'Application': 'Cost-effective commercial & factory electrical distribution'
      }
    }
  ];

  const MOTOR_SUB_PRODUCTS = [
    {
      id: 'siemens-motor',
      title: 'Siemens Motor',
      desc: 'Transpower Technologies Pvt. Ltd. offers Siemens motors featuring high protection degrees, robust cast iron housing, and efficient cooling. Designed for various industrial applications, they meet international standards, ensuring reliable performance and energy efficiency. Available with multiple mounting options, these motors are perfect for demanding environments.',
      image: '/assets/images/motor_siemens_3d.png',
      buttonLabel: 'Download Brochure',
      downloadUrl: '/assets/siemens_innomotics_motors.pdf',
      specs: {
        'Frame Size': '56 to 450',
        'Output Rating': '0.09 kW to 1000 kW',
        'Efficiency Class': 'IE2, IE3, IE4 Premium Efficiency',
        'Protection Degree': 'IP55 / IP56 / IP65',
        'Mounting': 'Foot (B3), Flange (B5), Face (B14)'
      }
    },
    {
      id: 'crompton-motor',
      title: 'Crompton Greaves Motor',
      desc: 'Transpower Technologies Pvt. Ltd. provides Crompton motors, featuring strong cast iron housing and high degrees of protection. Designed for industrial applications, they offer reliable performance with efficient cooling. Compliant with global standards, these motors come with various mounting options and ensure energy-efficient operation for diverse needs.',
      image: '/assets/images/motor_crompton_3d.jpg',
      buttonLabel: 'Download Brochure',
      downloadUrl: '/assets/crompton_motors.pdf',
      specs: {
        'Frame Size': '63 to 355',
        'Output Rating': '0.18 kW to 315 kW',
        'Efficiency Class': 'IE2 & IE3 Rated',
        'Enclosure': 'Totally Enclosed Fan Cooled (TEFC)',
        'Applicable Standards': 'IS 12615, IEC 60034-30'
      }
    },
    {
      id: 'hindustan-motor',
      title: 'Hindustan Electric Motor',
      desc: 'HEM motors from Transpower Technologies Pvt. Ltd. are known for their durability and high protection levels. With a cast iron housing and efficient cooling method, these motors are ideal for industrial use. They comply with international standards and offer versatile mounting options for enhanced flexibility and performance.',
      image: '/assets/images/motor_hindustan_3d.png',
      buttonLabel: 'Download Brochure',
      downloadUrl: '/assets/hindustan_motors.pdf',
      specs: {
        'Frame Size': '63 to 400',
        'Output Rating': '0.12 kW to 315 kW',
        'Body Material': 'Rugged Grade FG200 Cast Iron',
        'Duty Cycle': 'S1 Continuous Duty',
        'Insulation Class': 'Class F with Class B temperature rise'
      }
    }
  ];

  // Specifications and details for each gearbox sub-product
  const GEARBOX_SUB_PRODUCTS = [
    {
      id: 'rotomotive-gearbox',
      title: 'Gear Box',
      desc: "Transpower Technologies Pvt. Ltd. provides high-quality gearboxes from Rotomotive, featuring the helical ROBUS series and the worm QUBO series. The ROBUS series, made from cast iron, boasts a capacity of up to 4300Nm and includes synthetic oil for long-lasting performance. These gearboxes are designed with a rigid, monobloc body, base, and flange, ensuring extreme durability and a modular design with a detachable output flange for versatile use. The QUBO series, available in sizes 25 to 150, combines die-cast aluminium and cast iron construction. The QUBO gearboxes are maintenance-free for sizes 30 to 90, using synthetic oil, while sizes 110 to 150 use mineral oil. Both series offer flexible mounting options, making them suitable for various industrial applications.",
      image: '/assets/images/gearbox_rotomotive_3d.jpg',
      buttonLabel: 'Download Brochure',
      specs: {
        'Series / Models': 'Helical ROBUS series, Worm QUBO series',
        'Torque Capacity': 'Up to 4300 Nm (ROBUS series)',
        'QUBO Sizes': 'Sizes 25 to 150 (Maintenance-free sizes 30 to 90)',
        'Construction': 'Monobloc Cast Iron housing & Die-cast Aluminium configurations',
        'Lubrication': 'Synthetic oil (ROBUS & QUBO 30-90) / Mineral oil (QUBO 110-150)',
        'Mounting': 'Flexible foot, shaft, and detachable output flange options'
      }
    }
  ];

  if (productKey === 'gear-boxes') {
    return (
      <>
        <SEO 
          title="Industrial Gear Boxes - Helical ROBUS & Worm QUBO Series" 
          description="Heavy-duty industrial gearboxes from Rotomotive. Helical ROBUS cast iron gearboxes and Worm QUBO series." 
          keywords="Gear Boxes, industrial gearboxes, Rotomotive, ROBUS series, QUBO series, B2B gearboxes Vadodara"
        />

        {/* Top Dark Header */}
        <div style={{ background: '#2c2d30', padding: '3.5rem 1.5rem', marginTop: '4.8rem' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ color: '#ffffff', fontSize: '2.2rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>Industrial Gear Boxes</h1>
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {GEARBOX_SUB_PRODUCTS.map((prod, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={prod.id} 
                className="gearbox-product-row"
                style={{ 
                  display: 'flex', 
                  flexDirection: isEven ? 'row' : 'row-reverse', 
                  alignItems: 'center', 
                  gap: '4rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Description Column */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {prod.title}
                  </h2>
                  <p style={{ fontSize: '0.94rem', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
                    {prod.desc}
                  </p>
                  <div>
                    {prod.buttonLabel === 'Download Brochure' ? (
                      <a 
                        href="/assets/rotomotive_qubo_gearboxes.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="btn btn-primary"
                        style={{ 
                          background: 'var(--accent-orange)', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '0.75rem 1.8rem', 
                          borderRadius: '6px', 
                          fontWeight: '700',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(217, 101, 59, 0.2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          textDecoration: 'none'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange-deep)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange)'}
                      >
                        <span style={{ fontSize: '1rem' }}>📥</span>
                        {prod.buttonLabel}
                      </a>
                    ) : (
                      <button 
                        onClick={() => setSelectedProduct(prod)}
                        className="btn btn-primary"
                        style={{ 
                          background: 'var(--accent-orange)', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '0.75rem 1.8rem', 
                          borderRadius: '6px', 
                          fontWeight: '700',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(217, 101, 59, 0.2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange-deep)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange)'}
                      >
                        {prod.buttonLabel || 'Click for More Details'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Showcase Column */}
                <div style={{ 
                  flex: '1 1 300px', 
                  display: 'flex', 
                  justifyContent: 'center',
                  background: '#f8fafc', 
                  border: '1px solid var(--border)', 
                  borderRadius: '16px', 
                  padding: '2.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Overlay */}
        {selectedProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '1.2rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {selectedProduct.title}
                </h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem'
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--accent-orange)', fontWeight: '800', textTransform: 'uppercase' }}>Product Specifications</h4>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {Object.entries(selectedProduct.specs).map(([label, val], idx) => (
                      <div 
                        key={label} 
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '150px 1fr', 
                          padding: '0.75rem 1rem',
                          background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                          borderBottom: idx < Object.entries(selectedProduct.specs).length - 1 ? '1px solid var(--border)' : 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(217, 101, 59, 0.05)', border: '1px solid rgba(217, 101, 59, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: 'var(--accent-orange-deep)', fontWeight: '800' }}>B2B Specification Inquiry</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Need a custom quote, technical datasheet, or drawing configuration for this product?
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      const contactForm = document.getElementById('inquiry-form') || document.getElementById('contact') || document.querySelector('footer');
                      if (contactForm) {
                        contactForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    Request Technical Specification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Specifications and details for each cable tray sub-product
  const CABLETRAY_SUB_PRODUCTS = [
    {
      id: 'ladder-tray',
      title: 'Ladder Type Cable Tray',
      desc: "Ladder-type cable trays are a robust and versatile solution for organizing and protecting cables in industrial and commercial settings. Designed with a rugged, ladder-like structure, these trays provide excellent support and stability for heavy cable loads, while also allowing for easy installation, modification and maintenance. Ideal for power distribution, communication and data transmission applications, ladder-type cable trays are a reliable choice for efficient cable management systems.",
      image: '/assets/images/cabletray_ladder_3d.jpg',
      specs: {
        'Tray Type': 'Ladder Type Cable Management',
        'Rung Spacing': '150mm / 250mm / 300mm',
        'Resin Grades': 'Vinyl Ester (high chemical resistance) / Isophthalic Polyester',
        'Side Rail Height': '50mm, 75mm, 100mm, 150mm',
        'Key Properties': 'Excellent heat dissipation, B2B heavy load capacity, UV-stabilized'
      }
    },
    {
      id: 'perforated-tray',
      title: 'Perforated Cable Tray',
      desc: "Perforated cable trays offer a lightweight, versatile and cost-effective solution for cable management. Featuring precision-punched holes for easy cable tie access and optimal airflow, these trays provide excellent ventilation, reducing heat buildup and moisture accumulation. Ideal for telecommunications, data centers and commercial applications, perforated cable trays combine strength, durability and aesthetic appeal, making them a popular choice for efficient cable routing and organization.",
      image: '/assets/images/cabletray_perforated_3d.jpg',
      specs: {
        'Tray Type': 'Perforated Trough/Channel Type',
        'Ventilation Holes': 'Precision-punched air flow patterns',
        'Material Thickness': '1.5mm to 3mm composite thickness',
        'Standard Width': '50mm to 1000mm options',
        'Key Applications': 'Data centers, telecommunication runs, instrument control cable routing'
      }
    }
  ];

  if (productKey === 'cable-trays') {
    return (
      <>
        <SEO 
          title="FRP Cable Trays - Ladder & Perforated Channel Trays" 
          description="High-performance fiberglass reinforced plastic (FRP/GRP) cable trays. Non-conductive, chemical resistant ladder and perforated trough trays." 
          keywords="FRP Cable Trays, ladder cable tray, perforated cable tray, GRP cable tray, B2B cable routing Vadodara"
        />

        {/* Top Dark Header */}
        <div style={{ background: '#2c2d30', padding: '3.5rem 1.5rem', marginTop: '4.8rem' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ color: '#ffffff', fontSize: '2.2rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>FRP Cable Trays</h1>
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {CABLETRAY_SUB_PRODUCTS.map((prod, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={prod.id} 
                className="cabletray-product-row"
                style={{ 
                  display: 'flex', 
                  flexDirection: isEven ? 'row' : 'row-reverse', 
                  alignItems: 'center', 
                  gap: '4rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Description Column */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {prod.title}
                  </h2>
                  <p style={{ fontSize: '0.94rem', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
                    {prod.desc}
                  </p>
                  <div>
                    <button 
                      onClick={() => setSelectedProduct(prod)}
                      className="btn btn-primary"
                      style={{ 
                        background: 'var(--accent-orange)', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '0.75rem 1.8rem', 
                        borderRadius: '6px', 
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 4px rgba(217, 101, 59, 0.2)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange-deep)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange)'}
                    >
                      Click for More Details
                    </button>
                  </div>
                </div>

                {/* Image Showcase Column */}
                <div style={{ 
                  flex: '1 1 300px', 
                  display: 'flex', 
                  justifyContent: 'center',
                  background: '#f8fafc', 
                  border: '1px solid var(--border)', 
                  borderRadius: '16px', 
                  padding: '2.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Overlay */}
        {selectedProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '1.2rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {selectedProduct.title}
                </h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem'
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--accent-orange)', fontWeight: '800', textTransform: 'uppercase' }}>Product Specifications</h4>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {Object.entries(selectedProduct.specs).map(([label, val], idx) => (
                      <div 
                        key={label} 
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '150px 1fr', 
                          padding: '0.75rem 1rem',
                          background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                          borderBottom: idx < Object.entries(selectedProduct.specs).length - 1 ? '1px solid var(--border)' : 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(217, 101, 59, 0.05)', border: '1px solid rgba(217, 101, 59, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: 'var(--accent-orange-deep)', fontWeight: '800' }}>B2B Specification Inquiry</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Need a custom quote, technical datasheet, or drawing configuration for this product?
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      const contactForm = document.getElementById('inquiry-form') || document.getElementById('contact') || document.querySelector('footer');
                      if (contactForm) {
                        contactForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    Request Technical Specification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Specifications and details for each grating sub-product
  const GRATING_SUB_PRODUCTS = [
    {
      id: 'meniscus-top',
      title: 'Meniscus Top',
      desc: "Transpower Technologies Pvt. Ltd. offers a range of products designed for durability and safety. Transpower's Meniscus Top FRP Gratings provide a slip-resistant surface ideal for wet and oily conditions. Corrosion-free, low-maintenance, and lightweight, these Fiber Reinforced Plastic gratings offer long-lasting performance for industrial walkways, platforms, and drainage systems. Built to resist tough conditions, they're the intelligent choice for high-demand workspaces.",
      image: '/assets/images/grating_meniscus_3d.jpg',
      specs: {
        'Surface Finish': 'Concave Meniscus Slip-Resistant Top',
        'Standard Mesh Size': '38x38mm / 50x50mm / 40x40mm',
        'Resin Options': 'Isophthalic Polyester, Vinyl Ester, Phenolic',
        'Thickness': '25mm, 30mm, 38mm, 50mm',
        'Certifications': 'ASTM E84 Class 1 Flame Retardant, ISO 9001:2015'
      }
    },
    {
      id: 'grit-top',
      title: 'Grit Top',
      desc: "Transpower Technologies Pvt. Ltd. offers Grit Top FRP Gratings provide ultimate traction in addition to strength and offer a coarse finish for surface texture. Suitable for areas with high traffic and dangerous areas, the chemical, corrosion, and impact-resistant FRP gratings are ideal for factories, refineries, and marine platforms. Transpower's ruggedly designed FRP gratings ensure long-term performance and safety for workers.",
      image: '/assets/images/grating_grit_3d.jpg',
      specs: {
        'Surface Finish': 'Quartz Grit Embedded Textured Surface',
        'Slip Resistance Rating': 'R13 Class (DIN 51130)',
        'Resin Grades': 'Chemical resistant Vinyl Ester / General purpose Isophthalic',
        'Loading Capacity': 'High strength bi-directional load distribution',
        'Color Options': 'Yellow, Orange, Dark Gray, Green'
      }
    },
    {
      id: 'chequered-plate',
      title: 'Chequered Plate',
      desc: "Transpower Technologies Pvt. Ltd. offers a range of Chequered Plate FRP Gratings, offering a solid surface topped with the durability of Fiber Reinforced Plastic, perfect for applications requiring full surface coverage. Tough, non-corrosive, and impact-resistant, they're ideal for access platforms and loading zones. A solid option when there's debris or tools to be held back.",
      image: '/assets/images/grating_chequered_3d.jpg',
      specs: {
        'Surface Finish': 'Solid Flat Top with Diamond Tread Chequered Pattern',
        'Structure': 'Solid laminated FRP sheet bonded on core grid grating',
        'Odour/Gas Seal': 'Excellent containment of gas/vapours in drainage channels',
        'Impact Resistance': 'Heavy-duty load bearing, zero denting',
        'Key Applications': 'Walkway covers, trench covers, inspection hatches'
      }
    }
  ];

  if (productKey === 'molded-gratings') {
    return (
      <>
        <SEO 
          title="Molded FRP Gratings - Meniscus, Grit & Chequered Plates" 
          description="High-strength composite Molded GRP/FRP Gratings. Meniscus, quartz grit top, and solid chequered plate walkways for chemical plants and offshore platforms." 
          keywords="FRP Gratings, molded grating, GRP grating, meniscus top, grit top, chequered plate, trench cover, composite walkway"
        />

        {/* Top Dark Header */}
        <div style={{ background: '#2c2d30', padding: '3.5rem 1.5rem', marginTop: '4.8rem' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ color: '#ffffff', fontSize: '2.2rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>Molded FRP Gratings</h1>
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {GRATING_SUB_PRODUCTS.map((prod, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={prod.id} 
                className="grating-product-row"
                style={{ 
                  display: 'flex', 
                  flexDirection: isEven ? 'row' : 'row-reverse', 
                  alignItems: 'center', 
                  gap: '4rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Description Column */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {prod.title}
                  </h2>
                  <p style={{ fontSize: '0.94rem', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
                    {prod.desc}
                  </p>
                  <div>
                    <button 
                      onClick={() => setSelectedProduct(prod)}
                      className="btn btn-primary"
                      style={{ 
                        background: 'var(--accent-orange)', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '0.75rem 1.8rem', 
                        borderRadius: '6px', 
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 4px rgba(217, 101, 59, 0.2)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange-deep)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange)'}
                    >
                      Click for More Details
                    </button>
                  </div>
                </div>

                {/* Image Showcase Column */}
                <div style={{ 
                  flex: '1 1 300px', 
                  display: 'flex', 
                  justifyContent: 'center',
                  background: '#f8fafc', 
                  border: '1px solid var(--border)', 
                  borderRadius: '16px', 
                  padding: '2.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Overlay */}
        {selectedProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '1.2rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {selectedProduct.title}
                </h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem'
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--accent-orange)', fontWeight: '800', textTransform: 'uppercase' }}>Product Specifications</h4>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {Object.entries(selectedProduct.specs).map(([label, val], idx) => (
                      <div 
                        key={label} 
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '150px 1fr', 
                          padding: '0.75rem 1rem',
                          background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                          borderBottom: idx < Object.entries(selectedProduct.specs).length - 1 ? '1px solid var(--border)' : 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(217, 101, 59, 0.05)', border: '1px solid rgba(217, 101, 59, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: 'var(--accent-orange-deep)', fontWeight: '800' }}>B2B Specification Inquiry</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Need a custom quote, technical datasheet, or drawing configuration for this product?
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      const contactForm = document.getElementById('inquiry-form') || document.getElementById('contact') || document.querySelector('footer');
                      if (contactForm) {
                        contactForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    Request Technical Specification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (productKey === 'electric-motors') {
    return (
      <>
        <SEO 
          title="Industrial Electric Motors - Siemens, Crompton Greaves & HEM" 
          description="Premium heavy-duty industrial electric motors including Siemens, Crompton Greaves and Hindustan Electric Motors (HEM)." 
          keywords="Electric Motors, Siemens motors, Crompton Greaves, Hindustan Electric Motors, HEM, B2B motors Vadodara"
        />

        {/* Top Dark Header */}
        <div style={{ background: '#2c2d30', padding: '3.5rem 1.5rem', marginTop: '4.8rem' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ color: '#ffffff', fontSize: '2.2rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>Electric Motors</h1>
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {MOTOR_SUB_PRODUCTS.map((prod, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={prod.id} 
                className="motor-product-row"
                style={{ 
                  display: 'flex', 
                  flexDirection: isEven ? 'row' : 'row-reverse', 
                  alignItems: 'center', 
                  gap: '4rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Description Column */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {prod.title}
                  </h2>
                  <p style={{ fontSize: '0.94rem', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
                    {prod.desc}
                  </p>
                  <div>
                    {prod.buttonLabel === 'Download Brochure' ? (
                      <a 
                        href={prod.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="btn btn-primary"
                        style={{ 
                          background: 'var(--accent-orange)', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '0.75rem 1.8rem', 
                          borderRadius: '6px', 
                          fontWeight: '700',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(217, 101, 59, 0.2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          textDecoration: 'none'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange-deep)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange)'}
                      >
                        <span style={{ fontSize: '1rem' }}>📥</span>
                        {prod.buttonLabel}
                      </a>
                    ) : (
                      <button 
                        onClick={() => setSelectedProduct(prod)}
                        className="btn btn-primary"
                        style={{ 
                          background: 'var(--accent-orange)', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '0.75rem 1.8rem', 
                          borderRadius: '6px', 
                          fontWeight: '700',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(217, 101, 59, 0.2)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange-deep)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange)'}
                      >
                        {prod.buttonLabel || 'Click for More Details'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Showcase Column */}
                <div style={{ 
                  flex: '1 1 300px', 
                  display: 'flex', 
                  justifyContent: 'center',
                  background: '#f8fafc', 
                  border: '1px solid var(--border)', 
                  borderRadius: '16px', 
                  padding: '2.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Overlay */}
        {selectedProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '1.2rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {selectedProduct.title}
                </h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem'
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--accent-orange)', fontWeight: '800', textTransform: 'uppercase' }}>Product Specifications</h4>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {Object.entries(selectedProduct.specs).map(([label, val], idx) => (
                      <div 
                        key={label} 
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '150px 1fr', 
                          padding: '0.75rem 1rem',
                          background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                          borderBottom: idx < Object.entries(selectedProduct.specs).length - 1 ? '1px solid var(--border)' : 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(217, 101, 59, 0.05)', border: '1px solid rgba(217, 101, 59, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: 'var(--accent-orange-deep)', fontWeight: '800' }}>B2B Specification Inquiry</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Need a custom quote, technical datasheet, or drawing configuration for this product?
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      const contactForm = document.getElementById('inquiry-form') || document.getElementById('contact') || document.querySelector('footer');
                      if (contactForm) {
                        contactForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    Request Technical Specification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (productKey === 'switchgears') {
    return (
      <>
        <SEO 
          title="Industrial Switchgears - Low Voltage Distribution & Control" 
          description="High-performance low voltage distribution switchgears, circuit breakers, contactors, MCBs and Sinova B2B electrical protection solutions." 
          keywords="Switchgears, low voltage power distribution, contactors, MCB, Sinova, circuit breakers, B2B electric panels"
        />

        {/* Top Dark Header */}
        <div style={{ background: '#2c2d30', padding: '3.5rem 1.5rem', marginTop: '4.8rem' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ color: '#ffffff', fontSize: '2.2rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>Switchgears</h1>
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {SWITCHGEAR_SUB_PRODUCTS.map((prod, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={prod.id} 
                className="switchgear-product-row"
                style={{ 
                  display: 'flex', 
                  flexDirection: isEven ? 'row' : 'row-reverse', 
                  alignItems: 'center', 
                  gap: '4rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Description Column */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {prod.title}
                  </h2>
                  <p style={{ fontSize: '0.94rem', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
                    {prod.desc}
                  </p>
                  <div>
                    <button 
                      onClick={() => setSelectedProduct(prod)}
                      className="btn btn-primary"
                      style={{ 
                        background: 'var(--accent-orange)', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '0.75rem 1.8rem', 
                        borderRadius: '6px', 
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 4px rgba(217, 101, 59, 0.2)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange-deep)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange)'}
                    >
                      Click for More Details
                    </button>
                  </div>
                </div>

                {/* Image Showcase Column */}
                <div style={{ 
                  flex: '1 1 300px', 
                  display: 'flex', 
                  justifyContent: 'center',
                  background: '#f8fafc', 
                  border: '1px solid var(--border)', 
                  borderRadius: '16px', 
                  padding: '2.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Overlay */}
        {selectedProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '1.2rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {selectedProduct.title}
                </h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem'
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--accent-orange)', fontWeight: '800', textTransform: 'uppercase' }}>Product Specifications</h4>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {Object.entries(selectedProduct.specs).map(([label, val], idx) => (
                      <div 
                        key={label} 
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '150px 1fr', 
                          padding: '0.75rem 1rem',
                          background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                          borderBottom: idx < Object.entries(selectedProduct.specs).length - 1 ? '1px solid var(--border)' : 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(217, 101, 59, 0.05)', border: '1px solid rgba(217, 101, 59, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: 'var(--accent-orange-deep)', fontWeight: '800' }}>B2B Specification Inquiry</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Need a custom quote, technical datasheet, or drawing configuration for this product?
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      const contactForm = document.getElementById('inquiry-form') || document.getElementById('contact') || document.querySelector('footer');
                      if (contactForm) {
                        contactForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    Request Technical Specification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${data.title} - Transpower Catalog`} 
        description={data.detailsText} 
        keywords={`${data.title}, transpower product, industrial composites`}
      />

      <div className="product-page-container container" style={{ padding: '6rem 1.5rem 4rem', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', marginTop: '2.5rem' }}>
        
        {/* Left Side: Product Showcase & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Far Left Vertical Feature Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 101, 59, 0.08)', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>🧪</span>
                <span data-edit-page={pageKey} data-edit-key="feature1" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.feature1}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 101, 59, 0.08)', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>⚡</span>
                <span data-edit-page={pageKey} data-edit-key="feature2" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.feature2}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 101, 59, 0.08)', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>⚖️</span>
                <span data-edit-page={pageKey} data-edit-key="feature3" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.feature3}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 101, 59, 0.08)', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>🔥</span>
                <span data-edit-page={pageKey} data-edit-key="feature4" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.feature4}</span>
              </div>
            </div>

            {/* Central Product Showcase Image */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
              <img 
                data-edit-page={pageKey}
                data-edit-key="productImage"
                src={getFullImageUrl(data.productImage)} 
                alt="Product" 
                fetchpriority="high"
                decoding="async"
                style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain' }} 
              />
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '95px' }}>
            <div style={{ width: '70px', height: '70px', border: '2px solid var(--accent-orange)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: '4px', background: '#fff' }}>
              <img src={getFullImageUrl(data.productImage)} alt="Thumb 1" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ width: '70px', height: '70px', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: '4px', background: '#fff' }}>
              <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=150&q=80" alt="Thumb 2" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ width: '70px', height: '70px', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: '4px', background: '#fff' }}>
              <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80" alt="Thumb 3" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Benefit Badge Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginLeft: '95px', marginTop: '1rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.6rem 0.3rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🛡️ <span data-edit-page={pageKey} data-edit-key="benefit1">{data.benefit1}</span>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.6rem 0.3rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ⚙️ <span data-edit-page={pageKey} data-edit-key="benefit2">{data.benefit2}</span>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.6rem 0.3rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🔋 <span data-edit-page={pageKey} data-edit-key="benefit3">{data.benefit3}</span>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.6rem 0.3rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🔧 <span data-edit-page={pageKey} data-edit-key="benefit4">{data.benefit4}</span>
            </div>
          </div>

        </div>

        {/* Right Side: Product Details & Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Breadcrumb / categories */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span data-edit-page={pageKey} data-edit-key="category" style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-orange)' }}>{data.category}</span>
            <span style={{ color: 'var(--border-strong)' }}>/</span>
            <span data-edit-page={pageKey} data-edit-key="badge" style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{data.badge}</span>
          </div>

          <h1 data-edit-page={pageKey} data-edit-key="title" style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: 1.1 }}>
            {data.title}
          </h1>

          {/* Quote-only business — no pricing is shown anywhere on the site. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--accent-orange-tint)', padding: '0.8rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(217, 101, 59, 0.2)', width: 'fit-content' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-orange-deep)' }}>Price on Request</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>— quoted to your span &amp; load spec</span>
          </div>

          {/* Dynamic Details Tabs */}
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
            
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '80px', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {activeTabState === 'details' && <p data-edit-page={pageKey} data-edit-key="detailsText">{data.detailsText}</p>}
              {activeTabState === 'benefits' && <p data-edit-page={pageKey} data-edit-key="benefitsText">{data.benefitsText}</p>}
              {activeTabState === 'use' && <p data-edit-page={pageKey} data-edit-key="useText">{data.useText}</p>}
            </div>
          </div>

          {/* B2B Quote Action Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Request a custom quotation tailored to your span, load, and service duty specifications. Our technical sales team will provide a formal commercial proposal.
            </p>
            <button 
              type="button" 
              onClick={() => {
                const contactForm = document.getElementById('inquiry-form') || document.getElementById('contact') || document.querySelector('footer');
                if (contactForm) {
                  contactForm.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Request a Quotation
            </button>
          </div>

        </div>

      </div>
    </>
  );
}

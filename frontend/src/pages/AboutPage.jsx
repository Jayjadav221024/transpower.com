import { useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
import { publicApi } from '../api/client';
import '../styles/about.css';

const TIMELINE = [
  { year: '1998', name: 'Desai Brothers', desc: 'Acquired Desai Brothers and Company.' },
  { year: '2005', name: 'Transpower Tech', desc: 'Renamed to Transpower Technologies Pvt Ltd.' },
  { year: '2008', name: 'Yash High Voltage', desc: 'Acquired Yash High Voltage.' },
  { year: '2010', name: 'Kaival Poultry', desc: 'Launched Livebird and ventured into farming.' },
  { year: '2012', name: 'Apidel Tech', desc: 'Established Apidel Technologies.' },
  { year: '2013', name: 'ShreeRaj Traders', desc: 'Acquired ShreeRaj Traders.' },
  { year: '2017', name: 'Techno Sales', desc: 'Acquired Techno Sales Agency.' },
  { year: '2018', name: 'Transpower Composites', desc: 'Expanded into the FRP composites industry.' },
];

const BRANDS = [
  { name: 'INNOMOTICS', logo: 'I' },
  { name: 'HINDUSTAN ELECTRIC MOTORS', logo: 'H' },
  { name: 'ROTOMOTIVE', logo: 'R' },
  { name: 'CROMPTON GREAVES', logo: 'C' },
];

const DEFAULT_ABOUT = {
  aboutText: 'Transpower is a globally leading group and one of the prominent names in Electro-Mechanical Industry. With over six decades of presence, Transpower has achieved consistent growth and built a reputable clientele. The company\'s unwavering commitment to learning, leadership, and innovation has secured its strong position in the Electro-Mechanical industry.',
  phone: '+91 98255 07517 / 37',
  emails: [
    'baroda@transpower.net.in',
    'sales@transpower.com',
    'frp@transpower.net.in'
  ],
  address: '346 GIDC, Makarpura, Vadodara - 390010, Gujarat (India)',
  groupCompanies: [
    { name: 'APIDEL', desc: 'Value Delivered' },
    { name: 'SHREE RAJ', desc: 'Transpower Group of Companies' },
    { name: 'TECHNO', desc: 'Techno Sales Agency' },
    { name: 'TRANSPOWER Exports', desc: 'International Trade Division' }
  ],
  leaderImg1: '/assets/images/hemant_patel.png',
  leaderName1: 'Mr. Hemant Patel',
  leaderRole1: 'Director',
  leaderQuote1: '"Transpower\'s success is rooted in our unwavering commitment to excellence, innovation and customer satisfaction. With a dedicated workforce and cutting-edge technology, we continue to lead the Electro-Mechanical industry globally. Our goal is to provide an exceptional experience for our customers, ensuring joy and satisfaction in every interaction."',
  leaderImg2: '/assets/images/kiran_parekh.png',
  leaderName2: 'Mr. Kiran Parekh',
  leaderRole2: 'General Manager',
  leaderQuote2: '"As a General Manager, I am honored to lead a professional team that is dedicated to the company\'s vision & mission. Our commitment to excellence drives everything we do, from delivering outstanding products and services to providing exceptional customer support. We believe in fostering a culture of integrity, teamwork, innovation & excellence within our organization."'
};

export default function AboutPage() {
  const [data, setData] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    publicApi.getPageContent('aboutpage')
      .then(res => {
        if (res && res.content) {
          setData(prev => ({ ...prev, ...res.content }));
        }
      })
      .catch(() => {
        // Quietly fail and keep default layout content
      });
  }, []);

  return (
    <>
      <SEO 
        title="About Us | Transpower Technologies" 
        description="Transpower is a globally leading group and one of the prominent names in Electro-Mechanical Industry with a presence of over six decades." 
        keywords="about Transpower, electro-mechanical group, FRP composites, Hemant Patel director, Kiran Parekh GM, Siemens Champions Club"
      />

      {/* ── About Us Hero Section ── */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Us</h1>
          <p data-edit-page="aboutpage" data-edit-key="aboutText">{data.aboutText}</p>
        </div>
      </section>

      {/* ── Director & GM Messages ── */}
      <section className="leadership-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '4rem' }}>
            <div className="badge-tag">Management Messages</div>
            <h2 className="section-title">Words from Our Leaders</h2>
          </div>

          <div className="leadership-grid">
            {/* Words from Director */}
            <div className="leadership-card">
              <img 
                data-edit-page="aboutpage"
                data-edit-key="leaderImg1"
                src={data.leaderImg1 || '/assets/images/hemant_patel.png'} 
                alt={data.leaderName1} 
                className="leader-photo"
              />
              <div className="leader-info">
                <h3 data-edit-page="aboutpage" data-edit-key="leaderName1">{data.leaderName1}</h3>
                <span data-edit-page="aboutpage" data-edit-key="leaderRole1" className="role">{data.leaderRole1}</span>
              </div>
              <p data-edit-page="aboutpage" data-edit-key="leaderQuote1" className="leader-quote">
                {data.leaderQuote1}
              </p>
            </div>

            {/* General Manager */}
            <div className="leadership-card">
              <img 
                data-edit-page="aboutpage"
                data-edit-key="leaderImg2"
                src={data.leaderImg2 || '/assets/images/kiran_parekh.png'} 
                alt={data.leaderName2} 
                className="leader-photo"
              />
              <div className="leader-info">
                <h3 data-edit-page="aboutpage" data-edit-key="leaderName2">{data.leaderName2}</h3>
                <span data-edit-page="aboutpage" data-edit-key="leaderRole2" className="role">{data.leaderRole2}</span>
              </div>
              <p data-edit-page="aboutpage" data-edit-key="leaderQuote2" className="leader-quote">
                {data.leaderQuote2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Development Timeline ── */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
            <div className="badge-tag">Milestones</div>
            <h2 className="section-title">Company Development Timeline</h2>
          </div>

          <div className="timeline-grid">
            {TIMELINE.map((item) => (
              <div className="timeline-card" key={item.year}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-logo-name">{item.name}</div>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Group Companies Section (Dynamically Loaded) ── */}
      <section className="timeline-section" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
            <div className="badge-tag">Group Profile</div>
            <h2 className="section-title">Our Group of Companies</h2>
          </div>

          <div className="timeline-grid">
            {(data.groupCompanies || []).map((comp) => (
              <div className="timeline-card" key={comp.name} style={{ textAlign: 'center', background: 'var(--bg-card)' }}>
                <div className="timeline-year" style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>
                  {comp.name}
                </div>
                <p className="timeline-desc" style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                  {comp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Achievements Section ── */}
      <section className="achievements-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '4rem' }}>
            <div className="badge-tag">Recognition</div>
            <h2 className="section-title">Our Achievements</h2>
          </div>

          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🏆</div>
              <h3>Siemens Champions Club</h3>
              <p>Awarded to Transpower Technologies Pvt. Ltd. in 2019 for technical innovation and sales leadership.</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🤝</div>
              <h3>Outstanding Performance</h3>
              <p>Recognized for consistently delivering high-quality low-voltage electrical engineering projects.</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🏅</div>
              <h3>50 Years of Partnership</h3>
              <p>Celebrating over five decades of successful, trusted distribution and engineering relationship with Siemens.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Authorized Brands ── */}
      <section className="brands-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3.5rem' }}>
            <div className="badge-tag">Partner Ecosystem</div>
            <h2 className="section-title">Authorized Brands</h2>
          </div>

          <div className="brands-grid">
            {BRANDS.map((brand) => (
              <div className="brand-card" key={brand.name}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-orange)' }}>BRAND PARTNER</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '0.02em', color: 'var(--text-main)' }}>{brand.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonial-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3.5rem' }}>
            <div className="badge-tag">Testimonial</div>
            <h2 className="section-title">Our Happy Customer's</h2>
          </div>

          <div className="testimonial-container">
            <div className="quote-bubble">
              <p>
                "Transpower Technologies has been our reliable partner for sourcing Crompton Greaves induction motors. Their responsiveness to our queries and prompt delivery of products have helped us meet our project deadlines without any hassle."
              </p>
              <div className="quote-author">
                - Rakesh Gaveriya <br />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Mech Tech Machine Pvt Ltd</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

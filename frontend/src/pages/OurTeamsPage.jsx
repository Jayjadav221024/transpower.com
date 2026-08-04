import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { DEPARTMENTS } from '../data/company';

// Board of Management listing (11 people)
const BOARD_MEMBERS = [
  { name: 'Viral Shah', designation: 'Switchgear Department Head', email: 'viral@transpower.net.in' },
  { name: 'Dhara Panchal', designation: 'Motors Division Head', email: 'dhara@transpower.net.in' },
  { name: 'Rajesh Dutta', designation: 'FRP Products Division Head', email: 'frp@transpower.net.in' },
  { name: 'Urjit Naik', designation: 'General Industrial Sales Head', email: 'sales@transpower.net.in' },
  { name: 'Saji Varghese', designation: 'Motors Technical Specialist', email: 'dhara@transpower.net.in' },
  { name: 'Jagruti Panchal', designation: 'Switchgear Support Coordinator', email: 'viral@transpower.net.in' },
  { name: 'Divya Patel', designation: 'Management Board Member', email: 'baroda@transpower.net.in' },
  { name: 'Anand Umraniya', designation: 'Management Board Member', email: 'baroda@transpower.net.in' },
  { name: 'Ashishkumar Kushvaha', designation: 'Management Board Member', email: 'baroda@transpower.net.in' },
  { name: 'Jaykumar Trivedi', designation: 'Management Board Member', email: 'baroda@transpower.net.in' },
  { name: 'Sanjay Dhobi', designation: 'Management Board Member', email: 'baroda@transpower.net.in' },
];

export default function OurTeamsPage() {
  return (
    <>
      <SEO 
        title="Our Teams" 
        description="Meet the Board of Management and leadership team behind Transpower Technologies Pvt. Ltd. in Vadodara, Gujarat."
        keywords="Transpower team, Board of management, Viral Shah, Dhara Panchal, Rajesh Dutta, Urjit Naik, careers, hr@transpower.com"
      />

      {/* Hero Header */}
      <section className="locations-hero" style={{ padding: 'clamp(5.5rem, 13vw, 8rem) 0 clamp(2.5rem, 6vw, 4rem)', textAlign: 'center', background: '#090e18', color: '#fff' }}>
        <div className="container">
          <nav className="city-breadcrumb" aria-label="Breadcrumb" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#475569' }}>/</span>
            <span style={{ color: '#f8fafc' }}>Our Teams</span>
          </nav>
          <span className="badge-tag" style={{ display: 'inline-block', background: 'rgba(225, 89, 11, 0.15)', color: '#ff7a29', padding: '4px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 auto' }}>Corporate Structure</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 900, marginTop: '1rem', letterSpacing: '-0.02em', color: '#fff', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>Our Teams & Leadership</h1>
          <p className="locations-hero-lead" style={{ maxWidth: '680px', margin: '1rem auto 0', color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, textAlign: 'center' }}>
            Meet the professional Board of Management directing divisions across electrical systems, motors, and composite materials.
          </p>
        </div>
      </section>

      {/* Leadership Messages */}
      <section style={{ padding: 'clamp(2.5rem, 7vw, 5rem) 0', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 6vw, 4rem)' }}>
            <span className="badge-tag" style={{ color: 'var(--accent-orange)' }}>Management Messages</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '800', margin: '0.5rem 0' }}>Messages from Our Leaders</h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1.25rem, 4vw, 3rem)' }}>
            {/* Mr. Hemant Patel */}
            <div style={{ flex: '1 1 450px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: 'clamp(1.25rem, 5vw, 2.5rem)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <img 
                  src="/assets/images/hemant_patel.png" 
                  alt="Mr. Hemant Patel" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-orange)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Mr. Hemant Patel</h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--accent-orange)', fontWeight: '700' }}>Director</div>
                </div>
              </div>
              <p style={{ fontSize: '0.96rem', lineHeight: '1.7', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                "Transpower's success is rooted in our unwavering commitment to excellence, innovation and customer satisfaction. With a dedicated workforce and cutting-edge technology, we continue to lead the Electro-Mechanical industry globally. Our goal is to provide an exceptional experience for our customers, ensuring joy and satisfaction in every interaction."
              </p>
            </div>

            {/* Mr. Kiran Parekh */}
            <div style={{ flex: '1 1 450px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: 'clamp(1.25rem, 5vw, 2.5rem)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <img 
                  src="/assets/images/kiran_parekh.png" 
                  alt="Mr. Kiran Parekh" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-orange)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Mr. Kiran Parekh</h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--accent-orange)', fontWeight: '700' }}>General Manager</div>
                </div>
              </div>
              <p style={{ fontSize: '0.96rem', lineHeight: '1.7', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                "As a General Manager, I am honored to lead a professional team that is dedicated to the company's vision & mission. Our commitment to excellence drives everything we do, from delivering outstanding products and services to providing exceptional customer support. We believe in fostering a culture of integrity, teamwork, innovation & excellence within our organization."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Management List */}
      <section style={{ padding: 'clamp(2.5rem, 7vw, 5rem) 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 6vw, 4rem)' }}>
            <span className="badge-tag" style={{ color: 'var(--accent-orange)' }}>Board Structure</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '800', margin: '0.5rem 0' }}>Board of Management</h2>
            <p style={{ color: '#64748b', fontSize: '0.96rem' }}>Divisional management directing standard operations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
            {BOARD_MEMBERS.map((member) => (
              <div 
                key={member.name} 
                style={{ 
                  background: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>{member.name}</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1rem 0', fontWeight: '500' }}>{member.designation}</p>
                <a 
                  href={`mailto:${member.email}`} 
                  style={{ fontSize: '0.84rem', color: 'var(--accent-orange)', textDecoration: 'none', fontWeight: '600' }}
                >
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section style={{ padding: 'clamp(2.5rem, 7vw, 5rem) 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span className="badge-tag" style={{ color: 'var(--accent-orange)' }}>Join Us</span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '800', margin: '0.5rem 0' }}>Start Your Journey With Us</h2>
          <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '2rem' }}>
            We are always looking for passionate people to join our technical operations, sales teams, and corporate divisions. Sent your resume to our human resources team.
          </p>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: 'clamp(1.25rem, 5vw, 2rem)', maxWidth: '100%', display: 'inline-block', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.88rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '0.5rem' }}>Send CV/Resume to</div>
            <a 
              href="mailto:hr@transpower.com" 
              style={{ fontSize: 'clamp(1.05rem, 4.5vw, 1.5rem)', fontWeight: '900', color: 'var(--accent-orange)', textDecoration: 'none', overflowWrap: 'break-word' }}
            >
              hr@transpower.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

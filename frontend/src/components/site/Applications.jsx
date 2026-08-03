import { APPLICATIONS } from '../../data/products';

export default function Applications() {
  return (
    <section id="applications" className="section">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Global Deployments</div>
          <h2>Industrial <span className="text-orange">Applications</span></h2>
          <p>Engineered for high performance across critical infrastructure sectors.</p>
        </div>

        <div className="applications-grid">
          {APPLICATIONS.map((app) => (
            <div className="app-card" key={app.title}>
              <img 
                src={app.image} 
                alt={app.imgAlt} 
                width="300" 
                height="225" 
                style={{ aspectRatio: '4/3', objectFit: 'cover' }} 
                loading="lazy" 
                decoding="async" 
              />
              <div className="app-card-overlay">
                <h4>{app.title}</h4>
                <p>{app.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

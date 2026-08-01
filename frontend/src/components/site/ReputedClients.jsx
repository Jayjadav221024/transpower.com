import { CLIENTS } from '../../data/company';
import '../../styles/home-sections.css';

/* Renders nothing until real client logos are added to data/company.js — an
   empty "Our Reputed Clients" heading looks worse than no section at all. */
export default function ReputedClients() {
  if (!CLIENTS.length) return null;

  return (
    <section className="section clients-section" id="clients">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Trusted Since 1960s</div>
          <h2>Our Reputed Clients</h2>
          <p>
            Plants and contractors across the chemical, power, textile and engineering sectors
            specify Transpower equipment.
          </p>
        </div>

        <div className="clients-grid">
          {CLIENTS.map((client) => (
            <div className="client-chip" key={client.name}>
              <img src={client.logo} alt={client.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

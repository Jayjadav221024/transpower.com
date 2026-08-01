import { BRANDS } from '../../data/company';
import '../../styles/home-sections.css';

export default function AuthorizedBrands() {
  if (!BRANDS.length) return null;

  return (
    <section className="section brands-strip-section" id="brands">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Partner Ecosystem</div>
          <h2>Authorized Brands</h2>
          <p>
            Transpower is an authorised channel partner for the motor, drive and switchgear
            manufacturers below — supplied with full warranty and technical backing.
          </p>
        </div>

        <div className="brands-strip">
          {BRANDS.map((brand) => (
            <div className="brand-chip" key={brand.name}>
              <img src={brand.logo} alt={brand.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

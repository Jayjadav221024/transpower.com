import { TESTIMONIALS } from '../../data/company';
import '../../styles/home-sections.css';

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export default function Testimonials() {
  if (!TESTIMONIALS.length) return null;

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Testimonials</div>
          <h2>Our Happy Customers</h2>
          <p>What plant engineers and procurement teams say about working with Transpower.</p>
        </div>

        <div className={`testimonials-grid count-${Math.min(TESTIMONIALS.length, 4)}`}>
          {TESTIMONIALS.map((t) => (
            <figure className="testimonial-card" key={`${t.author}-${t.company}`}>
              <span className="testimonial-mark" aria-hidden="true">&ldquo;</span>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">{initials(t.author)}</span>
                <span className="testimonial-who">
                  <strong>{t.author}</strong>
                  <span>{t.company}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

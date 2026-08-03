import { useEffect, useRef, useState } from 'react';
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
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!TESTIMONIALS.length || paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000); // 8s advance interval
    return () => clearInterval(interval);
  }, [paused]);

  if (!TESTIMONIALS.length) return null;

  const t = TESTIMONIALS[index];

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
    setPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      } else {
        setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      }
    }
    setPaused(false);
  };

  return (
    <section 
      className="section testimonials-section" 
      id="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <div className="section-header">
          <div className="badge-tag">Testimonials</div>
          <h2>Our Happy Customers</h2>
          <p>What plant engineers and procurement teams say about working with Transpower.</p>
        </div>

        <div 
          className="testimonials-carousel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <figure className="testimonial-card active-slide">
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

          {/* Carousel dots */}
          <div className="testimonials-dots" role="tablist">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

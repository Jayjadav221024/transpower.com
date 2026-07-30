import { Link } from 'react-router-dom';
import '../styles/blog.css';

export default function NotFoundPage() {
  return (
    <section className="post-page">
      <div className="container">
        <div className="blog-empty">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem' }}>404</h1>
          <p><strong>That page does not exist.</strong></p>
          <p style={{ marginTop: '1.2rem' }}>
            <Link to="/" className="btn btn-primary"><span>Back to home</span></Link>
          </p>
        </div>
      </div>
    </section>
  );
}

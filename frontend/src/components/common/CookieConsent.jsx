import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      right: '24px',
      maxWidth: '480px',
      background: 'rgba(9, 14, 24, 0.95)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.25rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      color: '#fff',
    }}>
      <div style={{ fontSize: '0.86rem', lineHeight: 1.5, color: '#e2e8f0' }}>
        🍪 We use cookies to analyze web traffic and optimize your user experience. By clicking "Accept All", you agree to our use of cookies as detailed in our <Link to="/privacy-policy" style={{ color: 'var(--accent-orange)', textDecoration: 'underline' }}>Privacy Policy</Link>.
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-end' }}>
        <Link to="/privacy-policy" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none', padding: '6px 12px', display: 'flex', alignItems: 'center' }}>Manage Options</Link>
        <button onClick={handleAccept} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem', fontWeight: 800 }}>Accept All</button>
      </div>
    </div>
  );
}

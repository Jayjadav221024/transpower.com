import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  const target = location.state?.from || '/admin/posts';

  /* Already signed in (or the cookie is still valid) — skip the form. */
  useEffect(() => {
    if (!loading && user) navigate(target, { replace: true });
  }, [loading, user, navigate, target]);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      await login(username, password);
      navigate(target, { replace: true });
    } catch (ex) {
      setError(ex.message);
      setPassword('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <div className="logo-icon">T</div>
          <div className="logo-text">
            TRANSPOWER
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <h1>Sign in</h1>
        <p className="muted">Manage blog posts, images and RFQ inquiries.</p>

        <label className="field">
          <span>Username</span>
          <input
            type="text" autoComplete="username" required autoFocus
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <div className="alert alert-error">{error}</div>}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

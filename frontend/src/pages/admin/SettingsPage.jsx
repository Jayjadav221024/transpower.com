import { useState } from 'react';
import { adminApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  const [current, setCurrent] = useState('');
  const [next, setNext]       = useState('');
  const [message, setMessage] = useState(null);   // { ok, text }
  const [busy, setBusy]       = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      await adminApi.changePassword(current, next);
      setCurrent('');
      setNext('');
      setMessage({ ok: true, text: 'Password updated.' });
    } catch (ex) {
      setMessage({ ok: false, text: ex.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="view">
      <header className="view-head">
        <div>
          <h1>Settings</h1>
          <p className="muted">Account security.</p>
        </div>
      </header>

      <form className="panel panel-wide" onSubmit={handleSubmit}>
        <h3>Change Password</h3>
        <p className="muted small" style={{ marginBottom: '1rem' }}>
          Signed in as <strong>{user?.username}</strong>.
        </p>

        <label className="field">
          <span>Current password</span>
          <input
            type="password" className="input" autoComplete="current-password" required
            value={current} onChange={(e) => setCurrent(e.target.value)}
          />
        </label>

        <label className="field">
          <span>New password <em>minimum 8 characters</em></span>
          <input
            type="password" className="input" autoComplete="new-password" required minLength={8}
            value={next} onChange={(e) => setNext(e.target.value)}
          />
        </label>

        {message && (
          <div className={`alert ${message.ok ? 'alert-success' : 'alert-error'}`}>{message.text}</div>
        )}

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </section>
  );
}

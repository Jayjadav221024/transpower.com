import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/client';
import '../../styles/admin.css';

const POLL_MS = 2000;

export default function LoginPage() {
  const { user, loading, login, setUser, endedReason } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  /* The panel is occupied. Holds who has it and whether we may ask them. */
  const [lock, setLock] = useState(null);
  /* An access request we raised and are waiting on. */
  const [pending, setPending] = useState(null);   // { ticket, expiresAt }
  const [outcome, setOutcome] = useState(null);   // 'denied' | 'expired'

  /* Kept in a ref so the poll loop can exchange an approval for a session
     without the password sitting in component state any longer than the form
     needs it. */
  const credentials = useRef({ username: '', password: '' });

  const target = location.state?.from || '/admin/posts';

  /* Already signed in (or the cookie is still valid) — skip the form. */
  useEffect(() => {
    if (!loading && user) navigate(target, { replace: true });
  }, [loading, user, navigate, target]);

  const resetToForm = useCallback(() => {
    setLock(null);
    setPending(null);
    setOutcome(null);
    setError('');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOutcome(null);

    credentials.current = { username, password };

    try {
      await login(username, password);
      navigate(target, { replace: true });
    } catch (ex) {
      if (ex.code === 'SESSION_ACTIVE') {
        /* Not a failure — the password was right, the panel is just occupied. */
        setLock({
          message: ex.message,
          holder: ex.data.holder,
          isSelf: ex.data.isSelf,
          idleTimeoutMinutes: ex.data.idleTimeoutMinutes,
        });
      } else {
        setError(ex.message);
        setPassword('');
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleRequestAccess() {
    setBusy(true);
    setError('');
    try {
      const { username: u, password: p } = credentials.current;
      const res = await adminApi.requestAccess(u, p);

      if (res.granted) {
        /* The holder's session lapsed in the meantime — we are simply in. */
        setUser(res.user);
        navigate(target, { replace: true });
        return;
      }
      setPending({ ticket: res.ticket, expiresAt: res.expiresAt });
    } catch (ex) {
      setError(ex.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCancelRequest() {
    if (pending?.ticket) await adminApi.cancelAccessRequest(pending.ticket).catch(() => {});
    setPending(null);
  }

  /* Poll until the holder answers, the request lapses, or we unmount. */
  useEffect(() => {
    if (!pending?.ticket) return undefined;

    let alive = true;
    let timer = null;

    const tick = async () => {
      try {
        const res = await adminApi.pollAccessRequest(pending.ticket);
        if (!alive) return;

        if (res.status === 'approved') {
          /* The poll response also set the session cookie. */
          setUser(res.user);
          navigate(target, { replace: true });
          return;
        }
        if (res.status === 'denied' || res.status === 'expired') {
          setPending(null);
          /* Clearing `lock` too, or the lock screen renders again and the
             explanation below — which lives on the sign-in form — is never
             seen. A refused admin should land back on the form. */
          setLock(null);
          setOutcome(res.status === 'denied' ? 'denied' : 'expired');
          setPassword('');
          credentials.current = { username: '', password: '' };
          return;
        }
      } catch {
        /* Network blip — keep polling rather than dropping the request. */
      }
      if (alive) timer = setTimeout(tick, POLL_MS);
    };

    timer = setTimeout(tick, POLL_MS);
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [pending, navigate, setUser, target]);

  /* ── Waiting on an answer ───────────────────────────────────────────────── */
  if (pending) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <Logo />
          <div className="lock-icon" aria-hidden="true">⏳</div>
          <h1>Waiting for approval</h1>
          <p className="muted">
            {lock?.holder?.name || 'The signed-in admin'} has been asked to let you in.
            Keep this page open — you will be signed in automatically when they accept.
          </p>

          <div className="waiting-bar" aria-hidden="true"><span /></div>

          <p className="muted small">
            This request expires in 5 minutes if nobody answers.
          </p>

          <button type="button" className="btn btn-ghost btn-block" onClick={handleCancelRequest}>
            Cancel request
          </button>
        </div>
      </div>
    );
  }

  /* ── Panel occupied ─────────────────────────────────────────────────────── */
  if (lock) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <Logo />
          <div className="lock-icon" aria-hidden="true">🔒</div>
          <h1>Admin panel in use</h1>

          <div className="holder-card">
            <div className="holder-avatar">
              {(lock.holder?.name || '?').trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{lock.holder?.name}</strong>
              <span className="muted small">@{lock.holder?.username}</span>
            </div>
          </div>

          <p className="muted">{lock.message}</p>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleRequestAccess}
            disabled={busy}
          >
            {busy ? 'Sending…' : 'Request access'}
          </button>

          <button type="button" className="btn btn-ghost btn-block" onClick={resetToForm}>
            Back to sign in
          </button>

          <p className="muted small">
            If nobody answers, the panel unlocks by itself after{' '}
            {lock.idleTimeoutMinutes || 15} minutes of inactivity.
          </p>
        </div>
      </div>
    );
  }

  /* ── Normal sign-in ─────────────────────────────────────────────────────── */
  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <Logo />

        <h1>Sign in</h1>
        <p className="muted">Manage blog posts, images and RFQ inquiries.</p>

        {!outcome && endedReason === 'SESSION_IDLE' && (
          <div className="alert alert-error">
            Your session ended after 15 minutes of inactivity, which also released
            the admin panel for others. Sign in again to continue.
          </div>
        )}
        {!outcome && endedReason === 'SESSION_REVOKED' && (
          <div className="alert alert-error">
            You were signed out of the admin panel. Sign in again to continue.
          </div>
        )}

        {outcome === 'denied' && (
          <div className="alert alert-error">
            Your access request was declined by the signed-in admin.
          </div>
        )}
        {outcome === 'expired' && (
          <div className="alert alert-error">
            Nobody answered your access request in time. You can try again.
          </div>
        )}

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

function Logo() {
  return (
    <div className="login-logo">
      <div className="logo-icon">T</div>
      <div className="logo-text">
        TRANSPOWER
        <span>ADMIN PANEL</span>
      </div>
    </div>
  );
}

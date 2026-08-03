import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/client';
import '../../styles/admin.css';

const POLL_MS = 2000;

export default function LoginPage() {
  const { user, loading, beginLogin, completeLogin, endedReason } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  /* The emailed code step. Set once the password has been accepted. */
  const [challenge, setChallenge] = useState(null);   // { challengeId, sentTo, expiresAt }
  const [code, setCode] = useState('');
  const [resent, setResent] = useState(false);

  /* The panel is occupied. Holds who has it and whether we may ask them. */
  const [lock, setLock] = useState(null);
  /* An access request we raised and are waiting on. */
  const [pending, setPending] = useState(null);   // { ticket, expiresAt }
  const [outcome, setOutcome] = useState(null);   // 'denied' | 'expired'

  /* Kept in a ref so the request-access step can reuse the password without it
     living in component state any longer than the form needs it. */
  const credentials = useRef({ username: '', password: '' });
  const codeInputRef = useRef(null);

  const target = location.state?.from || '/admin/posts';

  /* Already signed in (or the cookie is still valid) — skip the form. */
  useEffect(() => {
    if (!loading && user) navigate(target, { replace: true });
  }, [loading, user, navigate, target]);

  useEffect(() => {
    if (challenge) codeInputRef.current?.focus();
  }, [challenge]);

  const resetToForm = useCallback(() => {
    setLock(null);
    setPending(null);
    setChallenge(null);
    setCode('');
    setOutcome(null);
    setError('');
  }, []);

  /* ── Step 1: password ───────────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOutcome(null);

    credentials.current = { username, password };

    try {
      const res = await beginLogin(username, password);
      /* Correct password — but no session yet. A code is on its way. */
      setChallenge(res);
      setPassword('');
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

  /* ── Step 2: emailed code ───────────────────────────────────────────────── */
  async function handleVerify(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      await completeLogin(challenge.challengeId, code);
      navigate(target, { replace: true });
    } catch (ex) {
      setError(ex.message);
      setCode('');
      codeInputRef.current?.focus();

      /* The code died (expired or out of attempts), or somebody took the panel
         while it sat in the inbox — either way this challenge is finished. */
      if (ex.code === 'OTP_EXPIRED' || ex.code === 'OTP_UNKNOWN') {
        setChallenge(null);
      } else if (ex.code === 'SESSION_ACTIVE') {
        setChallenge(null);
        setLock({
          message: ex.message,
          holder: ex.data.holder,
          isSelf: ex.data.isSelf,
          idleTimeoutMinutes: ex.data.idleTimeoutMinutes,
        });
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setBusy(true);
    setError('');
    setResent(false);
    try {
      const res = await adminApi.resendOtp(challenge.challengeId);
      setChallenge(res);          // new challengeId, old code is dead
      setCode('');
      setResent(true);
    } catch (ex) {
      setError(ex.message);
      if (ex.code === 'OTP_UNKNOWN') setChallenge(null);
    } finally {
      setBusy(false);
    }
  }

  /* ── Access request (panel occupied) ────────────────────────────────────── */
  async function handleRequestAccess() {
    setBusy(true);
    setError('');
    try {
      const { username: u, password: p } = credentials.current;
      const res = await adminApi.requestAccess(u, p);

      if (res.granted) {
        /* The holder's session lapsed in the meantime — straight to the code. */
        setLock(null);
        setChallenge(res);
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
          /* Approved is permission to sign in, not a session — a code has been
             emailed and still has to be entered. */
          setPending(null);
          setLock(null);
          setChallenge(res);
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
  }, [pending]);

  /* ── Code entry ─────────────────────────────────────────────────────────── */
  if (challenge) {
    return (
      <div className="login-screen">
        <form className="login-card" onSubmit={handleVerify}>
          <Logo />
          <div className="lock-icon" aria-hidden="true">✉️</div>
          <h1>Enter your code</h1>
          <p className="muted">
            We emailed a 6-digit code to <strong>{challenge.sentTo}</strong>.
            It expires in 10 minutes.
          </p>

          <label className="field">
            <span>Verification code</span>
            <input
              ref={codeInputRef}
              className="otp-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              aria-describedby="otp-help"
            />
          </label>

          {resent && !error && (
            <div className="alert alert-success">A new code is on its way. The previous one no longer works.</div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy || code.length !== 6}>
            {busy ? 'Verifying…' : 'Verify & sign in'}
          </button>

          <button type="button" className="btn btn-ghost btn-block" onClick={handleResend} disabled={busy}>
            Send a new code
          </button>

          <button type="button" className="btn btn-ghost btn-block" onClick={resetToForm}>
            Back to sign in
          </button>

          <p className="muted small" id="otp-help">
            Not seeing it? Check the spam folder. The code is only valid for this sign-in.
          </p>
        </form>
      </div>
    );
  }

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
            Keep this page open — you will be sent a login code as soon as they accept.
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
          {busy ? 'Checking…' : 'Sign In'}
        </button>

        <p className="muted small">
          A one-time code will be emailed to the admin inbox to finish signing in.
        </p>
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

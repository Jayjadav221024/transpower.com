import { useEffect, useState, useCallback, useRef } from 'react';
import { adminApi } from '../../api/client';

const POLL_MS = 4000;

/**
 * Shown to the admin who holds the panel when someone else asks to be let in.
 *
 * Polls rather than using a socket: the whole admin panel is request/response
 * already, and a 4-second poll is well inside the 5-minute request window.
 */
export default function AccessRequestPrompt() {
  const [requests, setRequests] = useState([]);
  const [acting, setActing] = useState(null);     // id currently being answered
  const [error, setError] = useState('');
  /* Answered locally — hidden immediately so a poll in flight cannot flash the
     prompt back up after the admin has clicked. */
  const answered = useRef(new Set());

  const refresh = useCallback(async () => {
    try {
      const { requests: list } = await adminApi.listAccessRequests();
      setRequests(list.filter((r) => !answered.current.has(r.id)));
    } catch {
      /* Signed out or offline — the layout handles that, nothing to show. */
    }
  }, []);

  useEffect(() => {
    let alive = true;
    let timer = null;

    const loop = async () => {
      if (!alive) return;
      await refresh();
      if (alive) timer = setTimeout(loop, POLL_MS);
    };

    loop();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [refresh]);

  async function answer(id, decision) {
    setActing(id);
    setError('');
    try {
      if (decision === 'approve') await adminApi.approveAccessRequest(id);
      else await adminApi.denyAccessRequest(id);
      answered.current.add(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (ex) {
      setError(ex.message);
      /* Already answered elsewhere, or it expired — drop it either way. */
      if (ex.status === 409 || ex.status === 410) {
        answered.current.add(id);
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setActing(null);
    }
  }

  if (requests.length === 0) return null;

  return (
    <div className="access-request-stack" role="region" aria-label="Access requests">
      {requests.map((r) => (
        <div key={r.id} className="access-request-card" role="alertdialog" aria-labelledby={`arq-${r.id}`}>
          <div className="arq-head">
            <div className="arq-avatar">{(r.name || '?').trim().charAt(0).toUpperCase()}</div>
            <div className="arq-who">
              <strong id={`arq-${r.id}`}>{r.name}</strong>
              <span>@{r.username} wants to sign in</span>
            </div>
          </div>

          <p className="arq-note">
            Approving lets them use the admin panel alongside you. You will stay signed in.
          </p>

          {error && <div className="alert alert-error arq-error">{error}</div>}

          <div className="arq-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => answer(r.id, 'deny')}
              disabled={acting === r.id}
            >
              Deny
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => answer(r.id, 'approve')}
              disabled={acting === r.id}
            >
              {acting === r.id ? 'Working…' : 'Accept'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

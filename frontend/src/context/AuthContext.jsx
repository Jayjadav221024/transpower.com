import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminApi, onUnauthorized } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  /* Why the session ended, so the login screen can explain rather than just
     dumping the visitor back on a blank form. */
  const [endedReason, setEndedReason] = useState(null);

  /* A session can be revoked or time out while the admin is mid-edit. Clearing
     the user here lets RequireAuth bounce them to the login screen on the next
     render, wherever in the panel they happen to be. */
  useEffect(() => onUnauthorized((code) => {
    setUser(null);
    setEndedReason(code);
  }), []);

  /* Resume an existing session on first mount — the cookie may still be valid. */
  useEffect(() => {
    let alive = true;
    adminApi
      .me()
      .then(({ user: u }) => alive && setUser(u))
      .catch(() => alive && setUser(null))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  /* Two-step by design: the password only opens an emailed-code challenge, and
     `completeLogin` is the call that actually produces a session. There is
     deliberately no single-call login() any more — having one would make it
     easy to reintroduce a path that skips the second factor. */
  const beginLogin = useCallback(
    (username, password) => adminApi.login(username, password),
    [],
  );

  const completeLogin = useCallback(async (challengeId, code) => {
    const { user: u } = await adminApi.verifyOtp(challengeId, code);
    setUser(u);
    setEndedReason(null);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await adminApi.logout().catch(() => {});
    setUser(null);
    setEndedReason(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, beginLogin, completeLogin, logout, setUser, endedReason }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

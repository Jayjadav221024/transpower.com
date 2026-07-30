import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* Wait for the session check before deciding — otherwise a valid cookie
     would still bounce the user to the login screen on a hard refresh. */
  if (loading) {
    return (
      <div className="login-screen">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <p className="muted">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  return children;
}

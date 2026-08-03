import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastProvider } from '../components/admin/Toast';
import AccessRequestPrompt from '../components/admin/AccessRequestPrompt';
import '../styles/admin.css';

const NAV = [
  { to: '/admin/posts',     label: 'Blog Posts' },
  { to: '/admin/media',     label: 'Image Library' },
  { to: '/admin/inquiries', label: 'RFQ Inquiries' },
  { to: '/admin/pages',     label: 'Page Content Manager' },
  { to: '/admin/settings',  label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <ToastProvider>
      <div className="app">
        <aside className="sidebar">
          <div className="login-logo sidebar-logo">
            <div className="logo-icon">T</div>
            <div className="logo-text">
              TRANSPOWER
              <span>ADMIN PANEL</span>
            </div>
          </div>

          <nav className="side-nav">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-foot">
            <a href="/blog" target="_blank" rel="noopener noreferrer">View blog ↗</a>
            <div className="who">
              Signed in as <strong>{user?.name || user?.username}</strong>
            </div>
            <button type="button" className="btn btn-ghost btn-block" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </aside>

        <main className="content">
          <Outlet />
        </main>

        {/* Fixed overlay — an admin must see a join request wherever they are
            in the panel, not only on one page. */}
        <AccessRequestPrompt />
      </div>
    </ToastProvider>
  );
}

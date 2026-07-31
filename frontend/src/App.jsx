import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';

import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import PostPage from './pages/PostPage';
import NotFoundPage from './pages/NotFoundPage';
import FeatureDemoPage from './components/ui/demo-feature108';

import AdminLayout from './layouts/AdminLayout';
import RequireAuth from './components/admin/RequireAuth';
import LoginPage from './pages/admin/LoginPage';
import PostsPage from './pages/admin/PostsPage';
import PostEditorPage from './pages/admin/PostEditorPage';
import MediaPage from './pages/admin/MediaPage';
import InquiriesPage from './pages/admin/InquiriesPage';
import SettingsPage from './pages/admin/SettingsPage';
import PagesPage from './pages/admin/PagesPage';

import { useLocation } from 'react-router-dom';

const getPageKey = (path) => {
  if (path === '/') return 'homepage';
  const clean = path.replace(/[^a-zA-Z0-9]/g, '');
  return clean ? `${clean}page` : 'homepage';
};

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const origin = window.location.origin;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return '';
  }
  if (origin.includes('-1.onrender.com')) {
    return origin.replace('-1.onrender.com', '.onrender.com');
  }
  return '';
};

const applyPageOverrides = (overrides) => {
  if (!overrides) return;
  const apiBase = getApiBase();
  Object.entries(overrides).forEach(([selector, value]) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el) {
          if (el.tagName === 'IMG') {
            const fullUrl = (value.startsWith('http') || value.startsWith('data:')) ? value : `${apiBase}${value}`;
            if (el.src !== fullUrl) {
              el.src = fullUrl;
            }
          } else {
            if (el.innerText !== value) {
              el.innerText = value;
            }
          }
        }
      });
    } catch (e) {}
  });
};

import ProductPage from './pages/ProductPage';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const pageKey = getPageKey(location.pathname);
    let overrides = null;
    const apiBase = getApiBase();

    fetch(`${apiBase}/api/pages/${pageKey}`)
      .then(r => r.json())
      .then(res => {
        if (res && res.content) {
          overrides = res.content.overrides;
          applyPageOverrides(overrides);
          if (res.content.accentColor) {
            document.documentElement.style.setProperty('--accent-orange', res.content.accentColor);
          }
        }
      })
      .catch(() => {});

    // MutationObserver guarantees overrides stay applied even when React re-renders components
    const observer = new MutationObserver(() => {
      if (overrides) {
        applyPageOverrides(overrides);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [location]);

  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* ── Public site ─────────────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PostPage />} />
          <Route path="/feature-demo" element={<FeatureDemoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── Admin ───────────────────────────────────────────────────── */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="posts" replace />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/new" element={<PostEditorPage />} />
          <Route path="posts/:id" element={<PostEditorPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="pages" element={<PagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

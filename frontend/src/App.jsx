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

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* ── Public site ─────────────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
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

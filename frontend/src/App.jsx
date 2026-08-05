import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import ScrollToTop from './components/common/ScrollToTop';

/* HomePage is the landing route for almost every visitor, so it stays in the
   main bundle — lazy-loading it would only add a round trip before the LCP.
   Everything else is split out and fetched on demand. */
import HomePage from './pages/HomePage';
/* Static, not lazy: HomePage already pulls this in, so a dynamic import here
   would only split a chunk that every visitor downloads anyway. */
import FeatureDemoPage from './components/ui/demo-feature108';

const AboutPage     = lazy(() => import('./pages/AboutPage'));
const ProductsPage  = lazy(() => import('./pages/ProductsPage'));
const ProductPage   = lazy(() => import('./pages/ProductPage'));
const BlogPage      = lazy(() => import('./pages/BlogPage'));
const PostPage      = lazy(() => import('./pages/PostPage'));
const GalleryPage   = lazy(() => import('./pages/GalleryPage'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));
const CityPage      = lazy(() => import('./pages/CityPage'));
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'));
const ContactPage   = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage     = lazy(() => import('./pages/TermsPage'));
const OurTeamsPage   = lazy(() => import('./pages/OurTeamsPage'));

/* The admin panel is never touched by public traffic — keep all of it out of
   the visitor's download. */
const AdminLayout    = lazy(() => import('./layouts/AdminLayout'));
const RequireAuth    = lazy(() => import('./components/admin/RequireAuth'));
const LoginPage      = lazy(() => import('./pages/admin/LoginPage'));
const PostsPage      = lazy(() => import('./pages/admin/PostsPage'));
const AnalyticsPage  = lazy(() => import('./pages/admin/AnalyticsPage'));
const PostEditorPage = lazy(() => import('./pages/admin/PostEditorPage'));
const MediaPage      = lazy(() => import('./pages/admin/MediaPage'));
const InquiriesPage  = lazy(() => import('./pages/admin/InquiriesPage'));
const SettingsPage   = lazy(() => import('./pages/admin/SettingsPage'));
const PagesPage      = lazy(() => import('./pages/admin/PagesPage'));
const SEOKeywordPage = lazy(() => import('./pages/admin/SEOKeywordPage'));

const getPageKey = (path) => {
  if (path === '/') return 'homepage';
  if (path.startsWith('/product/')) {
    const productId = path.replace('/product/', '');
    return `productpage_${productId}`;
  }
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

/* Page overrides rarely change within a session, so the response is memoised.
   Without this, every back/forward navigation re-hits the API and the visual
   customiser's edits flash in a second time. */
const pageContentCache = new Map();

function fetchPageContent(pageKey) {
  if (pageContentCache.has(pageKey)) return pageContentCache.get(pageKey);

  const promise = fetch(`${getApiBase()}/api/pages/${pageKey}`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

  pageContentCache.set(pageKey, promise);
  return promise;
}

const applyPageOverrides = (overrides) => {
  if (!overrides) return;
  const apiBase = getApiBase();
  Object.entries(overrides).forEach(([selector, value]) => {
    try {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el) return;
        if (el.tagName === 'IMG') {
          const fullUrl = (value.startsWith('http') || value.startsWith('data:')) ? value : `${apiBase}${value}`;
          if (el.src !== fullUrl) el.src = fullUrl;
        } else if (el.innerText !== value) {
          el.innerText = value;
        }
      });
    } catch (e) { /* a malformed selector from the CMS must not break the page */ }
  });
};

/* Warm the chunks a visitor is most likely to click next, but only once the
   browser is idle and the current page has finished its own work — so the
   prefetch never competes with the initial render. */
function usePrefetchLikelyRoutes() {
  useEffect(() => {
    const prefetch = () => {
      import('./pages/ProductsPage');
      import('./pages/ProductPage');
      import('./pages/AboutPage');
    };

    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(prefetch, 2500);
    return () => clearTimeout(timer);
  }, []);
}

export default function App() {
  const { pathname } = useLocation();

  usePrefetchLikelyRoutes();

  const [showSplash, setShowSplash] = useState(() => {
    if (window.location.pathname.startsWith('/admin')) return false;
    return !sessionStorage.getItem('splash_shown');
  });
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    if (showSplash) {
      const fadeTimer = setTimeout(() => {
        setFadeSplash(true);
      }, 2500);

      const removeTimer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splash_shown', 'true');
      }, 3300);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [showSplash]);

  useEffect(() => {
    const pageKey = getPageKey(pathname);
    let overrides = null;
    let cancelled = false;
    let frame = null;
    let observer = null;

    /* Re-applying overrides itself mutates the DOM, which re-fires the
       observer. Disconnecting around the write and coalescing bursts into a
       single animation frame keeps that from turning into a feedback loop that
       runs querySelectorAll on every keystroke and carousel tick. */
    const reapply = () => {
      frame = null;
      if (!overrides || cancelled) return;
      observer?.disconnect();
      applyPageOverrides(overrides);
      observer?.observe(document.body, { childList: true, subtree: true });
    };

    const schedule = () => {
      if (frame !== null || cancelled) return;
      frame = requestAnimationFrame(reapply);
    };

    fetchPageContent(pageKey).then((res) => {
      if (cancelled || !res?.content) return;

      if (res.content.accentColor) {
        document.documentElement.style.setProperty('--accent-orange', res.content.accentColor);
      }

      overrides = res.content.overrides;
      if (!overrides || Object.keys(overrides).length === 0) return;

      applyPageOverrides(overrides);

      /* Only start watching once there is actually something to re-apply. */
      observer = new MutationObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      cancelled = true;
      if (frame !== null) cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    <AuthProvider>
      {showSplash && (
        <div className={`splash-screen${fadeSplash ? ' fade-out' : ''}`}>
          <div className="splash-container">
            <div className="logo-3d-wrap">
              <div className="logo-3d">
                <div className="logo-3d-face logo-3d-front">
                  <img src="/assets/images/logo_transpower.png" alt="Transpower Logo" />
                </div>
                <div className="logo-3d-face logo-3d-back">
                  <img src="/assets/images/logo_transpower.png" alt="Transpower Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ScrollToTop />
      <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
        <Routes>
          {/* ── Public site ─────────────────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<PostPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/locations/:citySlug" element={<CityPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/our-teams" element={<OurTeamsPage />} />
            <Route path="/our-team" element={<Navigate to="/our-teams" replace />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
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
            <Route index element={<Navigate to="analytics" replace />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/new" element={<PostEditorPage />} />
            <Route path="posts/:id" element={<PostEditorPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="pages" element={<PagesPage />} />
            <Route path="seo-keywords" element={<SEOKeywordPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

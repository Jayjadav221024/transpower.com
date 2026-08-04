import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';

/* Sends one GA4 page view per route change. Renders nothing — it exists to sit
   inside the router and watch the location.
 *
 * Must be mounted inside <BrowserRouter>; useLocation throws outside one. */
export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    /* Deferred by a tick on purpose. Pages set document.title from their own
       effects, and this component is a sibling that commits first — reporting
       immediately would send every hit carrying the previous page's title. */
    const timer = setTimeout(() => trackPageView(pathname + search), 0);
    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
}

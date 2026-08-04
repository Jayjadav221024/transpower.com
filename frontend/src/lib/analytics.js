/* ==========================================================================
   Google Analytics 4 (gtag.js)

   Loaded from code rather than pasted into index.html, because this is a
   single-page app: the snippet Google hands out reports one page view on the
   initial HTML load, and every route change after that — /products, /blog,
   each article, each product — is a client-side navigation that would never be
   recorded.

   Tracking runs only when VITE_GA_MEASUREMENT_ID is set. It lives in
   .env.production, which Vite loads for `npm run build` and not for
   `npm run dev`, so local development never reports itself as live traffic.
   The ID is not a secret — it ships inside the client bundle of every
   GA-tracked site and is readable in any page's source — so it is committed
   rather than left to a host dashboard variable, where being forgotten during
   a deploy means silently collecting nothing.
   ========================================================================== */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/** Whether GA is switched on for this build. */
export const analyticsEnabled = Boolean(MEASUREMENT_ID);

/* The admin panel is staff at work, not site traffic. Tracked, it would inflate
   the very visitor numbers the analytics dashboard reports on — an editor
   proof-reading twelve blog posts would look like an engaged prospect. */
const isTracked = (path) => !String(path || '').startsWith('/admin');

let started = false;

/** Installs gtag.js. Safe to call more than once. */
export function initAnalytics() {
  if (started || !MEASUREMENT_ID || typeof window === 'undefined') return;
  started = true;

  window.dataLayer = window.dataLayer || [];
  /* Deliberately a function declaration pushing `arguments`: that is the shape
     gtag.js reads back out of dataLayer. An arrow function with rest args
     pushes an array instead, and GA discards every hit without complaining. */
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  /* send_page_view:false hands page views entirely to the router below. Left at
     its default, `config` fires one for the entry page and the router fires a
     second — the landing page double-counts in every single session. */
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

  /* Appended after the config calls, so anything queued while the network
     fetch is in flight is sent the moment the script arrives. */
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/** One page view. `path` is used only to decide whether the route is tracked. */
export function trackPageView(path) {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  if (!isTracked(path)) return;

  window.gtag('event', 'page_view', {
    /* GA4 derives the page path, query and host from the full URL — sending a
       separate page_path would be ignored. */
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** For anything worth measuring beyond navigation — a quote request, say. */
export function trackEvent(name, params = {}) {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

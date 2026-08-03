import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Resets scroll on navigation, except when the URL carries a #section hash. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const timer = setTimeout(() => {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 85, behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { scrollToHash, scrollToTop, restoreScroll } from '../../utils/scroll';

/**
 * Scroll management for client-side navigation.
 *
 *  - New page  → jump to the top instantly. Animating a scroll-to-top makes
 *                every click feel like it lags by half a second.
 *  - #hash     → animate down to the section, offset for the sticky header.
 *  - Back/fwd  → return the visitor to where they actually were. Once React
 *                owns routing the browser cannot do this itself, so positions
 *                are tracked per history entry here.
 */
export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const positions = useRef(new Map());
  const activeKey = useRef(location.key);

  /* Positions are sampled while scrolling rather than read at navigation time:
     by the time a route swap commits, a shorter incoming page has already made
     the browser clamp scrollY and the real position is gone. */
  useEffect(() => {
    let frame = null;
    const sample = () => {
      frame = null;
      positions.current.set(activeKey.current, window.scrollY);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(sample);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const saved = positions.current.get(location.key);
    activeKey.current = location.key;

    if (location.hash) {
      return scrollToHash(location.hash, { smooth: true });
    }

    if (navigationType === 'POP' && saved != null) {
      return restoreScroll(saved);
    }

    scrollToTop({ smooth: false });
    return undefined;
  }, [location.key, location.pathname, location.hash, navigationType]);

  return null;
}

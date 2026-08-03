/* ==========================================================================
   Shared scroll helpers.

   The sticky header overlaps the top of the viewport, so anchoring to a section
   has to land it *below* the header rather than under it. That offset lives in
   one place here and is mirrored by `scroll-padding-top` in global.css.
   ========================================================================== */

export const HEADER_OFFSET = 90;

/** Visitors who asked for less motion get instant jumps, never animations. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function behaviorFor(smooth) {
  return smooth && !prefersReducedMotion() ? 'smooth' : 'auto';
}

/** Scrolls an element into view, offset for the sticky header. */
export function scrollToElement(el, { smooth = true } = {}) {
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: behaviorFor(smooth) });
  return true;
}

/** User input during a programmatic scroll means: stop, they took over. */
const INTERRUPT_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

/**
 * Scrolls to `#some-id`.
 *
 * Two things make this more than a one-line `scrollIntoView`:
 *
 *  1. The target is often not in the DOM yet — the route's chunk may still be
 *     downloading — so this polls animation frames up to a deadline.
 *  2. Content *above* the target keeps arriving (images resolving their
 *     height, sections realising) which pushes the target further down after
 *     the scroll has already been issued. So the offset is re-checked for a
 *     moment afterwards and corrected if it drifted — unless the visitor has
 *     started scrolling themselves, in which case we get out of the way.
 *
 * Returns a cancel function.
 */
export function scrollToHash(hash, { smooth = true, timeoutMs = 2000, settleMs = 1200 } = {}) {
  const id = String(hash || '').replace(/^#/, '');
  if (!id) return () => {};

  /* Enough to absorb a long smooth animation plus late-loading content, but
     short enough that we are never fighting a visitor who scrolled away. */
  const MAX_TOTAL_MS = 6000;
  const MAX_CORRECTIONS = 4;

  let frame = null;
  let cancelled = false;
  let begunAt = null;

  const stop = () => {
    cancelled = true;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    INTERRUPT_EVENTS.forEach((type) => window.removeEventListener(type, stop));
  };

  INTERRUPT_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true, once: true }));

  /* Phase 2: the element exists and the scroll has been issued.
     The smooth animation is still in flight and can easily outlast a second,
     so rest is detected from scrollY going quiet rather than from a timer —
     only *then* does the drift watch begin. */
  const watch = (el) => {
    let lastY = null;
    let stillFrames = 0;
    let restedAt = null;
    let corrections = 0;

    const step = (now) => {
      frame = null;
      if (cancelled) return;

      const y = window.scrollY;
      stillFrames = (lastY !== null && Math.abs(y - lastY) < 1) ? stillFrames + 1 : 0;
      lastY = y;

      /* Three quiet frames means the scroll animation has finished. */
      if (stillFrames >= 3) {
        if (restedAt === null) restedAt = now;

        const drift = el.getBoundingClientRect().top - HEADER_OFFSET;
        if (Math.abs(drift) > 4 && corrections < MAX_CORRECTIONS) {
          /* Content above the target grew or shrank while we were travelling.
             Correct instantly — a second animation stacked on the first reads
             as a stutter, and the visitor is already looking at the section. */
          scrollToElement(el, { smooth: false });
          corrections += 1;
          stillFrames = 0;
          restedAt = null;
        } else if (now - restedAt >= settleMs) {
          stop();
          return;
        }
      }

      if (now - begunAt < MAX_TOTAL_MS) frame = requestAnimationFrame(step);
      else stop();
    };

    return step;
  };

  /* Phase 1: wait for the element to exist — its route chunk may still be
     downloading. */
  const find = (now) => {
    frame = null;
    if (cancelled) return;
    if (begunAt === null) begunAt = now;

    const el = document.getElementById(id);
    if (el) {
      scrollToElement(el, { smooth });
      frame = requestAnimationFrame(watch(el));
      return;
    }
    if (now - begunAt < timeoutMs) frame = requestAnimationFrame(find);
    else stop();
  };

  frame = requestAnimationFrame(find);
  return stop;
}

/** Jump to the top. Route changes use instant so navigation feels immediate. */
export function scrollToTop({ smooth = false } = {}) {
  window.scrollTo({ top: 0, left: 0, behavior: behaviorFor(smooth) });
}

/**
 * Restores a saved scroll offset on back/forward.
 *
 * The restored page's chunk may still be loading, so the document can be too
 * short to hold the offset — the browser silently clamps the scroll and the
 * visitor lands near the top. Keep re-applying until the page is tall enough
 * or the deadline passes. Returns a cancel function.
 */
export function restoreScroll(top, { timeoutMs = 2000 } = {}) {
  let frame = null;
  let elapsed = 0;
  let last = null;

  const attempt = (now) => {
    frame = null;
    window.scrollTo({ top, left: 0, behavior: 'auto' });

    elapsed += last === null ? 0 : now - last;
    last = now;

    /* Done once the offset actually took, or we have waited long enough. */
    if (Math.abs(window.scrollY - top) < 2 || elapsed >= timeoutMs) return;
    frame = requestAnimationFrame(attempt);
  };

  frame = requestAnimationFrame(attempt);
  return () => {
    if (frame !== null) cancelAnimationFrame(frame);
  };
}

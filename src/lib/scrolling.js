// Scrolling: inertial smoothing for mouse wheels and trackpads (Lenis), plus
// programmatic scrolling and scroll locking. Lenis drives the page's native
// scroll position, so sticky elements, scroll listeners, find-in-page and
// IntersectionObservers keep working unchanged. Touch keeps native scrolling,
// and everything falls back to the browser's own scroller under reduced motion.
import Lenis from "lenis";
import { prefersReducedMotion } from "./motion.js";

let lenis = null;
let holds = 0;

export function startSmoothScroll() {
  if (lenis || typeof window === "undefined" || prefersReducedMotion()) return;
  lenis = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
    wheelMultiplier: 1,
    anchors: false, // the router handles in-page links
  });
  const raf = (time) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  if (holds > 0) lenis.stop();
}

// Stop the page scrolling while something else owns the screen (intro, mobile
// menu). Counted, so overlapping holds release correctly.
export function holdScroll() {
  holds++;
  document.documentElement.classList.add("is-scroll-locked");
  lenis?.stop();
}

export function releaseScroll() {
  holds = Math.max(0, holds - 1);
  if (holds > 0) return;
  document.documentElement.classList.remove("is-scroll-locked");
  lenis?.start();
}

// Glide to an element or y position. Element targets land below the fixed nav
// via scroll-padding-top in base.css, which both Lenis and scrollIntoView respect.
export function glideTo(target) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(target, { duration: 1.15 });
    return;
  }
  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ behavior, block: "start" });
}

// Jump without animation (route changes, restoring the back-button position).
// Re-measures first: after a route change the page height has changed.
export function jumpTo(y) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else window.scrollTo({ top: y, behavior: "instant" });
}

// Tell the smoother the page changed height (a brief opened, a filter applied).
export function remeasureScroll() {
  lenis?.resize();
}

// Inertial smooth scrolling for mouse wheels and trackpads (Lenis). It drives
// the page's native scroll position, so sticky elements, scroll listeners, and
// IntersectionObservers keep working unchanged. Touch keeps native scrolling.
// Off entirely under reduced motion.
import Lenis from "lenis";
import { prefersReducedMotion } from "./motion.js";

let lenis = null;
let holds = 0;


export function startSmoothScroll() {
  if (lenis || typeof window === "undefined" || prefersReducedMotion()) return;
  lenis = new Lenis({
    lerp: 0.1,
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

// Pause while something else owns the screen (intro, mobile menu). Counted, so
// overlapping holds release correctly.
export function holdScroll() {
  holds++;
  lenis?.stop();
}

export function releaseScroll() {
  holds = Math.max(0, holds - 1);
  if (holds === 0) lenis?.start();
}

// Glide to an element or y position; falls back to native scrolling. Element
// targets land below the fixed nav via scroll-padding-top in base.css, which
// both Lenis and scrollIntoView respect.
export function glideTo(target) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(target, { duration: 1.2 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

// Jump without animation (route changes, restoring the back-button position).
// Re-measures first: after a route change the page height has changed.
export function jumpTo(y) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else window.scrollTo({ top: y, behavior: "instant" });
}

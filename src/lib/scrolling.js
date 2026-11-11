// Programmatic scrolling and scroll locking, on the browser's own scroller.
// (The site used to run an inertial-scroll library here; native scrolling is
// lighter, keeps find-in-page and keyboard scrolling exact, and behaves the
// way each visitor's device is set up to behave.)
import { prefersReducedMotion } from "./motion.js";

let holds = 0;

// Stop the page scrolling while something else owns the screen (intro, mobile
// menu). Counted, so overlapping holds release correctly.
export function holdScroll() {
  holds++;
  document.documentElement.classList.add("is-scroll-locked");
}

export function releaseScroll() {
  holds = Math.max(0, holds - 1);
  if (holds === 0) document.documentElement.classList.remove("is-scroll-locked");
}

// Glide to an element or y position. Element targets land below the fixed nav
// via scroll-padding-top in base.css.
export function glideTo(target) {
  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ behavior, block: "start" });
}

// Jump without animation (route changes, restoring the back-button position).
export function jumpTo(y) {
  window.scrollTo({ top: y, behavior: "instant" });
}

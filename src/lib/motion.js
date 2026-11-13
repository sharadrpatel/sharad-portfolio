// Shared motion plumbing: the reduced-motion check, the intro handshake,
// smooth scrolling, and scroll-linked progress.
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Intro handshake ─────────────────────────────────────────────────────
// index.html adds `intro` to <html> when the opening sequence will play.
// Anything that should wait for it (the hero figure, count-ups) uses whenReady.
export const introPending = () => document.documentElement.classList.contains("intro");
export function whenReady(fn) {
  if (!introPending()) return fn(), () => {};
  window.addEventListener("intro:done", fn, { once: true });
  return () => window.removeEventListener("intro:done", fn);
}
export function finishIntro() {
  document.documentElement.classList.remove("intro");
  try {
    sessionStorage.setItem("so-intro", "1");
  } catch {}
  window.dispatchEvent(new Event("intro:done"));
}

// ── Smooth scrolling ────────────────────────────────────────────────────
// Lenis eases wheel and trackpad scrolling. It drives the real scroll
// position, so sticky elements and observers work as usual. Touch stays native.
let lenis = null;
export function startSmooth() {
  if (lenis || reduced()) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
  const raf = (t) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  if (introPending()) {
    lenis.stop();
    whenReady(() => lenis.start());
  }
}
// Lenis and scrollIntoView both honor scroll-padding-top (site.css), which clears the nav.
export function glideTo(el) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(el, { duration: 1.2 });
  } else el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
}
export function jumpTo(target) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(target, { immediate: true, force: true });
  } else if (typeof target === "number") window.scrollTo(0, target);
  else target.scrollIntoView({ block: "start" });
}

// ── Scroll-linked progress ──────────────────────────────────────────────
// A registered element gets a CSS custom property --p (0 → 1) that follows
// the scroll in both directions. One shared animation frame measures them all.
// CSS reads var(--p, 1), so without JavaScript or under reduced motion every
// scene simply rests in its finished state.
const clamp = (v) => Math.max(0, Math.min(1, v));
const MODES = {
  // Rising into view: 0 as the top crosses the bottom edge, 1 partway up.
  enter: (r, vh) => clamp((vh - r.top) / (vh * 0.55)),
  // Leaving through the top: 0 while in place, 1 once scrolled away.
  exit: (r) => clamp(-r.top / (r.height * 0.85)),
  // A reading line sweeping down the element.
  read: (r, vh) => clamp((vh * 0.78 - r.top) / (r.height + vh * 0.2)),
  // The whole trip across the viewport.
  through: (r, vh) => clamp((vh - r.top) / (vh + r.height)),
};
const items = new Set();
let frame = 0;
let listening = false;

function measure() {
  frame = 0;
  const vh = window.innerHeight;
  for (const it of items) {
    const r = it.el.getBoundingClientRect();
    if (r.bottom < -vh || r.top > vh * 2) continue;
    const p = MODES[it.mode](r, vh);
    if (Math.abs(p - it.last) < 0.001) continue;
    it.last = p;
    it.el.style.setProperty("--p", p.toFixed(3));
  }
}
const schedule = () => (frame ||= requestAnimationFrame(measure));

export function useProgress(mode = "enter") {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const it = { el, mode, last: -1 };
    items.add(it);
    if (!listening) {
      listening = true;
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    }
    schedule();
    return () => {
      items.delete(it);
      el.style.removeProperty("--p");
    };
  }, [mode]);
  return ref;
}

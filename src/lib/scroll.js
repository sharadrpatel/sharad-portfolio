// Scroll-linked progress. Registered elements get a `--p` custom property
// (0 → 1) that follows the scroll position in both directions, so scenes
// rewind when you scroll back. One shared rAF loop does all the measuring.
//
// CSS should treat a missing --p as the finished state, e.g. var(--p, 1):
// under reduced motion nothing registers and every scene simply rests.
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion.js";

const clamp = (v) => Math.max(0, Math.min(1, v));

const MODES = {
  // Element rises from the bottom edge until its top reaches `end` of the viewport.
  enter: (r, vh, o) => clamp((vh - r.top) / (vh * (1 - (o.end ?? 0.45)))),
  // The whole trip: top enters at the bottom (0) until the bottom leaves at the top (1).
  through: (r, vh) => clamp((vh - r.top) / (vh + r.height)),
  // Reading line at `line` of the viewport moving down the element.
  read: (r, vh, o) => clamp((vh * (o.line ?? 0.6) - r.top) / r.height),
  // Element scrolling off the top (0 while fully in place).
  exit: (r, vh, o) => clamp(-r.top / (r.height * (o.span ?? 0.85))),
  // Starts `lead` viewports before the top enters; done once the bottom is in view.
  // Suits the last thing on a page, which can never scroll further up.
  land: (r, vh, o) => clamp((vh * (1 + (o.lead ?? 0.4)) - r.top) / (r.height + vh * (o.lead ?? 0.4))),
  // Page scroll from the very top, over `span` viewport heights.
  page: (r, vh, o) => clamp(window.scrollY / (vh * (o.span ?? 1))),
};

const items = new Set();
let frame = 0;
let listening = false;

function measure() {
  frame = 0;
  const vh = window.innerHeight;
  for (const it of items) {
    const r = it.el.getBoundingClientRect();
    if (r.bottom < -vh || r.top > vh * 2) continue; // far away: leave as is
    const p = MODES[it.mode](r, vh, it.opts);
    if (Math.abs(p - it.last) < 0.0005) continue;
    it.last = p;
    it.el.style.setProperty("--p", p.toFixed(4));
    it.opts.onProgress?.(p);
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(measure);
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

export function useScrub(mode = "enter", opts = {}) {
  const ref = useRef(null);
  const optsRef = useRef(opts);
  optsRef.current = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const it = {
      el,
      mode,
      last: -1,
      get opts() {
        return optsRef.current;
      },
    };
    items.add(it);
    listen();
    schedule();
    return () => {
      items.delete(it);
      el.style.removeProperty("--p");
    };
  }, [mode]);
  return ref;
}

// Re-measure after layout changes that scroll events won't announce.
export function refreshScrub() {
  schedule();
}

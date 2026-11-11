// Scroll-linked progress for the two places that use it: the hero figure,
// where scrolling runs the simulation clock, and the footer signature. A
// registered element gets a `--p` custom property (0 → 1) and an optional
// callback; one shared rAF loop does all the measuring.
//
// Under reduced motion nothing registers, so both rest in their finished state.
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion.js";

const clamp = (v) => Math.max(0, Math.min(1, v));

const MODES = {
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

export function useScrub(mode = "page", opts = {}) {
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

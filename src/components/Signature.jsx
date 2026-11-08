import { useEffect, useRef } from "react";
import { useScrub } from "../lib/scroll.js";
import { prefersReducedMotion } from "../lib/motion.js";
import { PROFILE } from "../data/profile.js";

// The page's closing signature: the name as a field of points that gathers
// out of scattered data as you reach the bottom of the page, and scatters
// again as you scroll back up. Mirrors the intro. Decorative; the footer
// carries the name as text.
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Signature() {
  const canvas = useRef(null);
  const state = useRef({ pts: [], w: 0, h: 0, size: 2, p: 1 });

  const paint = (p) => {
    const s = state.current;
    s.p = p;
    const cvs = canvas.current;
    if (!cvs || !s.pts.length) return;
    const ctx = cvs.getContext("2d");
    ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    ctx.clearRect(0, 0, s.w, s.h);
    ctx.fillStyle = getComputedStyle(cvs).color;
    for (const q of s.pts) {
      const k = ease(Math.max(0, Math.min(1, (p - q.d) / 0.55)));
      const x = q.sx + (q.tx - q.sx) * k;
      const y = q.sy + (q.ty - q.sy) * k;
      const z = s.size * (0.55 + 0.45 * k);
      ctx.globalAlpha = 0.35 + 0.65 * k;
      ctx.fillRect(x - z / 2, y - z / 2, z, z);
    }
    ctx.globalAlpha = 1;
  };

  const wrap = useScrub("land", { lead: 0.45, onProgress: paint });

  useEffect(() => {
    const build = () => {
      const cvs = canvas.current;
      if (!cvs) return;
      const w = cvs.parentElement.clientWidth;
      const cs = getComputedStyle(cvs);
      const probe = document.createElement("canvas").getContext("2d");
      const family = cs.fontFamily;
      probe.font = `600 100px ${family}`;
      probe.letterSpacing = "-5px"; // matches the -0.05em used when drawing
      const text = PROFILE.name;
      const fontSize = Math.floor((100 * w) / (probe.measureText(text).width * 1.02));
      const h = Math.ceil(fontSize * 0.92);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      cvs.style.height = `${h}px`;

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      o.font = `600 ${fontSize}px ${family}`;
      o.letterSpacing = `${-0.05 * fontSize}px`;
      o.textBaseline = "alphabetic";
      o.fillText(text, 0, h * 0.8);
      const img = o.getImageData(0, 0, w, h).data;

      const step = Math.max(4, Math.round(w / 210));
      const r = rng(2027);
      const pts = [];
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          if (img[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 128) {
            pts.push({
              tx: x,
              ty: y,
              // Scattered like raw measurements across the band
              sx: r() * w,
              sy: h * 0.5 + (r() - 0.5) * h * 1.4,
              d: (x / w) * 0.35 + r() * 0.1,
            });
          }
        }
      }
      state.current = { pts, w, h, dpr, size: step * 0.5, p: state.current.p };
      paint(prefersReducedMotion() ? 1 : state.current.p);
    };

    build();
    document.fonts?.ready.then(build);
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(build, 150);
    };
    window.addEventListener("resize", onResize);
    // Repaint in the new ink when the theme flips.
    const mo = new MutationObserver(() => paint(state.current.p));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      window.removeEventListener("resize", onResize);
      mo.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={wrap} className="signature" aria-hidden="true">
      <canvas ref={canvas} className="signature__canvas" />
    </div>
  );
}

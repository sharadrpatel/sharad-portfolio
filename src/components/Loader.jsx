import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { INTRO, markIntroSeen } from "../lib/intro.js";

// First-visit intro: a name assembled from data.
//   1. A cloud of noisy measurements is recorded across the screen and a
//      model curve sweeps through it.
//   2. The points leave the plot and stream into the letterforms of the
//      hero name, sampled from where the real text sits on the page, while
//      the dark field fades and the rest of the page comes in.
//   3. The dotted name dissolves into the real type.
// The data are synthetic. Click, tap, or press a key to fast-forward. Once per
// session; never under reduced motion. Purely visual, so it is hidden from
// assistive technology. Deep links (no hero on screen) get a simple lift.

const RECORD_MS = 950; // points arrive
const CURVE_MS = 700; // model sweeps through (overlaps the end of recording)
const FORM_MS = 1500; // points travel into the name (incl. stagger)
const FADE_MS = 520; // dotted name dissolves into the real one
const MAX_WAIT = 2400; // never wait longer than this for fonts

const BG = "#121211";
const POINT = [243, 242, 238];
const CURVE = "#a9b1ff";
const AXIS = "rgba(243, 242, 238, 0.22)";

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t) => Math.max(0, Math.min(1, t));

// Deterministic randomness, so the cloud looks the same every visit.
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The "measured" process: a damped oscillation with drift.
const signal = (u) => 0.62 * Math.exp(-u / 0.55) * Math.sin(2 * Math.PI * 3.1 * u + 0.35) + 0.3 * (u - 0.5);

// Sample the hero name, glyph by glyph, at its real on-screen position.
function sampleName(count) {
  const h1 = document.querySelector(".hero__name");
  if (!h1) return null;
  const box = h1.getBoundingClientRect();
  if (box.width === 0 || box.bottom < 0 || box.top > window.innerHeight) return null;

  const cs = getComputedStyle(h1);
  const W = Math.ceil(window.innerWidth);
  const H = Math.ceil(window.innerHeight);
  const cvs = document.createElement("canvas");
  cvs.width = W;
  cvs.height = H;
  const ctx = cvs.getContext("2d", { willReadFrequently: true });
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  ctx.fillStyle = "#000";
  ctx.textBaseline = "alphabetic";

  const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent;
    for (let i = 0; i < text.length; i++) {
      if (!text[i].trim()) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getClientRects()[0];
      if (!r) continue;
      const m = ctx.measureText(text[i]);
      ctx.fillText(text[i], r.left, r.top + (m.fontBoundingBoxAscent ?? r.height * 0.8));
    }
  }

  const x0 = Math.max(0, Math.floor(box.left - 20));
  const y0 = Math.max(0, Math.floor(box.top - 20));
  const w = Math.min(W - x0, Math.ceil(box.width + 40));
  const h = Math.min(H - y0, Math.ceil(box.height + 40));
  if (w <= 0 || h <= 0) return null;
  const img = ctx.getImageData(x0, y0, w, h).data;

  // Pick a grid step that gives roughly `count` points.
  let ink = 0;
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (img[(y * w + x) * 4 + 3] > 128) ink++;
  const step = Math.max(3, Math.sqrt((ink * 4) / count));
  const pts = [];
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      if (img[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 128) pts.push([x0 + x, y0 + y]);
    }
  }
  return pts.length ? { pts, step, color: cs.color } : null;
}

function parseRGB(c) {
  const m = c.match(/\d+(\.\d+)?/g);
  return m ? m.slice(0, 3).map(Number) : [18, 18, 17];
}

export default function Loader() {
  const [phase, setPhase] = useState(INTRO ? "run" : "done");
  const canvas = useRef(null);
  const status = useRef(null);
  const count = useRef(null);
  const fit = useRef(null);
  const speed = useRef(1);

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("is-loading", phase === "run");
    html.classList.toggle("is-intro", phase === "run" || phase === "form");
  }, [phase]);

  useEffect(() => {
    if (!INTRO) return;
    const cvs = canvas.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth;
    const H = window.innerHeight;
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    const ctx = cvs.getContext("2d");
    ctx.scale(dpr, dpr);

    const N = W < 700 ? 1100 : 1900;
    const rand = rng(1933);
    const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());

    // The data cloud, in a plot centered on screen.
    const narrow = W < 700;
    const plot = { x: W * (narrow ? 0.08 : 0.16), w: W * (narrow ? 0.84 : 0.68), y: H * 0.45, a: Math.min(H * 0.22, 190) };
    const P = Array.from({ length: N }, () => {
      const u = rand();
      const y = signal(u) + 0.085 * gauss();
      return {
        u,
        v: y,
        sx: plot.x + u * plot.w,
        sy: plot.y - y * plot.a * 1.6,
        born: u * RECORD_MS * 0.85 + rand() * 120,
        delay: 0,
        tx: 0,
        ty: 0,
        cx: 0,
        cy: 0,
      };
    });

    // R² of the cloud against the true curve: computed, not invented.
    const mean = P.reduce((a, p) => a + p.v, 0) / N;
    let res = 0;
    let tot = 0;
    for (const p of P) {
      res += (p.v - signal(p.u)) ** 2;
      tot += (p.v - mean) ** 2;
    }
    const r2 = (1 - res / tot).toFixed(2);

    let fontsReady = false;
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, MAX_WAIT))]).then(
      () => (fontsReady = true)
    );

    let target = null;
    let formStart = 0;
    let endColor = [18, 18, 17];
    let size = 2;
    let frame;
    let clock = 0;
    let last = performance.now();
    status.current.textContent = "Acquiring data";

    const startForm = () => {
      target = sampleName(N);
      if (!target) {
        setPhase("lift");
        setTimeout(() => setPhase("done"), 900);
        return false;
      }
      endColor = parseRGB(target.color);
      size = Math.max(1.6, Math.min(3.2, target.step * 0.42));
      const T = target.pts;
      // Shuffle targets deterministically, then hand one to each particle.
      for (let i = T.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [T[i], T[j]] = [T[j], T[i]];
      }
      let minX = Infinity;
      let maxX = -Infinity;
      for (const t of T) {
        minX = Math.min(minX, t[0]);
        maxX = Math.max(maxX, t[0]);
      }
      const spanX = Math.max(1, maxX - minX);
      P.forEach((p, i) => {
        const [tx, ty] = T[i % T.length];
        p.tx = tx;
        p.ty = ty;
        // Sweep left to right, with some scatter, like the data being read in.
        p.delay = ((tx - minX) / spanX) * 420 + rand() * 260;
        // A bowed path: control point pushed sideways from the midpoint.
        const bow = (rand() - 0.5) * 220;
        p.cx = (p.sx + tx) / 2 + bow;
        p.cy = (p.sy + ty) / 2 - Math.abs(bow) * 0.6;
      });
      formStart = clock;
      status.current.textContent = "Assembling";
      setPhase("form");
      return true;
    };

    const draw = () => {
      const now = performance.now();
      clock += (now - last) * speed.current;
      last = now;
      ctx.clearRect(0, 0, W, H);

      if (!target) {
        // 1. Record + fit
        const curveP = clamp01((clock - (RECORD_MS - 250)) / CURVE_MS);
        ctx.strokeStyle = AXIS;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(plot.x, plot.y - plot.a * 1.25);
        ctx.lineTo(plot.x, plot.y + plot.a * 1.25);
        ctx.lineTo(plot.x + plot.w, plot.y + plot.a * 1.25);
        ctx.stroke();

        ctx.fillStyle = `rgb(${POINT.join(",")})`;
        let shown = 0;
        for (const p of P) {
          const k = clamp01((clock - p.born) / 260);
          if (k <= 0) continue;
          shown++;
          const s = 1.8 * easeOut(k);
          ctx.fillRect(p.sx - s / 2, p.sy - s / 2, s, s);
        }
        count.current.textContent = shown.toLocaleString("en-US");

        if (curveP > 0) {
          if (curveP < 1) status.current.textContent = "Fitting model";
          ctx.strokeStyle = CURVE;
          ctx.lineWidth = 2;
          ctx.beginPath();
          const n = Math.floor(160 * easeInOut(curveP));
          for (let k = 0; k <= n; k++) {
            const u = k / 160;
            const x = plot.x + u * plot.w;
            const y = plot.y - signal(u) * plot.a * 1.6;
            if (k) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
          }
          ctx.stroke();
          if (curveP >= 1) fit.current.textContent = `R² ${r2}`;
        }

        const ready = clock >= RECORD_MS + CURVE_MS - 150 && (fontsReady || speed.current > 1);
        if (ready && !startForm()) return;
      } else {
        // 2. Travel into the name
        const t = clock - formStart;
        const g = clamp01(t / (FORM_MS - 300));
        const col = POINT.map((c, i) => Math.round(c + (endColor[i] - c) * easeInOut(g)));
        ctx.fillStyle = `rgb(${col.join(",")})`;
        let arrived = 0;
        for (const p of P) {
          const k = easeInOut(clamp01((t - p.delay) / (FORM_MS - 700)));
          if (k >= 1) arrived++;
          const a = 1 - k;
          const x = a * a * p.sx + 2 * a * k * p.cx + k * k * p.tx;
          const y = a * a * p.sy + 2 * a * k * p.cy + k * k * p.ty;
          const s = 1.8 + (size - 1.8) * k;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
        if (arrived === N || t > FORM_MS + 200) {
          // 3. Hand over to the real type
          setPhase("settle");
          setTimeout(() => setPhase("done"), FADE_MS);
          return;
        }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    const ff = () => (speed.current = 3);
    window.addEventListener("keydown", ff);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", ff);
    };
  }, []);

  useEffect(() => {
    if (phase === "settle" || phase === "lift") markIntroSeen();
  }, [phase]);

  if (phase === "done") return null;
  return (
    <div className={`loader is-${phase}`} aria-hidden="true" onClick={() => (speed.current = 3)}>
      <div className="loader__bg" style={{ background: BG }} />
      <canvas ref={canvas} className="loader__canvas" />
      <div className="loader__chrome wrap">
        <div className="loader__top">
          <span className="wordmark__mark">SP</span>
          <span>Sharad Patel</span>
          <span className="loader__status" ref={status} />
        </div>
        <div className="loader__bottom">
          <div className="loader__score">
            <span className="loader__count" ref={count}>
              0
            </span>
            <span className="loader__meta">
              data points · <span ref={fit}>fitting…</span>
            </span>
          </div>
          <div className="loader__words">
            <p className="loader__line-1">
              Models of how the body works,
              <br />
              checked against real data.
            </p>
            <span className="loader__skip loader__skip--pointer">Click or press any key to skip ahead</span>
            <span className="loader__skip loader__skip--touch">Tap to skip ahead</span>
          </div>
        </div>
      </div>
    </div>
  );
}

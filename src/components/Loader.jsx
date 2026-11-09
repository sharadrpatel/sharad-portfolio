import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { INTRO, markIntroSeen } from "../lib/intro.js";
import { holdScroll, releaseScroll } from "../lib/smooth.js";

// First-visit intro: model meets data, then the name.
//   1. Sixty-four noisy measurements are recorded across a plot.
//   2. The countdown: a model curve searches its way onto them, residuals
//      shrink, and R² (computed live against the points) climbs from about
//      0.12 to 0.97.
//   3. Each measurement bursts into a cluster of points, and the points stream
//      into the letterforms of the hero name, sampled from where the real
//      text sits, while the dark field fades and the page comes in.
//   4. The dotted name dissolves into the real type.
// The data are synthetic and labeled as such. Click, tap, or press a key to
// fast-forward. Once per session; never under reduced motion. Purely visual,
// so it is hidden from assistive technology. Deep links get a simple lift.

const RECORD_MS = 550; // measurements arrive
const FIT_MS = 1700; // the countdown
const HOLD_MS = 250; // "Model fits data"
const FORM_MS = 1400; // points travel into the name (incl. stagger)
const FADE_MS = 520; // dotted name dissolves into the real one
const MAX_WAIT = 2600; // never wait longer than this for fonts
const N_DATA = 64;

const BG = "#121211";
const POINT = [243, 242, 238];
const CURVE = "#a9b1ff";
const AXIS = "rgba(243, 242, 238, 0.22)";

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const smooth = (t) => t * t * (3 - 2 * t);
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

// The process behind the synthetic data, and the model's starting guess.
// The guess and schedule were tuned so R² climbs steadily from ~0.12 to ~0.97.
const TRUE = { A: 0.62, w: 3.1, phi: 0.35, tau: 0.55, b: 0.3 };
const GUESS = { A: 0.1, w: 2.8, phi: 0, tau: 0.55, b: 0 };
const model = (t, p) => p.A * Math.exp(-t / p.tau) * Math.sin(2 * Math.PI * p.w * t + p.phi) + p.b * (t - 0.5);

// Like an optimizer: amplitude and trend ease in; frequency and phase hunt.
function paramsAt(u) {
  if (u >= 1) return TRUE;
  const s = smooth(u);
  const h = 1 - Math.exp(-4 * u) * Math.cos(5 * u);
  return {
    A: GUESS.A + (TRUE.A - GUESS.A) * s,
    w: GUESS.w + (TRUE.w - GUESS.w) * h,
    phi: GUESS.phi + (TRUE.phi - GUESS.phi) * h,
    tau: TRUE.tau,
    b: GUESS.b + (TRUE.b - GUESS.b) * s,
  };
}

function makeData(rand) {
  return Array.from({ length: N_DATA }, (_, i) => {
    const t = (i + 0.5) / N_DATA;
    const g = Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
    return [t, model(t, TRUE) + 0.045 * g];
  });
}

function rSquared(data, p) {
  const mean = data.reduce((s, [, y]) => s + y, 0) / data.length;
  let res = 0;
  let tot = 0;
  for (const [t, y] of data) {
    res += (y - model(t, p)) ** 2;
    tot += (y - mean) ** 2;
  }
  return 1 - res / tot;
}

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
  const r2 = useRef(null);
  const meta = useRef(null);
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

    const narrow = W < 700;
    const rand = rng(1933);
    const data = makeData(rand);
    const plot = {
      x: W * (narrow ? 0.08 : 0.18),
      w: W * (narrow ? 0.84 : 0.64),
      y: H * (narrow ? 0.4 : 0.42),
      a: Math.min(H * 0.2, 170) * 1.6,
    };
    const px = (t) => plot.x + t * plot.w;
    const py = (v) => plot.y - v * plot.a;
    const dot = narrow ? 2.6 : 3.4;
    const pts = data.map(([t, v], i) => ({ x: px(t), y: py(v), born: (i / N_DATA) * RECORD_MS * 0.9 }));

    // Particles: each measurement will burst into a small cluster.
    const N = narrow ? 1100 : 1900;
    const P = Array.from({ length: N }, (_, i) => {
      const src = pts[i % N_DATA];
      const ang = rand() * Math.PI * 2;
      const rad = 2 + rand() * (narrow ? 7 : 10);
      return { sx: src.x + Math.cos(ang) * rad, sy: src.y + Math.sin(ang) * rad, tx: 0, ty: 0, cx: 0, cy: 0, delay: 0 };
    });

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
    let fitDone = 0;
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
        p.delay = 120 + ((tx - minX) / spanX) * 420 + rand() * 240;
        const bow = (rand() - 0.5) * 220;
        p.cx = (p.sx + tx) / 2 + bow;
        p.cy = (p.sy + ty) / 2 - Math.abs(bow) * 0.6;
      });
      formStart = clock;
      status.current.textContent = "Assembling";
      setPhase("form");
      return true;
    };

    const drawCurve = (p, alpha) => {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = CURVE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const q of pts) {
        // residuals: measurement to model
        const t = (q.x - plot.x) / plot.w;
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(q.x, py(model(t, p)));
      }
      ctx.globalAlpha = alpha * 0.45;
      ctx.stroke();
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2.25;
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let k = 0; k <= 200; k++) {
        const t = k / 200;
        if (k) ctx.lineTo(px(t), py(model(t, p)));
        else ctx.moveTo(px(t), py(model(t, p)));
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawAxes = (alpha) => {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = AXIS;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const top = plot.y - plot.a * 0.78;
      const bottom = plot.y + plot.a * 0.78;
      ctx.moveTo(plot.x, top);
      ctx.lineTo(plot.x, bottom);
      ctx.lineTo(plot.x + plot.w, bottom);
      for (let k = 0; k <= 4; k++) {
        ctx.moveTo(px(k / 4), bottom);
        ctx.lineTo(px(k / 4), bottom + 5);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      const now = performance.now();
      clock += (now - last) * speed.current;
      last = now;
      ctx.clearRect(0, 0, W, H);

      if (!target) {
        // 1. Record, then 2. the countdown fit
        drawAxes(1);
        const u = clamp01((clock - RECORD_MS) / FIT_MS);
        const fitting = clock >= RECORD_MS;
        const p = fitting ? paramsAt(u) : GUESS;
        if (fitting) drawCurve(p, clamp01((clock - RECORD_MS) / 250));

        ctx.fillStyle = `rgb(${POINT.join(",")})`;
        let shown = 0;
        for (const q of pts) {
          const k = clamp01((clock - q.born) / 240);
          if (k <= 0) continue;
          shown++;
          ctx.beginPath();
          ctx.arc(q.x, q.y, dot * easeOut(k), 0, Math.PI * 2);
          ctx.fill();
        }

        if (!fitting) {
          meta.current.textContent = `n = ${shown}`;
        } else {
          r2.current.textContent = Math.max(0, rSquared(data, p)).toFixed(2);
          if (u < 1) {
            status.current.textContent = "Fitting model";
            meta.current.textContent = `fitting… · n = ${N_DATA} · iteration ${Math.round(u * 120)}`;
          } else {
            if (!fitDone) fitDone = clock;
            status.current.textContent = "Model fits data";
            meta.current.textContent = `converged · n = ${N_DATA} · iteration 120`;
            const ready = clock - fitDone >= HOLD_MS && (fontsReady || speed.current > 1);
            if (ready && !startForm()) return;
          }
        }
      } else {
        // 3. Burst and travel into the name
        const t = clock - formStart;
        const fade = clamp01(t / 300);
        if (fade < 1) {
          drawAxes(1 - fade);
          drawCurve(TRUE, 1 - fade);
          ctx.fillStyle = `rgb(${POINT.join(",")})`;
          for (const q of pts) {
            ctx.beginPath();
            ctx.arc(q.x, q.y, dot * (1 - fade), 0, Math.PI * 2);
            ctx.fill();
          }
        }
        const g = clamp01(t / (FORM_MS - 300));
        const col = POINT.map((c, i) => Math.round(c + (endColor[i] - c) * easeInOut(g)));
        ctx.fillStyle = `rgb(${col.join(",")})`;
        let arrived = 0;
        for (const p of P) {
          const appear = clamp01(t / 180);
          const k = easeInOut(clamp01((t - p.delay) / (FORM_MS - 700)));
          if (k >= 1) arrived++;
          const a = 1 - k;
          const x = a * a * p.sx + 2 * a * k * p.cx + k * k * p.tx;
          const y = a * a * p.sy + 2 * a * k * p.cy + k * k * p.ty;
          const s = (1.6 + (size - 1.6) * k) * appear;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
        if (arrived === N || t > FORM_MS + 300) {
          // 4. Hand over to the real type
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

  // No scrolling under the intro; let go as soon as it hands over the page.
  const holding = useRef(false);
  useEffect(() => {
    const busy = phase === "run" || phase === "form";
    if (busy && !holding.current) {
      holding.current = true;
      holdScroll();
    } else if (!busy && holding.current) {
      holding.current = false;
      releaseScroll();
    }
  }, [phase]);
  useEffect(() => () => holding.current && releaseScroll(), []);

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
            <span className="loader__r2-label">
              R<sup>2</sup>
            </span>
            <span className="loader__count" ref={r2}>
              –.––
            </span>
            <span className="loader__meta" ref={meta}>
              n = 0
            </span>
          </div>
          <div className="loader__words">
            <span className="loader__note">Synthetic signal · model fit · residuals shown</span>
            <span className="loader__skip loader__skip--pointer">Click or press any key to skip ahead</span>
            <span className="loader__skip loader__skip--touch">Tap to skip ahead</span>
          </div>
        </div>
      </div>
    </div>
  );
}

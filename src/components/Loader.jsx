import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { INTRO, markIntroSeen } from "../lib/intro.js";

// First-visit intro: "model meets data". Noisy measurements are recorded
// across a plot, then a model curve searches its way onto them while the
// residuals shrink and R² (computed live against the points) climbs. When the
// fit settles, the curve flattens into a straight rule and flies up to become
// the ruled line under the hero's top row, as the page fades in around it.
// The signal is synthetic and labeled as such. Click, tap, or press a key to
// skip. Once per session; never under reduced motion. Purely visual, so it is
// hidden from assistive technology.

const RECORD_MS = 750;
const FIT_MS = 1450;
const MAX_WAIT = 2600; // never wait longer than this for fonts
const FLATTEN_MS = 380;
const FLY_MS = 900;
const SETTLE_MS = 260;

// Plot geometry (SVG user units)
const W = 800;
const H = 360;
const X0 = 46;
const X1 = W - 14;
const YT = 18;
const YB = H - 34;
const YMIN = -0.85;
const YMAX = 0.85;
const tx = (t) => X0 + t * (X1 - X0);
const ty = (y) => YB - ((y - YMIN) / (YMAX - YMIN)) * (YB - YT);

// The "true" process and the model's starting guess.
const TRUE = { A: 0.62, w: 3.1, phi: 0.35, tau: 0.55, b: 0.3 };
const GUESS = { A: 0, w: 1.6, phi: -0.8, tau: 0.55, b: 0 };
const N = 64;
const SAMPLES = 180;

function model(t, p) {
  return p.A * Math.exp(-t / p.tau) * Math.sin(2 * Math.PI * p.w * t + p.phi) + p.b * (t - 0.5);
}

// Deterministic noise, so every visit records the same data.
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeData() {
  const r = rng(1933);
  return Array.from({ length: N }, (_, i) => {
    const t = (i + 0.5) / N;
    const g = Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r()); // Box–Muller
    return [t, model(t, TRUE) + 0.07 * g];
  });
}

// An optimizer-like approach: each parameter overshoots a little and settles.
const settle = (u, rate, wobble) => 1 - Math.exp(-rate * u) * Math.cos(wobble * u);
function paramsAt(u) {
  if (u >= 1) return TRUE;
  const mix = (k, s) => GUESS[k] + (TRUE[k] - GUESS[k]) * s;
  return {
    A: mix("A", settle(u, 4.2, 7)),
    w: mix("w", settle(u, 5.5, 11)),
    phi: mix("phi", settle(u, 4.8, 9)),
    tau: TRUE.tau,
    b: mix("b", settle(u, 3.6, 5)),
  };
}

function pathFor(p, flat = 1) {
  let d = "";
  for (let k = 0; k <= SAMPLES; k++) {
    const t = k / SAMPLES;
    d += `${k ? "L" : "M"}${tx(t).toFixed(1)} ${ty(model(t, p) * flat).toFixed(1)}`;
  }
  return d;
}

function rSquared(data, p) {
  const mean = data.reduce((s, [, y]) => s + y, 0) / data.length;
  let res = 0;
  let tot = 0;
  for (const [t, y] of data) {
    res += (y - model(t, p)) ** 2;
    tot += (y - mean) ** 2;
  }
  return Math.max(0, 1 - res / tot);
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Loader() {
  const [phase, setPhase] = useState(INTRO ? "run" : "done");
  const data = useMemo(() => (INTRO ? makeData() : []), []);

  const svg = useRef(null);
  const curve = useRef(null);
  const pts = useRef([]);
  const res = useRef([]);
  const rule = useRef(null);
  const r2 = useRef(null);
  const status = useRef(null);
  const meta = useRef(null);
  const skip = useRef(false);

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("is-loading", phase === "run" || phase === "flatten");
    html.classList.toggle("is-intro", phase !== "done" && phase !== "settle");
  }, [phase]);

  useEffect(() => {
    if (phase !== "run") return;
    let frame;
    let ready = false;
    let fitting = false;
    const start = performance.now();
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, MAX_WAIT))]).then(
      () => (ready = true)
    );
    const onSkip = () => (skip.current = true);
    window.addEventListener("keydown", onSkip);

    const draw = (p) => {
      curve.current.setAttribute("d", pathFor(p));
      data.forEach(([t, y], i) => {
        const l = res.current[i];
        l.setAttribute("y2", ty(model(t, p)).toFixed(1));
      });
      r2.current.textContent = rSquared(data, p).toFixed(2);
    };

    const tick = (now) => {
      const el = skip.current ? RECORD_MS + FIT_MS : now - start;
      // 1. Recording: points arrive left to right.
      const shown = Math.min(N, Math.ceil((el / RECORD_MS) * N));
      for (let i = 0; i < shown; i++) pts.current[i]?.classList.add("is-on");
      if (el < RECORD_MS) {
        meta.current.textContent = `n = ${shown}`;
      } else {
        // 2. Fitting: the model walks onto the data.
        if (!fitting) {
          fitting = true;
          svg.current.classList.add("is-fitting");
          status.current.textContent = "Fitting model";
        }
        const u = Math.min(1, (el - RECORD_MS) / FIT_MS);
        draw(paramsAt(u));
        meta.current.textContent = `n = ${N} · iteration ${Math.round(u * 64)}`;
        if (u >= 1) {
          status.current.textContent = "Model fits data";
          if (ready || skip.current) {
            finish();
            return;
          }
        }
      }
      frame = requestAnimationFrame(tick);
    };
    status.current.textContent = "Acquiring data";
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onSkip);
    };
  }, [phase]);

  // 3. Hand-off: flatten the fitted curve into a rule, then fly it to the hero.
  function finish() {
    markIntroSeen();
    setPhase("flatten");
    svg.current.classList.add("is-flat");
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / FLATTEN_MS);
      curve.current.setAttribute("d", pathFor(TRUE, 1 - easeInOut(k)));
      if (k < 1) requestAnimationFrame(step);
      else fly();
    };
    requestAnimationFrame(step);
  }

  function fly() {
    const target = document.querySelector(".hero__top");
    const t = target?.getBoundingClientRect();
    const s = svg.current.getBoundingClientRect();
    const scale = s.width / W;
    const from = { left: s.left + X0 * scale, top: s.top + ty(0) * scale, width: (X1 - X0) * scale };
    const fits = t && t.width > 0 && t.bottom > 0 && t.bottom < window.innerHeight;
    if (!fits) {
      setPhase("lift");
      setTimeout(() => setPhase("done"), 900);
      return;
    }
    const r = rule.current;
    r.style.left = `${from.left}px`;
    r.style.top = `${from.top}px`;
    r.style.width = `${from.width}px`;
    r.classList.add("is-on");
    curve.current.style.opacity = "0";
    // Next frame: send it to the hero's rule (the bottom border of .hero__top).
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        r.style.transform = `translate(${t.left - from.left}px, ${t.bottom - 1 - from.top}px) scaleX(${
          t.width / from.width
        })`;
        setPhase("fly");
      })
    );
    setTimeout(() => {
      setPhase("settle");
      setTimeout(() => setPhase("done"), SETTLE_MS);
    }, FLY_MS + 40);
  }

  if (phase === "done") return null;
  return (
    <div className={`loader is-${phase}`} aria-hidden="true" onClick={() => (skip.current = true)}>
      <div className="loader__bg" />

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
            <span className="loader__r2" ref={r2}>
              0.00
            </span>
            <span className="loader__meta" ref={meta}>
              n = 0
            </span>
          </div>
          <div className="loader__words">
            <p className="loader__line-1">
              Models of how the body works,
              <br />
              checked against real data.
            </p>
            <span className="loader__skip loader__skip--pointer">Click or press any key to skip</span>
            <span className="loader__skip loader__skip--touch">Tap to skip</span>
          </div>
        </div>
      </div>

      <div className="loader__stage">
        <svg ref={svg} className="loader__plot" viewBox={`0 0 ${W} ${H}`}>
          {[-0.5, 0, 0.5].map((y) => (
            <line key={y} className="loader__grid" x1={X0} x2={X1} y1={ty(y)} y2={ty(y)} />
          ))}
          <path className="loader__axes" d={`M${X0} ${YT}V${YB}H${X1}`} />
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line key={t} className="loader__axes" x1={tx(t)} x2={tx(t)} y1={YB} y2={YB + 5} />
          ))}
          <text className="loader__axis-label" x={X0 + 6} y={YT + 10}>
            signal
          </text>
          <text className="loader__axis-label" x={X1} y={YB + 24} textAnchor="end">
            time →
          </text>
          {data.map(([t, y], i) => (
            <line
              key={`r${i}`}
              ref={(el) => (res.current[i] = el)}
              className="loader__res"
              x1={tx(t)}
              x2={tx(t)}
              y1={ty(y)}
              y2={ty(model(t, GUESS))}
            />
          ))}
          <path ref={curve} className="loader__curve" d={pathFor(GUESS)} />
          {data.map(([t, y], i) => (
            <circle
              key={`p${i}`}
              ref={(el) => (pts.current[i] = el)}
              className="loader__pt"
              cx={tx(t)}
              cy={ty(y)}
              r="3.4"
            />
          ))}
        </svg>
        <p className="loader__caption">
          <span>Synthetic signal · model fit · residuals shown</span>
          <span className="loader__legend">
            <i className="loader__key-pt" /> data <i className="loader__key-line" /> model
          </span>
        </p>
      </div>

      <span ref={rule} className="loader__rule" />
    </div>
  );
}

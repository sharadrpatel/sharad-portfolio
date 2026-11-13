import { useEffect, useRef, useState } from "react";
import { introPending, finishIntro } from "../lib/motion.js";

// Opening sequence, once per session: the strange attractor of a forced
// Duffing oscillator assembles itself one drive period at a time, then the
// curtain lifts on the page. Click, tap or press a key to skip. It is purely
// visual, so it is hidden from assistive technology, and it never plays under
// reduced motion (index.html decides that before first paint).
//
//   x'' + δx' − x + x³ = γ cos ωt,   δ = 0.25, γ = 0.3, ω = 1
//
// Strobing the motion once per drive period gives the Poincaré section drawn here.

const PERIODS = 2600;
const DRAW_MS = 2100;
const LIFT_MS = 750;

function poincare() {
  const d = 0.25, g = 0.3, w = 1;
  const f = (t, x, v) => -d * v + x - x * x * x + g * Math.cos(w * t);
  const steps = 48, h = (2 * Math.PI) / w / steps;
  let x = 0.1, v = 0, t = 0;
  const pts = [];
  for (let n = 0; n < PERIODS + 60; n++) {
    for (let s = 0; s < steps; s++) {
      const k1x = v, k1v = f(t, x, v);
      const k2x = v + (h / 2) * k1v, k2v = f(t + h / 2, x + (h / 2) * k1x, v + (h / 2) * k1v);
      const k3x = v + (h / 2) * k2v, k3v = f(t + h / 2, x + (h / 2) * k2x, v + (h / 2) * k2v);
      const k4x = v + h * k3v, k4v = f(t + h, x + h * k3x, v + h * k3v);
      x += (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
      v += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
      t += h;
    }
    if (n >= 60) pts.push([x, v]); // skip the transient
  }
  return pts;
}

export default function Intro() {
  const [phase, setPhase] = useState(() => (introPending() ? "draw" : "done"));
  const canvas = useRef(null);
  const count = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    if (phase !== "draw") return;
    const pts = poincare();
    const cv = canvas.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const size = Math.min(W * 0.9, H * 0.88);
    const X = (x) => W / 2 + (x / 1.75) * (size / 2) * Math.min(1.7, (W * 0.92) / size);
    const Y = (v) => H / 2 - (v / 1.15) * (size / 2) * 0.72;

    let drawn = 0, raf = 0, lift = 0;
    const t0 = performance.now();
    const end = () => {
      cancelAnimationFrame(raf);
      setPhase("lift");
      finishIntro();
      lift = setTimeout(() => setPhase("done"), LIFT_MS);
    };
    const tick = (now) => {
      const u = Math.min(1, (now - t0) / DRAW_MS);
      const upto = Math.floor(PERIODS * u * u * (3 - 2 * u));
      for (; drawn < upto; drawn++) {
        const [x, v] = pts[drawn];
        ctx.fillStyle = drawn % 9 === 0 ? "#f2b84b" : "rgba(236,235,230,0.72)";
        ctx.beginPath();
        ctx.arc(X(x), Y(v), drawn % 9 === 0 ? 1.5 : 1.05, 0, 6.2832);
        ctx.fill();
      }
      if (count.current) count.current.textContent = String(drawn).padStart(4, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${u})`;
      if (u < 1) raf = requestAnimationFrame(tick);
      else lift = setTimeout(end, 260);
    };
    raf = requestAnimationFrame(tick);

    const skip = () => {
      clearTimeout(lift);
      end();
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "done") return null;
  return (
    <div className={`intro ${phase === "lift" ? "is-lifting" : ""}`} aria-hidden="true">
      <canvas ref={canvas} />
      <p className="intro__name">Sanandan Ojha</p>
      <p className="intro__eq">x″ + δx′ − x + x³ = γ cos ωt</p>
      <p className="intro__label">Duffing oscillator · Poincaré section</p>
      <p className="intro__count"><span ref={count}>0000</span> / {PERIODS} periods</p>
      <span className="intro__bar" ref={bar} />
    </div>
  );
}

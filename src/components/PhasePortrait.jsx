import { useMemo, useState, useId } from "react";

// The hero's plate: a forced Duffing oscillator, x'' + δx' − x + x³ = γ cos ωt,
// integrated in the browser with RK4 and drawn in phase space (x against x').
// Visitors can change the forcing strength γ; damping and drive frequency stay
// fixed. The readout only reports what this run of the simulation did.
const DELTA = 0.3;
const OMEGA = 1.2;
const GAMMA_DEFAULT = 0.5;

function simulate(gamma) {
  const steps = 48; // per drive period
  const dt = (2 * Math.PI) / OMEGA / steps;
  const f = (t, x, v) => [v, -DELTA * v + x - x * x * x + gamma * Math.cos(OMEGA * t)];
  let t = 0;
  let x = 1;
  let v = 0;
  const pts = [];
  const total = steps * 110;
  const skip = steps * 30; // let the transient die out
  for (let i = 0; i < total; i++) {
    const [k1x, k1v] = f(t, x, v);
    const [k2x, k2v] = f(t + dt / 2, x + (dt / 2) * k1x, v + (dt / 2) * k1v);
    const [k3x, k3v] = f(t + dt / 2, x + (dt / 2) * k2x, v + (dt / 2) * k2v);
    const [k4x, k4v] = f(t + dt, x + dt * k3x, v + dt * k3v);
    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    v += (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    t += dt;
    if (i >= skip) pts.push([x, v]);
  }
  return pts;
}

const SIZE = 400;
const PAD = 28;
// Fixed scale so the drawing doesn't jump around as γ changes.
const XR = 1.75;
const VR = 1.4;
const sx = (x) => SIZE / 2 + (x / XR) * (SIZE / 2 - PAD);
const sy = (v) => SIZE / 2 - (v / VR) * (SIZE / 2 - PAD);

function describe(pts) {
  let crossings = 0;
  for (let i = 1; i < pts.length; i++) if (Math.sign(pts[i][0]) !== Math.sign(pts[i - 1][0])) crossings++;
  return crossings === 0 ? "stays in one well" : "hops between wells";
}

export default function PhasePortrait() {
  const [gamma, setGamma] = useState(GAMMA_DEFAULT);
  const [run, setRun] = useState(0);
  const [drawing, setDrawing] = useState(true);
  const uid = useId();

  const { d, regime } = useMemo(() => {
    const pts = simulate(gamma);
    const clip = (p) => Math.max(PAD / 2, Math.min(SIZE - PAD / 2, p));
    const d = "M" + pts.map(([x, v]) => `${clip(sx(x)).toFixed(1)} ${clip(sy(v)).toFixed(1)}`).join("L");
    return { d, regime: describe(pts) };
  }, [gamma]);

  const c = SIZE / 2;
  const ticks = [-1, 1];
  return (
    <div className="phase-plate">
      <svg className="phase" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby={`${uid}-t`}>
        <title id={`${uid}-t`}>
          Phase portrait of a forced Duffing oscillator with forcing strength {gamma.toFixed(2)}: the trajectory{" "}
          {regime}.
        </title>
        <line className="phase__axis" x1={PAD / 2} x2={SIZE - PAD / 2} y1={c} y2={c} />
        <line className="phase__axis" x1={c} x2={c} y1={PAD / 2} y2={SIZE - PAD / 2} />
        {ticks.map((t) => (
          <g key={t}>
            <line className="phase__axis" x1={sx(t)} x2={sx(t)} y1={c - 4} y2={c + 4} />
            <text className="phase__label" x={sx(t)} y={c + 18} textAnchor="middle">
              {t > 0 ? "+1" : "−1"}
            </text>
          </g>
        ))}
        <path
          key={run}
          className={`phase__line ${drawing ? "is-drawing" : ""}`}
          d={d}
          pathLength="1"
          onAnimationEnd={() => setDrawing(false)}
        />
        {ticks.map((t) => (
          <circle key={t} className="phase__well" cx={sx(t)} cy={sy(0)} r="3" />
        ))}
        <text className="phase__label" x={SIZE - PAD / 2} y={c - 8} textAnchor="end">
          x
        </text>
        <text className="phase__label" x={c + 8} y={PAD / 2 + 8}>
          ẋ
        </text>
      </svg>

      <div className="phase__controls">
        <label className="phase__slider" htmlFor={`${uid}-g`}>
          <span className="phase__key">
            Forcing <i>γ</i>
          </span>
          <input
            id={`${uid}-g`}
            type="range"
            min="0.1"
            max="0.6"
            step="0.01"
            value={gamma}
            aria-valuetext={`${gamma.toFixed(2)}, the motion ${regime}`}
            onChange={(e) => {
              setDrawing(false);
              setGamma(parseFloat(e.target.value));
            }}
            style={{ "--fill": `${((gamma - 0.1) / 0.5) * 100}%` }}
          />
          <output className="phase__value">{gamma.toFixed(2)}</output>
        </label>
        <button
          type="button"
          className="phase__replay"
          onClick={() => {
            setDrawing(true);
            setRun((r) => r + 1);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M10 6a4 4 0 1 1-1.2-2.85M10 1.5v2.5H7.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          Replay
        </button>
      </div>
      <p className="phase__readout" aria-hidden="true">
        <span>
          δ = {DELTA} · ω = {OMEGA}
        </span>
        <span>{regime}</span>
      </p>
    </div>
  );
}

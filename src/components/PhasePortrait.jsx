import { useMemo } from "react";

// The hero's plate: a forced Duffing oscillator, x'' + δx' − x + x³ = γ cos ωt,
// integrated in the browser with RK4 and drawn in phase space (x against x').
// Parameters sit in a commonly used chaotic range; the drawing is illustrative.
const DELTA = 0.3;
const GAMMA = 0.5;
const OMEGA = 1.2;

function simulate() {
  const steps = 48; // per drive period
  const dt = (2 * Math.PI) / OMEGA / steps;
  const f = (t, x, v) => [v, -DELTA * v + x - x * x * x + GAMMA * Math.cos(OMEGA * t)];
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

export default function PhasePortrait() {
  const { d, sx, sy } = useMemo(() => {
    const pts = simulate();
    const xr = Math.max(...pts.map((p) => Math.abs(p[0]))) * 1.08;
    const vr = Math.max(...pts.map((p) => Math.abs(p[1]))) * 1.08;
    const sx = (x) => SIZE / 2 + (x / xr) * (SIZE / 2 - PAD);
    const sy = (v) => SIZE / 2 - (v / vr) * (SIZE / 2 - PAD);
    const d = "M" + pts.map(([x, v]) => `${sx(x).toFixed(1)} ${sy(v).toFixed(1)}`).join("L");
    return { d, sx, sy };
  }, []);

  const c = SIZE / 2;
  const ticks = [-1, 1];
  return (
    <svg className="phase" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby="phase-title">
      <title id="phase-title">
        A tangled trajectory looping around two centers, left and right: the phase portrait of a forced Duffing
        oscillator hopping between its two wells.
      </title>
      <line className="phase__axis" x1={PAD / 2} x2={SIZE - PAD / 2} y1={c} y2={c} />
      <line className="phase__axis" x1={c} x2={c} y1={PAD / 2} y2={SIZE - PAD / 2} />
      {ticks.map((t) => (
        <g key={t}>
          <line className="phase__axis" x1={sx(t)} x2={sx(t)} y1={c - 4} y2={c + 4} />
          <text className="phase__label" x={sx(t)} y={c + 16} textAnchor="middle">
            {t > 0 ? "+1" : "−1"}
          </text>
        </g>
      ))}
      <path className="phase__line" d={d} pathLength="1" />
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
  );
}

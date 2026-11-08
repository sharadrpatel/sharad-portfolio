// Forced Duffing oscillator, x'' + δx' − x + x³ = γ cos ωt, integrated with
// RK4. Shared by the hero figure and the intro screen so both draw the exact
// same trajectory in the same coordinates.
export const DELTA = 0.3;
export const OMEGA = 1.2;
export const GAMMA_DEFAULT = 0.5;
export const STEPS_PER_PERIOD = 48;
const PERIODS = 110;
const TRANSIENT = 30; // periods discarded while the start-up transient dies out

export const DT = (2 * Math.PI) / OMEGA / STEPS_PER_PERIOD;
export const T0 = TRANSIENT * STEPS_PER_PERIOD * DT; // time of the first plotted point

export function simulate(gamma) {
  const f = (t, x, v) => [v, -DELTA * v + x - x * x * x + gamma * Math.cos(OMEGA * t)];
  let t = 0;
  let x = 1;
  let v = 0;
  const pts = [];
  const total = STEPS_PER_PERIOD * PERIODS;
  const skip = STEPS_PER_PERIOD * TRANSIENT;
  for (let i = 0; i < total; i++) {
    const [k1x, k1v] = f(t, x, v);
    const [k2x, k2v] = f(t + DT / 2, x + (DT / 2) * k1x, v + (DT / 2) * k1v);
    const [k3x, k3v] = f(t + DT / 2, x + (DT / 2) * k2x, v + (DT / 2) * k2v);
    const [k4x, k4v] = f(t + DT, x + DT * k3x, v + DT * k3v);
    x += (DT / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    v += (DT / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    t += DT;
    if (i >= skip) pts.push([x, v]);
  }
  return pts;
}

// Drawing geometry: a fixed scale, so the picture doesn't jump as γ changes.
export const SIZE = 400;
export const PAD = 28;
const XR = 1.75;
const VR = 1.4;
export const sx = (x) => SIZE / 2 + (x / XR) * (SIZE / 2 - PAD);
export const sy = (v) => SIZE / 2 - (v / VR) * (SIZE / 2 - PAD);
const clip = (p) => Math.max(PAD / 2, Math.min(SIZE - PAD / 2, p));

// Screen points and the SVG path through them.
export function trace(gamma) {
  const pts = simulate(gamma);
  const xy = pts.map(([x, v]) => [clip(sx(x)), clip(sy(v))]);
  const d = "M" + xy.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join("L");
  let crossings = 0;
  for (let i = 1; i < pts.length; i++) if (Math.sign(pts[i][0]) !== Math.sign(pts[i - 1][0])) crossings++;
  return { pts, xy, d, regime: crossings === 0 ? "stays in one well" : "hops between wells" };
}

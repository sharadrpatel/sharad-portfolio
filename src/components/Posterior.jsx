import { useEffect, useRef, useState, useCallback } from "react";
import { whenReady } from "../lib/motion.js";

// A live ABC-SMC run on a toy problem: fit the growth rate r and carrying
// capacity K of a logistic curve to noisy synthetic data. Everything drawn
// here is computed in the browser; none of it is research data.

const PRIOR = { r: [0.2, 2.0], K: [0.4, 1.6] };
const Y0 = 0.06;
const TS = Array.from({ length: 12 }, (_, i) => (i * 10) / 11);
const N = 170;
const GENERATIONS = 5;

const model = (r, K, t) => K / (1 + ((K - Y0) / Y0) * Math.exp(-r * t));
const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
const uniform = ([a, b]) => a + Math.random() * (b - a);
const inPrior = (p) => p.r >= PRIOR.r[0] && p.r <= PRIOR.r[1] && p.K >= PRIOR.K[0] && p.K <= PRIOR.K[1];

function distance(p, data) {
  let s = 0;
  for (let i = 0; i < TS.length; i++) s += (model(p.r, p.K, TS[i]) - data[i]) ** 2;
  return Math.sqrt(s / TS.length);
}

function moments(pop) {
  const out = {};
  for (const k of ["r", "K"]) {
    const mean = pop.reduce((s, p) => s + p.w * p[k], 0);
    const v = pop.reduce((s, p) => s + p.w * (p[k] - mean) ** 2, 0);
    out[k] = { mean, sd: Math.sqrt(v) };
  }
  return out;
}

// Runs the whole algorithm up front (it takes a few milliseconds) and returns
// every generation, so the animation only has to play them back.
function runSMC() {
  const truth = { r: 0.55 + Math.random() * 0.9, K: 0.7 + Math.random() * 0.6 };
  const data = TS.map((t) => model(truth.r, truth.K, t) + 0.06 * gauss());

  let pop = Array.from({ length: N }, () => {
    const p = { r: uniform(PRIOR.r), K: uniform(PRIOR.K), w: 1 / N };
    p.d = distance(p, data);
    return p;
  });
  const gens = [{ pop, eps: null, m: moments(pop) }];

  for (let g = 1; g <= GENERATIONS; g++) {
    const sorted = pop.map((p) => p.d).sort((a, b) => a - b);
    const eps = sorted[Math.floor(N * 0.4)];
    const m = moments(pop);
    const sig = { r: Math.SQRT2 * m.r.sd + 1e-4, K: Math.SQRT2 * m.K.sd + 1e-4 };
    const cdf = [];
    pop.reduce((s, p, i) => (cdf[i] = s + p.w), 0);

    const next = [];
    let tries = 0;
    while (next.length < N && tries < 60000) {
      tries++;
      const u = Math.random() * cdf[N - 1];
      const base = pop[cdf.findIndex((c) => c >= u)];
      const p = { r: base.r + sig.r * gauss(), K: base.K + sig.K * gauss() };
      if (!inPrior(p)) continue;
      p.d = distance(p, data);
      if (p.d > eps) continue;
      // Importance weight: flat prior over the perturbation kernel mixture.
      let den = 0;
      for (const q of pop) den += q.w * Math.exp(-0.5 * (((p.r - q.r) / sig.r) ** 2 + ((p.K - q.K) / sig.K) ** 2));
      p.w = 1 / den;
      next.push(p);
    }
    if (next.length < N) break;
    const total = next.reduce((s, p) => s + p.w, 0);
    next.forEach((p) => (p.w /= total));
    pop = next;
    gens.push({ pop, eps, m: moments(pop) });
  }
  return { truth, data, gens };
}

function setup(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: width, h: height };
}

function palette(el) {
  const cs = getComputedStyle(el);
  const v = (n) => cs.getPropertyValue(n).trim();
  return { ink: v("--ink"), soft: v("--ink-soft"), line: v("--line"), accent: v("--accent"), cool: v("--cool"), mono: v("--mono") };
}

const PAD = { l: 34, r: 10, t: 12, b: 28 };

function axes(ctx, w, h, c, xl, yl, xt, yt) {
  ctx.strokeStyle = c.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD.l, PAD.t);
  ctx.lineTo(PAD.l, h - PAD.b);
  ctx.lineTo(w - PAD.r, h - PAD.b);
  ctx.stroke();
  ctx.fillStyle = c.soft;
  ctx.font = `10px ${c.mono}`;
  ctx.textAlign = "center";
  xt.forEach(([px, label]) => ctx.fillText(label, px, h - PAD.b + 13));
  ctx.fillText(xl, (PAD.l + w - PAD.r) / 2, h - 3);
  ctx.textAlign = "right";
  yt.forEach(([py, label]) => ctx.fillText(label, PAD.l - 5, py + 3));
  ctx.save();
  ctx.translate(9, (PAD.t + h - PAD.b) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText(yl, 0, 0);
  ctx.restore();
}

function draw(spaceCv, fitCv, run, gi, a) {
  const c = palette(spaceCv);
  const cur = run.gens[gi];
  const prev = gi > 0 ? run.gens[gi - 1] : null;

  // Parameter space.
  {
    const { ctx, w, h } = setup(spaceCv);
    const X = (r) => PAD.l + ((r - PRIOR.r[0]) / (PRIOR.r[1] - PRIOR.r[0])) * (w - PAD.l - PAD.r);
    const Y = (K) => h - PAD.b - ((K - PRIOR.K[0]) / (PRIOR.K[1] - PRIOR.K[0])) * (h - PAD.t - PAD.b);
    ctx.clearRect(0, 0, w, h);
    axes(ctx, w, h, c, "growth rate r", "capacity K",
      [0.5, 1, 1.5, 2].map((v) => [X(v), v.toFixed(1)]),
      [0.5, 1, 1.5].map((v) => [Y(v), v.toFixed(1)]));
    const dots = (pop, color, alpha, rad) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      for (const p of pop) {
        ctx.beginPath();
        ctx.arc(X(p.r), Y(p.K), rad, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    if (prev) dots(prev.pop, c.soft, 0.28 * (1 - a) + 0.1, 1.6);
    dots(cur.pop, gi === 0 ? c.soft : c.accent, (gi === 0 ? 0.55 : 0.8) * a, 2.1);
    // The value the data were generated from.
    const tx = X(run.truth.r), ty = Y(run.truth.K);
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tx - 7, ty); ctx.lineTo(tx + 7, ty);
    ctx.moveTo(tx, ty - 7); ctx.lineTo(tx, ty + 7);
    ctx.stroke();
  }

  // Data and the fits the current population implies.
  {
    const { ctx, w, h } = setup(fitCv);
    const X = (t) => PAD.l + (t / 10) * (w - PAD.l - PAD.r);
    const Y = (y) => h - PAD.b - (y / 1.7) * (h - PAD.t - PAD.b);
    ctx.clearRect(0, 0, w, h);
    axes(ctx, w, h, c, "time", "population",
      [0, 5, 10].map((v) => [X(v), String(v)]),
      [0, 0.5, 1, 1.5].map((v) => [Y(v), v.toFixed(1)]));
    ctx.save();
    ctx.beginPath();
    ctx.rect(PAD.l, PAD.t, w - PAD.l - PAD.r, h - PAD.t - PAD.b);
    ctx.clip();
    ctx.strokeStyle = gi === 0 ? c.soft : c.accent;
    ctx.lineWidth = 1;
    ctx.globalAlpha = (gi === 0 ? 0.13 : 0.16) * a + 0.02;
    for (let i = 0; i < cur.pop.length; i += 3) {
      const p = cur.pop[i];
      ctx.beginPath();
      for (let s = 0; s <= 40; s++) {
        const t = s / 4;
        const y = Y(model(p.r, p.K, t));
        s ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y);
      }
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.ink;
    run.data.forEach((y, i) => {
      ctx.beginPath();
      ctx.arc(X(TS[i]), Y(y), 2.6, 0, 6.2832);
      ctx.fill();
    });
  }
}

export default function Posterior() {
  const spaceRef = useRef(null);
  const fitRef = useRef(null);
  const state = useRef({ run: null, gi: 0, raf: 0, timer: 0 });
  const [view, setView] = useState({ gi: 0, total: GENERATIONS, eps: null, m: null, truth: null, done: false });

  const show = useCallback((gi, a = 1) => {
    const s = state.current;
    if (s.run && spaceRef.current) draw(spaceRef.current, fitRef.current, s.run, gi, a);
  }, []);

  const start = useCallback(() => {
    const s = state.current;
    cancelAnimationFrame(s.raf);
    clearTimeout(s.timer);
    s.run = runSMC();
    const last = s.run.gens.length - 1;
    const publish = (gi) => {
      s.gi = gi;
      const g = s.run.gens[gi];
      setView({ gi, total: last, eps: g.eps, m: g.m, truth: s.run.truth, done: gi === last });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      publish(last);
      show(last);
      return;
    }
    const step = (gi) => {
      publish(gi);
      const t0 = performance.now();
      const tick = (now) => {
        const a = Math.min(1, (now - t0) / 650);
        show(gi, a);
        if (a < 1) s.raf = requestAnimationFrame(tick);
        else if (gi < last) s.timer = setTimeout(() => step(gi + 1), gi === 0 ? 1300 : 800);
      };
      s.raf = requestAnimationFrame(tick);
    };
    step(0);
  }, [show]);

  useEffect(() => {
    const off = whenReady(start);
    const redraw = () => show(state.current.gi);
    window.addEventListener("resize", redraw);
    const mo = new MutationObserver(redraw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.fonts?.ready.then(redraw);
    return () => {
      off();
      window.removeEventListener("resize", redraw);
      mo.disconnect();
      cancelAnimationFrame(state.current.raf);
      clearTimeout(state.current.timer);
    };
  }, [start, show]);

  const f = (x) => x.toFixed(2);
  return (
    <figure className="post">
      <div className="post__head">
        <span className="post__live" aria-hidden="true" />
        <span>Live · ABC-SMC on a toy model</span>
        <button type="button" className="post__again" onClick={start}>
          New data ↻
        </button>
      </div>
      <div className="post__plots">
        <div>
          <canvas ref={spaceRef} role="img" aria-label="Scatter of candidate parameter pairs contracting toward the true value over successive generations." />
          <p className="post__cap">Parameter space. <i>+</i> marks the true value.</p>
        </div>
        <div>
          <canvas ref={fitRef} role="img" aria-label="Noisy data points with the model curves implied by the current candidates." />
          <p className="post__cap">Data, and the fits the candidates imply.</p>
        </div>
      </div>
      <dl className="post__read" aria-live="off">
        <div>
          <dt>generation</dt>
          <dd>{view.gi === 0 ? "prior" : `${view.gi} / ${view.total}`}</dd>
        </div>
        <div>
          <dt>tolerance ε</dt>
          <dd>{view.eps == null ? "∞" : view.eps.toFixed(3)}</dd>
        </div>
        <div>
          <dt>r</dt>
          <dd>{view.m ? `${f(view.m.r.mean)} ± ${f(view.m.r.sd)}` : "…"}<small>{view.truth ? ` true ${f(view.truth.r)}` : ""}</small></dd>
        </div>
        <div>
          <dt>K</dt>
          <dd>{view.m ? `${f(view.m.K.mean)} ± ${f(view.m.K.sd)}` : "…"}<small>{view.truth ? ` true ${f(view.truth.K)}` : ""}</small></dd>
        </div>
      </dl>
      <figcaption>
        Each dot is a guess at two unknown parameters. Every generation keeps only the guesses whose simulation lands
        within ε of the data, then tightens ε. What survives approximates the posterior. This is the inference method
        behind my cell migration research, running here on synthetic data.
      </figcaption>
    </figure>
  );
}

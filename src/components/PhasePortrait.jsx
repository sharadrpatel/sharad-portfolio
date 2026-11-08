import { useEffect, useMemo, useRef, useState, useId } from "react";
import { DELTA, OMEGA, DT, GAMMA_DEFAULT, SIZE, PAD, sx, sy, trace } from "../lib/duffing.js";
import { useScrub } from "../lib/scroll.js";

// The hero's plate: a forced Duffing oscillator integrated in the browser and
// drawn in phase space (x against x'). Two things are live:
// - γ, the forcing strength, on a slider; the readout reports what this run did.
// - Time, on the scroll wheel: scrolling moves a comet along the trajectory and
//   scrolling back rewinds it.
const TAIL = 70;

export default function PhasePortrait() {
  const [gamma, setGamma] = useState(GAMMA_DEFAULT);
  const [run, setRun] = useState(0);
  const [drawing, setDrawing] = useState(true);
  const uid = useId();

  const { xy, d, regime } = useMemo(() => trace(gamma), [gamma]);

  const head = useRef(null);
  const tail = useRef(null);
  const clock = useRef(null);
  const last = useRef(0);
  const xyRef = useRef(xy);
  xyRef.current = xy;

  const place = (p) => {
    last.current = p;
    const pts = xyRef.current;
    const i = Math.round(p * (pts.length - 1));
    const [x, y] = pts[i];
    head.current?.setAttribute("cx", x.toFixed(1));
    head.current?.setAttribute("cy", y.toFixed(1));
    const from = Math.max(0, i - TAIL);
    tail.current?.setAttribute(
      "d",
      i > 0 ? "M" + pts.slice(from, i + 1).map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join("L") : ""
    );
    if (clock.current) clock.current.textContent = `t = ${(i * DT).toFixed(1)}`;
  };

  const plate = useScrub("page", { span: 1.1, onProgress: place });
  useEffect(() => place(last.current), [xy]);

  const c = SIZE / 2;
  const ticks = [-1, 1];
  return (
    <div className="phase-plate" ref={plate}>
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
        <path ref={tail} className="phase__tail" d="" />
        <circle ref={head} className="phase__head" cx={xy[0][0]} cy={xy[0][1]} r="4" />
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
          <span ref={clock} className="phase__clock">t = 0.0</span> · δ = {DELTA} · ω = {OMEGA}
        </span>
        <span>{regime}</span>
      </p>
    </div>
  );
}

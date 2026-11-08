import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { INTRO, markIntroSeen } from "../lib/intro.js";
import { trace, GAMMA_DEFAULT, SIZE, PAD, DT, sx, sy } from "../lib/duffing.js";

const DRAW_MS = 1800; // the integration "runs" for this long
const MAX_WAIT = 2600; // never wait longer than this for fonts
const FLY_MS = 1150; // drawing flies into the hero
const SETTLE_MS = 300; // cross-fade with the hero's own copy

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// First-visit intro. It runs the same Duffing simulation the hero shows and
// draws the trajectory as the progress indicator, with live step and time
// counters. When it finishes, the drawing flies into its place in the hero and
// the page fades in around it. Click or press any key to skip. Once per
// session; never under reduced motion. Purely visual, so hidden from assistive
// technology.
export default function Loader() {
  const [phase, setPhase] = useState(INTRO ? "drawing" : "done");
  const { d, xy } = useMemo(() => (INTRO ? trace(GAMMA_DEFAULT) : { d: "", xy: [] }), []);
  const root = useRef(null);
  const art = useRef(null);
  const line = useRef(null);
  const head = useRef(null);
  const count = useRef(null);
  const steps = useRef(null);
  const clock = useRef(null);
  const skip = useRef(false);

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("is-loading", phase === "drawing");
    html.classList.toggle("is-intro", phase !== "done" && phase !== "settle");
  }, [phase]);

  // Drawing: progress is written straight to the DOM, once per frame.
  useEffect(() => {
    if (phase !== "drawing") return;
    let frame;
    let ready = false;
    const start = performance.now();
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, MAX_WAIT))]).then(
      () => (ready = true)
    );
    const onSkip = () => (skip.current = true);
    window.addEventListener("keydown", onSkip);
    const n = xy.length - 1;
    const tick = (now) => {
      const t = skip.current ? 1 : Math.min(1, (now - start) / DRAW_MS);
      const p = ease(t);
      const i = Math.round(p * n);
      line.current.style.strokeDashoffset = String(1 - p);
      head.current.setAttribute("cx", xy[i][0].toFixed(1));
      head.current.setAttribute("cy", xy[i][1].toFixed(1));
      count.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      steps.current.textContent = `${i.toLocaleString("en-US")} / ${n.toLocaleString("en-US")}`;
      clock.current.textContent = (i * DT).toFixed(1);
      if (t < 1 || !(ready || skip.current)) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onSkip);
    };
  }, [phase]);

  function finish() {
    markIntroSeen();
    const target = document.querySelector(".hero__figure .phase");
    const t = target?.getBoundingClientRect();
    const s = art.current.getBoundingClientRect();
    const fits = t && t.width > 0 && t.top >= 0 && t.bottom <= window.innerHeight && window.innerWidth >= 900;
    if (!fits) {
      setPhase("lift");
      setTimeout(() => setPhase("done"), 950);
      return;
    }
    const k = t.width / s.width;
    art.current.style.transform = `translate(${t.left - s.left}px, ${t.top - s.top}px) scale(${k})`;
    setPhase("fly");
    setTimeout(() => {
      setPhase("settle");
      setTimeout(() => setPhase("done"), SETTLE_MS);
    }, FLY_MS);
  }

  if (phase === "done") return null;
  const c = SIZE / 2;
  return (
    <div
      ref={root}
      className={`loader is-${phase}`}
      aria-hidden="true"
      onClick={() => (skip.current = true)}
    >
      <div className="loader__bg" />

      <div className="loader__chrome wrap">
        <div className="loader__top">
          <span className="wordmark__mark">SP</span>
          <span>Sharad Patel</span>
          <span className="loader__role">Integrating the forced Duffing equation</span>
        </div>
        <div className="loader__bottom">
          <div>
            <span className="loader__count" ref={count}>
              000
            </span>
            <span className="loader__skip loader__skip--pointer">Click or press any key to skip</span>
            <span className="loader__skip loader__skip--touch">Tap to skip</span>
          </div>
          <div className="loader__math">
            <p className="loader__eq">
              ẍ + δẋ − x + x³ = γ cos ωt
            </p>
            <p className="loader__stats">
              <span>RK4 · step <span ref={steps}>0</span></span>
              <span>t = <span ref={clock}>0.0</span></span>
            </p>
          </div>
        </div>
      </div>

      <svg ref={art} className="loader__art" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <line className="loader__axis" x1={PAD / 2} x2={SIZE - PAD / 2} y1={c} y2={c} />
        <line className="loader__axis" x1={c} x2={c} y1={PAD / 2} y2={SIZE - PAD / 2} />
        {[-1, 1].map((v) => (
          <line key={v} className="loader__axis" x1={sx(v)} x2={sx(v)} y1={c - 4} y2={c + 4} />
        ))}
        <path ref={line} className="loader__line" d={d} pathLength="1" />
        {[-1, 1].map((v) => (
          <circle key={v} className="loader__well" cx={sx(v)} cy={sy(0)} r="3" />
        ))}
        <circle ref={head} className="loader__head" cx={xy[0]?.[0]} cy={xy[0]?.[1]} r="4" />
      </svg>
    </div>
  );
}

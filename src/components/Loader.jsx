import { useEffect, useLayoutEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

const KEY = "sp-intro-seen";
const MIN_MS = 1100; // long enough to read, short enough not to annoy
const MAX_MS = 2600; // never wait longer than this for fonts

function shouldShow() {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
}

// First-visit intro: a counter runs to 100 while the fonts load, then the
// panel lifts away and the hero's own entrance plays. Shown once per session
// and never under reduced motion. Purely visual, so hidden from assistive tech.
export default function Loader() {
  const [phase, setPhase] = useState(() => (shouldShow() ? "loading" : "done"));
  const [pct, setPct] = useState(0);

  // Hold the hero's entrance animations until the panel starts to lift.
  useLayoutEffect(() => {
    if (phase === "loading") document.documentElement.classList.add("is-loading");
    else document.documentElement.classList.remove("is-loading");
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    let frame;
    let ready = false;
    const start = performance.now();
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, MAX_MS))]).then(
      () => (ready = true)
    );
    const tick = (now) => {
      const t = Math.min(1, (now - start) / MIN_MS);
      // Ease toward 92 on a clock; the last stretch waits for the fonts.
      let p = 92 * (1 - Math.pow(1 - t, 3));
      if (t >= 1 && ready) p = 100;
      setPct((prev) => Math.max(prev, Math.round(p)));
      if (p < 100) frame = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("leaving"), 180);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode: the intro may show again, which is harmless */
    }
    const t = setTimeout(() => setPhase("done"), 950);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;
  return (
    <div className={`loader ${phase === "leaving" ? "is-leaving" : ""}`} aria-hidden="true">
      <div className="loader__inner wrap">
        <div className="loader__top">
          <span className="wordmark__mark">SP</span>
          <span>Sharad Patel</span>
          <span className="loader__role">Biomedical Engineering · University of Florida</span>
        </div>
        <div className="loader__bottom">
          <span className="loader__count">{String(pct).padStart(3, "0")}</span>
          <span className="loader__note">Research, projects, and writing</span>
        </div>
        <div className="loader__bar">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </div>
    </div>
  );
}

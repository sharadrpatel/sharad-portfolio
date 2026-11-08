import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

// Two bands of methods and tools drifting in opposite directions. They idle
// slowly and speed up with the scroll, then ease back. Decorative (the
// toolkit in About lists the same things), so hidden from assistive tech.
const ROWS = [
  ["OpenSim", "ODE & PDE models", "Monte Carlo", "Sensitivity analysis", "MATLAB", "Python", "Motion capture", "EMG"],
  ["Cell culture", "ELISA", "Immunostaining", "Systematic review", "SolidWorks", "Design controls", "R", "Computer vision"],
];

export default function Ticker() {
  const root = useRef(null);
  const rows = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    let visible = false;
    let frame = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let boost = 0;
    const offset = [0, 0];

    const loop = (now) => {
      frame = 0;
      if (!visible) return;
      const dt = Math.min(64, now - lastT);
      lastT = now;
      const y = window.scrollY;
      const v = Math.abs(y - lastY) / Math.max(1, dt); // px per ms
      lastY = y;
      boost += (Math.min(v * 6, 9) - boost) * 0.08; // eased scroll boost
      rows.current.forEach((row, i) => {
        if (!row) return;
        const half = row.scrollWidth / 2;
        const dir = i % 2 ? 1 : -1;
        offset[i] = (offset[i] + dir * (0.04 + boost * 0.05) * dt) % half;
        const x = dir < 0 ? offset[i] : offset[i] - half;
        row.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
      });
      frame = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !frame) {
        lastT = performance.now();
        lastY = window.scrollY;
        frame = requestAnimationFrame(loop);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={root} className="ticker" aria-hidden="true">
      {ROWS.map((items, i) => (
        <div key={i} className={`ticker__row ${i % 2 ? "ticker__row--alt" : ""}`}>
          <div className="ticker__track" ref={(el) => (rows.current[i] = el)}>
            {[...items, ...items].map((t, k) => (
              <span key={k} className="ticker__item">
                {t}
                <i className="ticker__mark" />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { reduced, whenReady, useProgress } from "../lib/motion.js";

// A number that counts up to its value the first time it is seen.
export function CountUp({ value, decimals = 2, ms = 1300 }) {
  const [shown, setShown] = useState(value);
  const ref = useRef(null);
  useEffect(() => {
    if (reduced()) return;
    setShown(0);
    let raf = 0, io;
    const off = whenReady(() => {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now) => {
          const u = Math.min(1, (now - t0) / ms);
          setShown(value * (1 - Math.pow(1 - u, 3)));
          if (u < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      });
      io.observe(ref.current);
    });
    return () => {
      off();
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, ms]);
  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{shown.toFixed(decimals)}</span>;
}

// Leans its child toward the pointer, and lets go when the pointer leaves.
export function Magnetic({ children, pull = 0.28 }) {
  const ref = useRef(null);
  const move = (e) => {
    if (e.pointerType !== "mouse" || reduced()) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * pull}px, ${(e.clientY - r.top - r.height / 2) * pull}px)`;
  };
  return (
    <span ref={ref} className="magnetic" onPointerMove={move} onPointerLeave={() => (ref.current.style.transform = "")}>
      {children}
    </span>
  );
}

// A passage that inks in word by word as it travels up the screen, and fades
// again on the way back. Screen readers get the plain sentence.
export function Ink({ text, className = "" }) {
  const ref = useProgress("read");
  const words = text.split(" ");
  return (
    <p ref={ref} className={`ink ${className}`} style={{ "--n": words.length }}>
      <span className="sr">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} style={{ "--i": i }}>{w} </span>
        ))}
      </span>
    </p>
  );
}

// Two rows of words that slide in opposite directions as the page scrolls.
export function Ticker({ rows }) {
  const ref = useProgress("through");
  return (
    <div className="ticker" ref={ref} aria-hidden="true">
      {rows.map((row, i) => (
        <p key={i} className={i % 2 ? "ticker__row ticker__row--back" : "ticker__row"}>
          {[...row, ...row, ...row].map((w, j) => (
            <span key={j}>{w}</span>
          ))}
        </p>
      ))}
    </div>
  );
}

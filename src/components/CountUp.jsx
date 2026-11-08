import { useEffect, useState } from "react";
import { useInView, prefersReducedMotion } from "../lib/motion.js";

// Counts the first number in a string up from zero each time it scrolls into view:
// "3.94", "≈ 45%", "0.119/yr". Strings without a number render as they are.
// Screen readers get the final value only.
export default function CountUp({ value, duration = 1400 }) {
  const match = String(value).match(/\d+(?:\.\d+)?/);
  const [ref, inView] = useInView();
  const [shown, setShown] = useState(() => (match ? null : value));

  useEffect(() => {
    if (!match) return;
    if (!inView) {
      // Back below the fold: rewind so the count replays next time.
      setShown(prefersReducedMotion() ? value : null);
      return;
    }
    const target = parseFloat(match[0]);
    const decimals = (match[0].split(".")[1] ?? "").length;
    const before = value.slice(0, match.index);
    const after = value.slice(match.index + match[0].length);
    if (prefersReducedMotion()) {
      setShown(value);
      return;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setShown(`${before}${(target * eased).toFixed(decimals)}${after}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  if (!match) return value;
  const placeholder = value.replace(match[0], (0).toFixed((match[0].split(".")[1] ?? "").length));
  return (
    <span ref={ref} className="count">
      <span aria-hidden="true">{shown ?? placeholder}</span>
      <span className="visually-hidden">{value}</span>
    </span>
  );
}

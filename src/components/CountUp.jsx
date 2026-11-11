import { useEffect, useState } from "react";
import { useSeen, prefersReducedMotion } from "../lib/motion.js";

// Counts the first number in a string up to its value, once, as it scrolls
// into view: "3.94", "≈ 45%", "0.119/yr". Strings without a number render as
// they are.
//
// The real value is what gets rendered: on first paint, without JavaScript,
// in print, under reduced motion, and for anything already on screen when the
// page loads. The count only ever plays on a figure that is arriving from
// below the fold, so a reader never finds a wrong number sitting on the page.
// Screen readers get the final value throughout.
export default function CountUp({ value, duration = 900 }) {
  const text = String(value);
  const match = text.match(/\d+(?:\.\d+)?/);
  const [ref, { seen, wasVisibleAtMount }] = useSeen();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!match || !seen || wasVisibleAtMount || prefersReducedMotion()) return;
    const target = parseFloat(match[0]);
    const decimals = (match[0].split(".")[1] ?? "").length;
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + match[0].length);
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      // Land on the exact source string, not a re-formatted number.
      setShown(t < 1 ? `${before}${(target * eased).toFixed(decimals)}${after}` : text);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setShown(text);
    };
  }, [seen]);

  if (!match) return value;
  return (
    <span ref={ref} className={shown === text ? "count" : "count is-counting"}>
      <span aria-hidden="true">{shown}</span>
      <span className="visually-hidden">{text}</span>
    </span>
  );
}

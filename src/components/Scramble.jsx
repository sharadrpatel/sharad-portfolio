import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%+=/<>";

// Mono label that "decodes": characters cycle through glyphs and lock in left
// to right whenever `active` turns on. The real text is always in the DOM for
// assistive technology; only the visible copy animates.
export default function Scramble({ text, active, className = "" }) {
  const out = useRef(null);
  useEffect(() => {
    const el = out.current;
    if (!el) return;
    if (!active || prefersReducedMotion()) {
      el.textContent = text;
      return;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = now - start;
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === " " || c === "—" || t > 120 + i * 28) s += c;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = s;
      if (t < 120 + text.length * 28) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, text]);

  return (
    <span className={className}>
      <span aria-hidden="true" ref={out}>
        {text}
      </span>
      <span className="visually-hidden">{text}</span>
    </span>
  );
}

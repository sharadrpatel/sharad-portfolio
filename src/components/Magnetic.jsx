import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

// Leans its child a few pixels toward the pointer while hovered, then springs
// back. Pointer devices only; still under reduced motion.
export default function Magnetic({ children, strength = 0.3, max = 8 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia?.("(hover: hover)").matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(-max, Math.min(max, (e.clientX - (r.left + r.width / 2)) * strength));
      const dy = Math.max(-max, Math.min(max, (e.clientY - (r.top + r.height / 2)) * strength));
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength, max]);
  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}

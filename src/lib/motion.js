// Small motion helpers. Everything here backs off under prefers-reduced-motion.
import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Reports the first time an element comes into view, then stops watching.
// `wasVisibleAtMount` tells callers the element was already on screen when the
// page rendered, so they can skip an entrance nobody would see start.
export function useSeen({ rootMargin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef(null);
  const [state, setState] = useState({ seen: false, wasVisibleAtMount: false });
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setState({ seen: true, wasVisibleAtMount: true });
      return;
    }
    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        const atMount = first;
        first = false;
        if (!entry.isIntersecting) return;
        setState({ seen: true, wasVisibleAtMount: atMount });
        io.disconnect();
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, state];
}

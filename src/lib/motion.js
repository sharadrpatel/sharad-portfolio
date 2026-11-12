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

// Turns true the first time an element comes into view and stays true, so an
// entrance plays once and content never disappears again behind the reader.
export function useInView({ rootMargin = "0px 0px -10% 0px" } = {}) {
  const [ref, { seen }] = useSeen({ rootMargin });
  return [ref, seen];
}

// Moves an element against the scroll by `factor` of its distance from the
// viewport center. Writes the transform directly to avoid re-renders.
export function useParallax(factor = 0.08) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const offset = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-offset * factor).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [factor]);
  return ref;
}

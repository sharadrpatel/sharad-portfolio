// Small motion helpers. Everything here backs off under prefers-reduced-motion.
import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Tracks whether an element has come into view. With `replay` (the default),
// it resets once the element drops back below the viewport, so scrolling up
// and down again replays the entrance. Scrolling past it upward keeps it shown.
// The root margin reaches far above the viewport, so anything scrolled past
// counts as seen; only dropping below the fold resets it. That also catches
// jumps straight from far down to the top, which never pass through view.
export function useInView({ replay = true, rootMargin = "100000px 0px -10% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!replay) io.disconnect();
        } else if (replay && entry.boundingClientRect.top > 0) {
          setInView(false);
        }
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
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

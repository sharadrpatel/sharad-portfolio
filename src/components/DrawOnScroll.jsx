import { useEffect } from "react";
import { useScrub } from "../lib/scroll.js";

const SHAPES = "path, line, polyline, polygon, rect, circle, ellipse";

// Draws a figure as it scrolls into view: SVG strokes trace themselves, fills
// and labels fade up behind them, and raster images wipe in. Progress follows
// the scroll both ways, so scrolling back un-draws it.
export default function DrawOnScroll({ className = "", children }) {
  const ref = useScrub("enter", { end: 0.3 });

  useEffect(() => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    svg.querySelectorAll(SHAPES).forEach((el) => {
      // Leave dashed strokes alone: their own dash pattern would be replaced.
      const dashed = el.getAttribute("stroke-dasharray") || getComputedStyle(el).strokeDasharray !== "none";
      if (dashed || getComputedStyle(el).stroke === "none") el.classList.add("draw-fade");
      else {
        el.setAttribute("pathLength", "1");
        el.classList.add("draw-stroke");
      }
    });
    svg.querySelectorAll("text").forEach((el) => el.classList.add("draw-fade"));
  }, []);

  return (
    <div ref={ref} className={`draw ${className}`}>
      {children}
    </div>
  );
}

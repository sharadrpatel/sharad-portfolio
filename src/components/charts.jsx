// A small set of chart primitives for blog posts. Charts are drawn at the
// container's real pixel width (not scaled with a viewBox), so text stays the
// same size on a phone as on a desktop. Colors come from styles/blog.css.
import { useLayoutEffect, useRef, useState } from "react";

// 2016 → "2015–16"
export const season = (y) => `${y - 1}–${String(y).slice(2)}`;

// Linear scale: lin(domainMin, domainMax, rangeMin, rangeMax)(value)
export const lin = (d0, d1, r0, r1) => (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(Math.round(el.clientWidth));
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/**
 * build(b) returns { svg, points }.
 *   b      = plot bounds in px: { l, r, t, bt, w, h, compact }
 *   points = [{ x, y, d }] in px, used to find what the pointer is nearest to
 * tip(d) returns the tooltip content for a point's datum.
 * snap    = "xy" (nearest point) or "x" (nearest column, for bars and time series)
 */
export function Chart({ label, build, tip, snap = "xy", ratio = 0.6, minH = 260, maxH = 430, margin = {}, fallbackWidth = 0 }) {
  const [ref, measured] = useWidth();
  const [hot, setHot] = useState(null);
  const w = measured || fallbackWidth;
  const compact = w < 480;
  const h = Math.round(Math.min(maxH, Math.max(minH, w * ratio)));
  const m = { top: 14, right: 14, bottom: 30, left: 38, ...(typeof margin === "function" ? margin(compact) : margin) };
  const b = { l: m.left, r: w - m.right, t: m.top, bt: h - m.bottom, w, h, compact };
  const built = w ? build(b) : { svg: null, points: [] };

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - box.left;
    const py = e.clientY - box.top;
    let best = null;
    let bestD = Infinity;
    for (const p of built.points) {
      const dx = p.x - px;
      const dy = p.y - py;
      const dist = snap === "x" ? Math.abs(dx) : Math.hypot(dx, dy);
      if (dist < bestD) {
        bestD = dist;
        best = p;
      }
    }
    setHot(best && bestD < (snap === "x" ? 24 : 40) ? best : null);
  };

  const side = hot && (hot.x < 110 ? "left" : hot.x > w - 110 ? "right" : "center");
  const below = hot && hot.y < 76;

  return (
    <div className="chart" ref={ref} style={{ minHeight: h }}>
      {w > 0 && (
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={label}
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHot(null)}
        >
          {built.svg}
          {hot && <circle className="ch-hot" cx={hot.x} cy={hot.y} r={hot.r ?? 6} />}
        </svg>
      )}
      {hot && tip && (
        <div
          className={`chart__tip chart__tip--${side} ${below ? "chart__tip--below" : ""}`}
          style={{ left: hot.x, top: hot.y }}
          role="status"
        >
          {tip(hot.d)}
        </div>
      )}
    </div>
  );
}

export function YAxis({ b, y, ticks, fmt = String, title }) {
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line className="ch-grid" x1={b.l} x2={b.r} y1={y(t)} y2={y(t)} />
          <text className="ch-tick" x={b.l - 8} y={y(t) + 3.5} textAnchor="end">
            {fmt(t)}
          </text>
        </g>
      ))}
      {title && (
        <text className="ch-tick" x={0} y={b.t - 4}>
          {title}
        </text>
      )}
    </g>
  );
}

export function XAxis({ b, x, ticks, fmt = String, title, line = true }) {
  return (
    <g>
      {line && <line className="ch-axis" x1={b.l} x2={b.r} y1={b.bt} y2={b.bt} />}
      {ticks.map((t) => (
        <text key={t} className="ch-tick" x={x(t)} y={b.bt + 16} textAnchor="middle">
          {fmt(t)}
        </text>
      ))}
      {title && (
        <text className="ch-tick" x={b.r} y={b.bt + 32} textAnchor="end">
          {title}
        </text>
      )}
    </g>
  );
}

// A text label with an optional thin leader line back to the point it names.
export function Note({ x, y, dx = 0, dy = 0, anchor = "start", strong, leader, children }) {
  const lines = [].concat(children);
  const tx = x + dx;
  const ty = y + dy;
  return (
    <g>
      {leader && <line className="ch-leader" x1={x} y1={y} x2={tx + (anchor === "start" ? -3 : anchor === "end" ? 3 : 0)} y2={ty - 4} />}
      <text className={`ch-note ${strong ? "ch-note--strong" : ""}`} x={tx} y={ty} textAnchor={anchor}>
        {lines.map((t, i) => (
          <tspan key={i} x={tx} dy={i ? 14 : 0}>
            {t}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function Legend({ items }) {
  return (
    <ul className="chart__legend">
      {items.map((it) => (
        <li key={it.label}>
          <span className={`chart__key chart__key--${it.kind}`} aria-hidden="true" />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

export function ChartFigure({ n, title, sub, legend, caption, children }) {
  return (
    <figure className="fig post-fig">
      <div className="fig__plot">
        <p className="post-fig__title">{title}</p>
        {sub && <p className="post-fig__sub">{sub}</p>}
        {legend && <Legend items={legend} />}
        {children}
      </div>
      <figcaption className="fig__caption">
        <span className="fig__num">Fig. {n}</span> {caption}
      </figcaption>
    </figure>
  );
}

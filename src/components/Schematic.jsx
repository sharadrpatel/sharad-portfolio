import { useEffect, useRef } from "react";
import { reduced } from "../lib/motion.js";

// Small hand-drawn schematics, one per featured piece of work. They illustrate
// the idea of each method. They are diagrams, not results.
const range = (n) => Array.from({ length: n }, (_, i) => i);

const FIGS = {
  // Two cell layers, the upper one spreading over the lower.
  layers: () => (
    <>
      {range(11).map((i) => (
        <rect key={`b${i}`} x={22 + i * 25} y={92} width={22} height={24} rx={7} className="s-line" />
      ))}
      {range(6).map((i) => (
        <rect key={`t${i}`} x={84 + i * 25} y={64} width={22} height={24} rx={7} className="s-fill" />
      ))}
      <path d="M78 76 H44 m8 -6 l-8 6 l8 6" className="s-accent" />
      <path d="M240 76 H274 m-8 -6 l8 6 l-8 6" className="s-accent" />
      <line x1="16" y1="122" x2="304" y2="122" className="s-dim" />
    </>
  ),
  // A lattice of fluid nodes with an immersed, deformable boundary.
  lattice: () => (
    <>
      {range(13).flatMap((i) => range(6).map((j) => <circle key={`${i}-${j}`} cx={28 + i * 22} cy={22 + j * 21} r={1.6} className="s-dot" />))}
      <path
        d={range(60).map((i) => {
          const a = (i / 60) * 6.283;
          return `${i ? "L" : "M"}${(160 + Math.cos(a) * (46 + 8 * Math.cos(a * 2 + 1))).toFixed(1)} ${(76 + Math.sin(a) * (34 + 5 * Math.sin(a * 3))).toFixed(1)}`;
        }).join(" ") + " Z"}
        className="s-accent"
      />
      {range(14).map((i) => {
        const a = (i / 14) * 6.283;
        return <circle key={i} cx={160 + Math.cos(a) * (46 + 8 * Math.cos(a * 2 + 1))} cy={76 + Math.sin(a) * (34 + 5 * Math.sin(a * 3))} r={2.6} className="s-node" />;
      })}
      {[[1, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7], [0, -1], [0.7, -0.7]].map(([x, y], i) => (
        <line key={i} x1={270} y1={75} x2={270 + x * 17} y2={75 + y * 17} className="s-line" />
      ))}
    </>
  ),
  // A slab of materials with particles streaming and scattering through it.
  slab: () => (
    <>
      {[[24, 50, 0.32], [74, 34, 0.1], [108, 62, 0.22], [170, 44, 0.04], [214, 82, 0.16]].map(([x, w, o], i) => (
        <rect key={i} x={x} y={30} width={w} height={104} style={{ fill: "var(--ink)", fillOpacity: o }} className="s-line" />
      ))}
      <path d="M8 58 L96 72 L150 52 L232 96 L312 84" className="s-accent" />
      <path d="M8 110 L60 104 L128 122 L196 92" className="s-accent" style={{ opacity: 0.55 }} />
      <circle cx="96" cy="72" r="3" className="s-node" />
      <circle cx="150" cy="52" r="3" className="s-node" />
      <circle cx="232" cy="96" r="3" className="s-node" />
      <circle cx="196" cy="92" r="3" className="s-node" />
    </>
  ),
  // A chain of generations whose distribution narrows at each step.
  chain: () => (
    <>
      {[[1, 1, 1, 1, 1], [0.6, 1, 1.25, 1, 0.5], [0.2, 0.9, 1.7, 0.8, 0.15], [0.03, 0.45, 2.3, 0.35, 0.02]].map((bars, g) => (
        <g key={g} transform={`translate(${24 + g * 76} 0)`}>
          {bars.map((b, i) => (
            <rect key={i} x={i * 10} y={104 - b * 26} width={7} height={b * 26} className={g === 3 ? "s-fillA" : "s-fill"} />
          ))}
          <line x1="-3" y1="105" x2="50" y2="105" className="s-dim" />
          <text x="23" y="124" className="s-text">{`n = ${g}`}</text>
          {g < 3 && <path d="M54 84 h14 m-6 -5 l6 5 l-6 5" className="s-line" />}
        </g>
      ))}
      <path d="M276 34 C230 2 96 2 48 36 m-2 -11 l2 11 l11 -3" className="s-accent" />
    </>
  ),
  // Noise resolving into an image, conditioned on another image.
  denoise: () => (
    <>
      {range(4).map((k) => (
        <g key={k} transform={`translate(${18 + k * 76} 44)`}>
          <rect width="60" height="60" rx="4" className="s-line" />
          {range(36).map((i) => {
            const x = 5 + (i % 6) * 9, y = 5 + Math.floor(i / 6) * 9;
            const inside = Math.hypot(x - 28, y - 28) < 20;
            const noise = ((i * 37 + k * 11) % 7) / 7;
            const o = (k / 3) * (inside ? 0.85 : 0.08) + (1 - k / 3) * noise * 0.8;
            return <rect key={i} x={x} y={y} width={7} height={7} style={{ fill: k === 3 ? "var(--accent)" : "var(--ink)", fillOpacity: o }} />;
          })}
          {k < 3 && <path d="M63 30 h10 m-5 -4 l5 4 l-5 4" className="s-line" />}
        </g>
      ))}
      <text x="48" y="128" className="s-text">noise</text>
      <text x="276" y="128" className="s-text">MRI</text>
      <path d="M48 22 H276 V40" className="s-dim" />
      <text x="162" y="16" className="s-text">conditioned on CT</text>
    </>
  ),
  // A ligand docking on its receptor, with short decay tracks.
  target: () => (
    <>
      <circle cx="160" cy="80" r="46" className="s-line" />
      <circle cx="160" cy="80" r="27" className="s-dim" />
      <circle cx="160" cy="80" r="7" className="s-node" />
      {range(9).map((i) => {
        const a = (i / 9) * 6.283 + 0.3;
        return <line key={i} x1={160 + Math.cos(a) * 12} y1={80 + Math.sin(a) * 12} x2={160 + Math.cos(a) * (30 + (i % 3) * 9)} y2={80 + Math.sin(a) * (30 + (i % 3) * 9)} className="s-accent" />;
      })}
      {range(7).map((i) => {
        const a = (i / 7) * 6.283;
        return <path key={i} d="M0 -46 v-11 m-5 0 h10" transform={`translate(160 80) rotate(${(a * 180) / Math.PI})`} className="s-line" />;
      })}
      <text x="58" y="34" className="s-text">scan</text>
      <text x="262" y="34" className="s-text">treat</text>
      <path d="M72 38 L122 62" className="s-dim" />
      <path d="M248 38 L198 62" className="s-dim" />
    </>
  ),
  // An ultrasound fan with a needle approaching the target.
  probe: () => (
    <>
      <rect x="140" y="14" width="40" height="18" rx="5" className="s-fill" />
      <path d="M144 34 L74 132 A108 108 0 0 0 246 132 L176 34 Z" className="s-line" />
      {[50, 74, 98].map((r) => (
        <path key={r} d={`M${160 - r * 0.58} ${34 + r * 0.81} A${r} ${r} 0 0 0 ${160 + r * 0.58} ${34 + r * 0.81}`} className="s-dim" />
      ))}
      <ellipse cx="170" cy="112" rx="20" ry="7" className="s-line" />
      <path d="M40 50 L160 110" className="s-accent" />
      <circle cx="160" cy="110" r="3" className="s-node" />
    </>
  ),
};

export default function Schematic({ name, label }) {
  const Fig = FIGS[name];
  const ref = useRef(null);
  // The first time it is seen, each stroke draws itself.
  useEffect(() => {
    const svg = ref.current;
    if (!svg || reduced() || !("IntersectionObserver" in window)) return;
    const lines = [...svg.querySelectorAll(".s-line, .s-accent")];
    lines.forEach((el) => {
      const len = el.getTotalLength?.() || 0;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
    });
    svg.classList.add("is-armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        svg.classList.add("is-drawn");
        lines.forEach((el, i) => {
          el.style.transition = `stroke-dashoffset 1.3s cubic-bezier(0.2,0.7,0.2,1) ${Math.min(i * 35, 500)}ms`;
          el.style.strokeDashoffset = 0;
        });
      },
      { threshold: 0.35 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);
  if (!Fig) return null;
  return (
    <svg ref={ref} className="schem" viewBox="0 0 320 150" role="img" aria-label={label || "Schematic"}>
      <Fig />
    </svg>
  );
}

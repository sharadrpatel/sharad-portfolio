// Explanatory figures for research entries. Each one draws the actual
// mechanism or data behind a project — no decorative graphics.
// Colors come from CSS classes (see styles/figures.css).
// Plots exported from reports are stored as lossless WebP: pixel-for-pixel the
// original PNGs at about half the size.

function zigzag(x1, x2, y, peaks = 6, amp = 7) {
  const step = (x2 - x1) / (peaks * 2);
  let d = `M${x1} ${y}`;
  for (let i = 1; i < peaks * 2; i++) d += ` L${x1 + step * i} ${y + (i % 2 ? -amp : amp)}`;
  return d + ` L${x2} ${y}`;
}

export function Figure({ n, caption, children, wide, photo }) {
  return (
    <figure className={`fig ${wide ? "fig--wide" : ""} ${photo ? "fig--photo" : ""}`}>
      <div className="fig__plot">{children}</div>
      <figcaption className="fig__caption">
        <span className="fig__num">Fig. {n}</span> {caption}
      </figcaption>
    </figure>
  );
}

/* Hill-type muscle–tendon unit ------------------------------------------ */
function HillModel() {
  return (
    <svg viewBox="0 0 360 200" role="img" aria-labelledby="fig-hill-t">
      <title id="fig-hill-t">
        Schematic of a Hill-type muscle–tendon unit: a contractile element in parallel with a passive elastic
        element, in series with an elastic tendon. Optimal fiber length, PCSA, and tendon slack length are
        highlighted.
      </title>
      {/* bone */}
      <g className="fig-muted">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="12" y1={58 + i * 11} x2="22" y2={50 + i * 11} />
        ))}
      </g>
      <line className="fig-ink fig-thick" x1="22" y1="48" x2="22" y2="142" />
      {/* parallel assembly */}
      <g className="fig-ink">
        <path d="M22 95 H48 M48 66 V124 M48 66 H74 M172 66 H194 M48 124 H62 M180 124 H194 M194 66 V124 M194 95 H214" fill="none" />
        <path d={zigzag(62, 180, 124, 7, 7)} fill="none" />
        <path d={zigzag(214, 298, 95, 6, 8)} fill="none" className="fig-accent-stroke" />
        <path d="M298 95 H318" fill="none" />
      </g>
      <rect className="fig-box fig-accent-box" x="74" y="52" width="98" height="28" />
      <text className="fig-label fig-label--ink" x="123" y="70" textAnchor="middle">CE</text>
      {/* force */}
      <path className="fig-ink fig-thick" d="M318 95 H346 M339 89 L346 95 L339 101" fill="none" />
      <text className="fig-label fig-label--ink" x="336" y="80" textAnchor="middle">F</text>

      {/* parameter callouts */}
      <text className="fig-label fig-label--accent" x="123" y="30" textAnchor="middle">optimal fiber length</text>
      <text className="fig-label fig-label--accent" x="123" y="43" textAnchor="middle">PCSA → max. force</text>
      <text className="fig-label fig-label--accent" x="256" y="72" textAnchor="middle">tendon slack length</text>
      <text className="fig-label" x="121" y="150" textAnchor="middle">PE</text>
      <text className="fig-label" x="256" y="122" textAnchor="middle">SE</text>

      {/* brackets */}
      <path className="fig-muted" d="M48 164 V170 H194 V164 M256 170 V164 M214 164 V170 H298 V164" fill="none" />
      <text className="fig-label" x="121" y="186" textAnchor="middle">muscle fibers (CE ∥ PE)</text>
      <text className="fig-label" x="256" y="186" textAnchor="middle">tendon</text>
    </svg>
  );
}

/* Stented artery cross-section ------------------------------------------- */
function ArterySection() {
  const c = 118;
  const struts = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
  const arrows = [0.25, 0.75, 1.25, 1.75].map((k) => k * Math.PI);
  const pt = (a, r) => [c + Math.cos(a) * r, c + Math.sin(a) * r];
  const labels = [
    { text: "vessel wall", a: -0.62, r: 96, y: 34 },
    { text: "stent strut", a: -0.12, r: 78, y: 86 },
    { text: "neointima", a: 0.3, r: 68, y: 138 },
    { text: "lumen", a: 0.62, r: 40, y: 190 },
  ];
  return (
    <svg viewBox="0 0 400 236" role="img" aria-labelledby="fig-art-t">
      <title id="fig-art-t">
        Cross-section of a stented artery: the vessel wall, stent struts, a ring of neointimal tissue growing
        inward, and the narrowed lumen. Arrows show the stent's chronic outward force on the wall.
      </title>
      <defs>
        <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" className="fig-hatch" />
        </pattern>
      </defs>
      <circle className="fig-wall" cx={c} cy={c} r="98" />
      <circle className="fig-paper" cx={c} cy={c} r="82" />
      <circle className="fig-neointima" cx={c} cy={c} r="78" />
      <circle fill="url(#hatch)" cx={c} cy={c} r="78" />
      <circle className="fig-paper fig-ink" cx={c} cy={c} r="56" />
      {struts.map((a, i) => {
        const [x, y] = pt(a, 80);
        return <rect key={i} className="fig-strut" x={x - 3.5} y={y - 3.5} width="7" height="7" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
      })}
      {arrows.map((a, i) => {
        const [x1, y1] = pt(a, 104);
        const [x2, y2] = pt(a, 118);
        const deg = (a * 180) / Math.PI;
        return (
          <g key={i} className="fig-accent-stroke fig-thick">
            <line x1={x1} y1={y1} x2={x2} y2={y2} />
            <path d="M-5 -4 L0 0 L-5 4" fill="none" transform={`translate(${x2} ${y2}) rotate(${deg})`} />
          </g>
        );
      })}
      {labels.map((l) => {
        const [x, y] = pt(l.a, l.r);
        return (
          <g key={l.text}>
            <path className="fig-muted" d={`M${x} ${y} L250 ${l.y} H258`} fill="none" />
            <circle className="fig-dot" cx={x} cy={y} r="1.8" />
            <text className="fig-label fig-label--ink" x="264" y={l.y + 3.5}>{l.text}</text>
          </g>
        );
      })}
      <text className="fig-label fig-label--accent" x="264" y="226">↗ chronic outward force</text>
    </svg>
  );
}

/* PGD: ischemia–reperfusion injury at the alveolus ----------------------- */
// A vessel drawn as a tube: an ink outline with a filled core.
function Tube({ d, w, core = "var(--wash)" }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="var(--ink)" strokeWidth={w} />
      <path d={d} stroke={core} strokeWidth={w - 2.5} />
    </g>
  );
}

function Neutrophil({ x, y }) {
  return (
    <g>
      <circle className="fig-ink" cx={x} cy={y} r="7.5" fill="var(--accent-wash)" />
      {[-3.2, 0, 3.2].map((dx) => (
        <circle key={dx} className="fig-model" cx={x + dx} cy={y + (dx ? 1 : -1.2)} r="1.9" />
      ))}
    </g>
  );
}

function PgdInjury() {
  const panels = [
    { cx: 100, title: "before", injured: false },
    { cx: 314, title: "after reperfusion", injured: true },
  ];
  const capY = 150;
  const reperfusionX = 150;
  const grades = [
    { x: 196, t: "T0" },
    { x: 262, t: "T24" },
    { x: 328, t: "T48" },
    { x: 394, t: "T72 h" },
  ];
  return (
    <svg viewBox="0 0 420 270" role="img" aria-labelledby="fig-pgd-t">
      <title id="fig-pgd-t">
        Two views of an alveolus and the capillary beneath it. Before: an air-filled alveolus over a capillary of red
        blood cells, separated by a thin barrier. After reperfusion: neutrophils leave the capillary, reactive oxygen
        species form, the barrier leaks, and edema fluid fills the lower alveolus. Below, a timeline from donor
        retrieval through cold ischemia to implant and reperfusion, then PGD grading at 0, 24, 48, and 72 hours.
      </title>
      <defs>
        <pattern id="pgd-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" className="fig-hatch" />
        </pattern>
        <clipPath id="pgd-fluid">
          <rect x={314 - 60} y="92" width="120" height="60" />
        </clipPath>
      </defs>

      {panels.map(({ cx, title, injured }) => (
        <g key={title}>
          <text className={`fig-label ${injured ? "fig-label--accent" : "fig-label--ink"}`} x={cx} y="12" textAnchor="middle">
            {title}
          </text>
          {/* capillary with red cells */}
          <Tube d={`M${cx - 86} ${capY} H${cx + 86}`} w={20} />
          {(injured ? [-70, -22, 12, 44, 72] : [-62, -30, 6, 40, 70]).map((dx) => (
            <ellipse key={dx} className="fig-ink" cx={cx + dx} cy={capY} rx="7" ry="3.6" fill="none" />
          ))}
          {/* alveolus */}
          <circle className="fig-box" cx={cx} cy="78" r="52" />
          {injured && (
            <>
              <circle className="fig-neointima" cx={cx} cy="78" r="51" clipPath="url(#pgd-fluid)" />
              <circle fill="url(#pgd-hatch)" cx={cx} cy="78" r="51" clipPath="url(#pgd-fluid)" />
              {/* leaky barrier: gaps in the capillary wall, fluid crossing */}
              {[-28, 8, 34].map((dx) => (
                <path
                  key={dx}
                  className="fig-accent-stroke"
                  d={`M${cx + dx} ${capY - 12} v-14 m-3 4 l3 -4 l3 4`}
                  fill="none"
                />
              ))}
              <Neutrophil x={cx - 46} y={capY} />
              <Neutrophil x={cx - 12} y={capY - 24} />
              <Neutrophil x={cx + 18} y={112} />
              {[[-34, 52], [26, 46], [4, 70]].map(([dx, y]) => (
                <text key={dx} className="fig-label fig-label--accent" x={cx + dx} y={y} textAnchor="middle" style={{ fontSize: "14px" }}>
                  ✶
                </text>
              ))}
            </>
          )}
        </g>
      ))}

      {/* labels, before */}
      <text className="fig-label" x="100" y="70" textAnchor="middle">alveolus</text>
      <text className="fig-label" x="100" y="82" textAnchor="middle">(air)</text>
      <text className="fig-label" x="100" y="178" textAnchor="middle">capillary, red cells</text>
      <text className="fig-label" x="100" y="190" textAnchor="middle">thin barrier: gas exchange</text>
      {/* labels, after */}
      <text className="fig-label fig-label--accent" x="314" y="98" textAnchor="middle">edema fluid</text>
      <text className="fig-label" x="314" y="178" textAnchor="middle">neutrophils · ✶ reactive O₂</text>
      <text className="fig-label" x="314" y="190" textAnchor="middle">leaky barrier: poor oxygenation</text>
      <path className="fig-ink" d="M196 78 H218 M213 73 L218 78 L213 83" fill="none" />

      {/* timeline */}
      <line className="fig-muted" x1="12" x2="404" y1="230" y2="230" />
      <circle className="fig-dot" cx="12" cy="230" r="2.5" />
      <text className="fig-label" x="12" y="248">donor lung</text>
      <text className="fig-label" x="12" y="259">retrieved</text>
      <path className="fig-muted" d={`M22 220 H${reperfusionX - 10}`} strokeDasharray="2 3" fill="none" />
      <text className="fig-label" x={(22 + reperfusionX) / 2 - 6} y="215" textAnchor="middle">cold ischemia</text>
      <circle className="fig-model" cx={reperfusionX} cy="230" r="4" />
      <text className="fig-label fig-label--accent" x={reperfusionX} y="248" textAnchor="middle">implant +</text>
      <text className="fig-label fig-label--accent" x={reperfusionX} y="259" textAnchor="middle">reperfusion</text>
      {grades.map((g) => (
        <g key={g.t}>
          <line className="fig-accent-stroke" x1={g.x} x2={g.x} y1="225" y2="235" />
          <text className="fig-label fig-label--ink" x={g.x} y="248" textAnchor={g.x > 380 ? "end" : "middle"}>
            {g.t}
          </text>
        </g>
      ))}
      <text className="fig-label" x="295" y="215" textAnchor="middle">PGD graded: PaO₂/FiO₂ + imaging</text>
    </svg>
  );
}

/* Kidney transplant: what the simulator reproduces ------------------------ */
function KidneyTransplant() {
  const artery = "M236 4 C232 80 222 160 206 236";
  const vein = "M264 4 C260 80 252 160 238 236";
  const renalArtery = "M148 92 C178 86 204 92 226 102";
  const renalVein = "M148 104 C182 116 214 138 248 146";
  const ureter = "M146 112 C150 178 232 210 292 208";
  const marks = [
    { n: 1, x: 196, y: 146, label: "vein to vein" },
    { n: 2, x: 196, y: 78, label: "artery to artery" },
    { n: 3, x: 278, y: 190, label: "ureter to bladder" },
  ];
  return (
    <svg viewBox="0 0 420 250" role="img" aria-labelledby="fig-ktx-t">
      <title id="fig-ktx-t">
        Illustration of a kidney transplant. The donor kidney sits in the lower abdomen beside the recipient's external
        iliac artery and vein. Three connections are sewn: the donor renal vein to the external iliac vein, the renal
        artery to the external iliac artery, and the ureter to the bladder.
      </title>
      {/* recipient vessels, with the renal vein passing behind the artery */}
      <Tube d={vein} w={16} />
      <Tube d={renalVein} w={8} />
      <Tube d={artery} w={12} core="var(--surface)" />
      <Tube d={renalArtery} w={6} core="var(--surface)" />

      {/* donor kidney, hilum toward the vessels */}
      <path
        className="fig-wall"
        d="M108 34 C148 34 162 66 152 84 C146 92 146 104 152 112 C162 128 148 152 108 152 C70 152 60 122 60 93 C60 64 70 34 108 34 Z"
      />
      <path className="fig-muted" d="M140 82 C124 86 118 96 122 106 C126 114 136 116 142 112" fill="none" />
      <path className="fig-muted" d="M118 62 C98 72 92 112 116 128" fill="none" strokeDasharray="2 3" />

      {/* ureter and bladder */}
      <path className="fig-ink fig-thick" d={ureter} fill="none" />
      <path className="fig-box" d="M290 214 C290 192 312 186 336 186 C362 186 384 196 384 216 C384 236 360 244 336 244 C310 244 290 236 290 214 Z" />

      {/* the three sewn connections */}
      {[
        [226, 102],
        [248, 146],
        [292, 208],
      ].map(([x, y]) => (
        <g key={x} className="fig-accent-stroke">
          <circle cx={x} cy={y} r="6.5" fill="none" />
          <path d={`M${x - 3} ${y - 4} l2 8 M${x + 1} ${y - 4} l2 8`} fill="none" />
        </g>
      ))}
      {marks.map((m) => (
        <g key={m.n}>
          <circle className="fig-model" cx={m.x} cy={m.y} r="7" />
          <text className="fig-label" x={m.x} y={m.y + 3.3} textAnchor="middle" style={{ fill: "var(--surface)", fontWeight: 600 }}>
            {m.n}
          </text>
        </g>
      ))}

      {/* labels */}
      <text className="fig-label" x="228" y="14" textAnchor="end">external iliac artery</text>
      <text className="fig-label" x="274" y="14">external iliac vein</text>
      <text className="fig-label fig-label--ink" x="106" y="170" textAnchor="middle">donor kidney</text>
      <text className="fig-label" x="166" y="214" textAnchor="end">ureter</text>
      <text className="fig-label" x="337" y="219" textAnchor="middle">bladder</text>
      <text className="fig-label fig-label--accent" x="290" y="64">sewn connections</text>
      {marks.map((m, i) => (
        <g key={m.label}>
          <circle className="fig-model" cx="296" cy={80 + i * 16} r="5" />
          <text className="fig-label" x="296" y={83 + i * 16} textAnchor="middle" style={{ fill: "var(--surface)", fontSize: "7.5px", fontWeight: 600 }}>
            {m.n}
          </text>
          <text className="fig-label fig-label--ink" x="306" y={83 + i * 16}>{m.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* Sigmoidal plasticity response ------------------------------------------ */
function SigmoidResponse() {
  const X0 = 44, X1 = 336, Y0 = 170, Y1 = 30;
  const pts = Array.from({ length: 81 }, (_, i) => {
    const t = i / 80;
    const r = 1 / (1 + Math.exp(-11 * (t - 0.5)));
    const lo = 0.12, hi = 0.9;
    return [X0 + t * (X1 - X0), Y0 - (lo + (hi - lo) * r) * (Y0 - Y1)];
  });
  const d = "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
  const midY = Y0 - (0.12 + 0.39) * (Y0 - Y1);
  const midX = (X0 + X1) / 2;
  return (
    <svg viewBox="0 0 360 206" role="img" aria-labelledby="fig-sig-t">
      <title id="fig-sig-t">
        Schematic sigmoidal reaction norm: phenotype rises from a low plateau to a high plateau as the environment
        changes. The inflection point, E0, and the developmental range between the plateaus, Dc, are marked.
      </title>
      <path className="fig-ink" d={`M${X0} ${Y1 - 8} V${Y0} H${X1 + 8}`} fill="none" />
      <line className="fig-grid" x1={X0} x2={X1} y1={Y0 - 0.12 * (Y0 - Y1)} y2={Y0 - 0.12 * (Y0 - Y1)} strokeDasharray="3 4" />
      <line className="fig-grid" x1={X0} x2={X1} y1={Y0 - 0.9 * (Y0 - Y1)} y2={Y0 - 0.9 * (Y0 - Y1)} strokeDasharray="3 4" />
      <line className="fig-muted" x1={midX} x2={midX} y1={Y0} y2={midY} strokeDasharray="2 3" />
      <path className="fig-accent-stroke fig-thick" d={d} fill="none" />
      <circle className="fig-model" cx={midX} cy={midY} r="4" />
      {/* developmental range bracket */}
      <path
        className="fig-accent-stroke"
        d={`M${X1 + 4} ${Y0 - 0.9 * (Y0 - Y1)} H${X1 + 10} V${Y0 - 0.12 * (Y0 - Y1)} H${X1 + 4}`}
        fill="none"
      />
      <text className="fig-label fig-label--accent" x={X1 - 4} y={Y0 - 0.3 * (Y0 - Y1)} textAnchor="end">range (Dc)</text>
      <text className="fig-label fig-label--accent" x={midX + 10} y={midY + 4}>inflection point (E0)</text>
      <text className="fig-label" x={midX} y={Y0 + 12} textAnchor="middle">E0</text>
      <text className="fig-label" x={X1} y={Y0 + 26} textAnchor="end">environment →</text>
      <text className="fig-label" transform={`translate(${X0 - 14} ${(Y0 + Y1) / 2}) rotate(-90)`} textAnchor="middle">phenotype</text>
    </svg>
  );
}

function DoubleWell() {
  const panels = [
    { alpha: 1, cx: 62, name: "wide spacing", note: "one well", rests: [0], unstable: [] },
    { alpha: 0, cx: 180, name: "critical spacing", note: "flat bottom", rests: [0], unstable: [] },
    { alpha: -1, cx: 298, name: "narrow spacing", note: "two wells", rests: [-1, 1], unstable: [0] },
  ];
  const base = 92, sx = 30, sy = 40;
  const V = (a, x) => 0.5 * a * x * x + 0.25 * x ** 4;
  const path = (a, cx) => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const x = -1.6 + (3.2 * i) / 64;
      if (V(a, x) <= 1.5) pts.push([cx + x * sx, base - V(a, x) * sy]);
    }
    return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
  };
  return (
    <svg viewBox="0 0 360 160" role="img" aria-labelledby="fig-dw-t">
      <title id="fig-dw-t">
        Three potential energy curves for the beam. With the magnets far apart there is one well with the beam resting
        in the middle. At a critical spacing the bottom flattens. With the magnets close there are two wells, one on
        each side, with an unstable balance point between them.
      </title>
      {panels.map((p) => (
        <g key={p.name}>
          <line className="fig-grid" x1={p.cx - 54} x2={p.cx + 54} y1={base} y2={base} strokeDasharray="3 4" />
          <path className="fig-accent-stroke fig-thick" d={path(p.alpha, p.cx)} fill="none" />
          {p.rests.map((x) => (
            <circle key={x} className="fig-model" cx={p.cx + x * sx} cy={base - V(p.alpha, x) * sy - 5} r="5" />
          ))}
          {p.unstable.map((x) => (
            <circle key={x} className="fig-ink" cx={p.cx + x * sx} cy={base - V(p.alpha, x) * sy - 5} r="5" fill="none" />
          ))}
          <text className="fig-label fig-label--ink" x={p.cx} y={base + 34} textAnchor="middle">{p.name}</text>
          <text className="fig-label" x={p.cx} y={base + 48} textAnchor="middle">{p.note}</text>
        </g>
      ))}
      <text className="fig-label" x={8} y={16}>potential energy V(x)</text>
    </svg>
  );
}

export const FIGURES = {
  "double-well": {
    Svg: DoubleWell,
    caption:
      "Illustration of the pitchfork the demo starts with: the scaled potential V(x) = ½αx² + ¼x⁴ as the magnets move closer. Once α turns negative, the single rest position (filled dot) splits into two stable ones with an unstable one (open dot) between them.",
  },
  hill: {
    Svg: HillModel,
    caption:
      "A Hill-type muscle–tendon unit. The three highlighted parameters come from ultrasound, and they're the ones I tested in the sensitivity analysis.",
  },
  "isr-sizing-map": {
    img: { src: "/images/isr-sizing-map.webp", width: 1107, height: 704 },
    alt: "Heatmap of extra neointimal area at 6 months against oversizing ratio from 1.0 to 1.9 and stent outward-force stiffness from 40 to 320 kPa. A white safe zone at the lower left has no stimulus. A solid curve marks where the stimulus starts at 120/80 mmHg and a dashed curve, further left, where it starts at 160/100. The Li control pigs sit near the solid curve and the oversized pigs well inside the blue region. A dotted line marks the 1.4 guideline.",
    caption:
      "Where oversizing becomes risky: extra neointimal area at 6 months compared with a well-sized stent, across oversizing and stent force stiffness. The solid line is where the push signal switches on at 120/80 mmHg; the dashed line is 160/100. Model output, healthy pig artery. From our design review.",
  },
  "isr-blind-test": {
    img: { src: "/images/isr-blind-test.webp", width: 1165, height: 451 },
    alt: "Dot plot of area stenosis in oversized pig stents at 4 weeks. Measured: 64%, with a gray 95% confidence band from 53 to 76%. Final 1D model: 69%, with a wide Monte Carlo interval. Final 2D strut-level model: 87%. Milestone 2 model: 73%. Unchanged Escuer model: 40%.",
    caption:
      "The blind test: area stenosis of stents oversized 1.63× in pigs at 4 weeks. The gray band is the 95% confidence interval of the measured mean (n = 11). The growth gain was fit to the control pigs only, so the oversized group was never used for fitting. From our design review.",
  },
  "isr-neointima": {
    img: { src: "/images/isr-neointima.webp", width: 1086, height: 557 },
    alt: "Line plot of neointimal area over 365 days. The earlier model with a push that never fades rises to about 15 square millimetres. The final model, where the stent finishes opening, levels off near 10 by about 3 months. Normally sized stents level off near 6. Pig data at 4 weeks sit near the early part of each curve.",
    caption:
      "Neointimal area after implantation in pig-sized arteries. Once the stent finishes opening and its push fades, growth levels off at about 10 mm² instead of climbing all year. Points are the pig histology at 4 weeks. Model output, from our design review.",
  },
  "isr-blood-pressure": {
    img: { src: "/images/isr-blood-pressure.webp", width: 949, height: 669 },
    alt: "Line plot of the chronic stimulus against oversizing ratio for three blood pressure settings. The stimulus stays at zero until an onset point, then rises. Onset is 1.34 for steady 100 mmHg, 1.30 for pulsatile 120/80, and 1.22 for 160/100.",
    caption:
      "The push signal against oversizing at three blood pressures. Higher pressure moves the point where the signal switches on from 1.30× to 1.22×. Model output, from our design review.",
  },
  artery: {
    Svg: ArterySection,
    caption:
      "Cross-section of a stented femoral artery (not to scale). The module I added ties the stent's outward force, based on how oversized it is, to stress in the artery wall.",
  },
  pgd: {
    Svg: PgdInjury,
    caption:
      "Ischemia–reperfusion injury, the central mechanism in the PGD literature (illustration, not to scale). When blood returns to the donor lung, neutrophils and reactive oxygen species damage the barrier between capillary and alveolus, fluid leaks in, and oxygenation falls. PGD is graded over the first 72 hours from PaO₂/FiO₂ and chest imaging. The model aims to link these steps to which patients are at risk.",
  },
  "kidney-transplant": {
    Svg: KidneyTransplant,
    caption:
      "The operation behind our kidney transplant simulator (illustration, not to scale). The donor kidney is placed in the lower abdomen, and the surgeon sews three connections: renal vein to external iliac vein, renal artery to external iliac artery, and ureter to bladder.",
  },
  sigmoid: {
    Svg: SigmoidResponse,
    caption:
      "A sigmoidal reaction norm (illustration). In the original model its shape is fixed. I made two parts of it evolvable: where it switches (E0) and how wide a range of phenotypes it covers (Dc).",
  },
  // Raster figures: a photo, or plots taken directly from a written report.
  "scudem-team": {
    img: { src: "/images/scudem-team.jpg", width: 790, height: 310 },
    alt: "Three members of the University of Florida SCUDEM team in suits, standing in front of the UF College of Medicine.",
    caption: "Our University of Florida team, as pictured on MathWorks' SCUDEM 2025 winners page.",
    photo: true,
  },
  "shot-dna-explorer": {
    img: { src: "/images/shot-dna-explorer.jpg", width: 1400, height: 1290 },
    alt: "The Shot DNA explorer showing Stephen Curry's 2025–26 season: a hexagon shot map of the half court and a table of his share of shots by zone compared with the league.",
    caption: "The explorer, showing Stephen Curry's 2025–26 season: where he shoots, how his makes compare with an average shooter, and his share of shots by zone.",
  },
  "celllab-fluorescence": {
    img: { src: "/images/celllab-fluorescence.jpg", width: 1400, height: 710 },
    alt: "Six fluorescence microscope images of fibroblasts in a grid. Collagen replicate B shows dense, even cell coverage with very few red dead cells. The uncoated control's first well has only a few scattered cells.",
    caption:
      "Live/dead imaging, merged DAPI (nuclei), GFP (live), and RFP (dead) channels. Our collagen-coated replicate (B) had dense, even coverage with very few dead cells; the uncoated control's first well had low confluency. Scale bars are 1000 µm.",
  },
  "celllab-wound-healing": {
    img: { src: "/images/celllab-wound-healing.jpg", width: 1400, height: 625 },
    alt: "Table of brightfield images of scratch wounds from Wednesday morning to Friday morning for Lab A, Lab B, and the control, with red lines marking the wound edges and closure rates of 0.49, 2.51, and 1.25 percent per hour.",
    caption:
      "Scratch wound-healing assay over 48 hours, with red lines marking the wound edges. Lab B is our group's collagen-coated replicate (2.51%/hr); Lab A is a parallel collagen replicate (0.49%/hr); the uncoated control closed at 1.25%/hr.",
  },
  "scudem-kl": {
    img: { src: "/images/scudem-kl-drift.webp", width: 1000, height: 749 },
    alt: "Line plot of KL divergence from the human data over 40 generations for one, three, and five models. One model levels off near 0.28, three near 0.17, and five near 0.15.",
    caption:
      "Model 1: drift from the human data (KL divergence) over 40 generations with 90% AI-generated training data, for one, three, and five models. More models, less drift. From our report.",
  },
  "scudem-task-space": {
    img: { src: "/images/scudem-task-space.webp", width: 1400, height: 678 },
    alt: "Two plots of task probability. At generation 0 the distribution is a smooth bell curve centered at task 30. At generation 100 it has three sharp spikes at tasks 20, 35, and 41.",
    caption:
      "Model 2: the task space at generation 0 and after 100 generations, with three models trained on tasks 20, 35, and 41. The distribution collapses into spikes at those tasks. From our report.",
  },
  "mcm-sensitivity": {
    img: { src: "/images/mcm-sensitivity.webp", width: 1261, height: 1070 },
    alt: "Bar chart of linear and rank correlation between each of 22 model parameters and the final state of charge. The largest bars are negative for network and processor draw terms and positive for battery capacity; thermal parameters are near zero.",
    caption:
      "Global sensitivity analysis: linear and rank correlation of each parameter with the state of charge after 16 hours, from 10⁴ Monte Carlo samples. Negative bars mean faster drain. From our paper.",
  },
  "mcm-soc": {
    img: { src: "/images/mcm-soc.webp", width: 1261, height: 1360 },
    alt: "Line plot of battery percentage over 16 hours. It falls slowly for the first five hours, then in steep steps, reaching zero at about 11 hours.",
    caption:
      "State of charge (percent) over one simulated day of heavy use. It drops in steep steps during use and reaches empty at about 11 hours. (The y-axis label in the original plot reads \"cumulative charge drawn,\" but the curve is the battery percentage.) From our paper.",
  },
  "seatrout-forecast": {
    img: { src: "/images/seatrout-forecast.webp", width: 893, height: 490 },
    alt: "Line chart of Gulf seatrout biomass from 2000 to 2023, declining from about 74,000 to 52,000 model units, then four 10-year forecasts. Status quo and plus or minus 20% effort keep declining; only the F_MSY scenario rises toward the B_MSY line.",
    caption:
      "Historical biomass (2000–2023) and 10-year forecasts under constant fishing rates. Only fishing at F_MSY (0.12/yr) moves the stock back toward B_MSY, the dashed line. From our presentation.",
  },
  "seatrout-validation": {
    img: { src: "/images/seatrout-validation.webp", width: 889, height: 470 },
    alt: "Line chart comparing the assessment's spawning stock biomass, in metric tons, with the scaled model biomass from 2000 to 2023. Both trend down from about 5,000 tons with similar ups and downs.",
    caption:
      "External check: model biomass, scaled once, against the assessment's spawning stock biomass, which the model was not fit to. Typical relative error was about 10%. From our presentation.",
  },
  "canopy-forest": {
    img: { src: "/images/canopy-forest.webp", width: 1100, height: 1095 },
    alt: "Map of an 800 by 800 metre simulated forest. Gray and orange dots mark trees, with orange ones ripe. Blue and red outlines show the two monkeys' core ranges, which overlap heavily around a central star. Thin blue and red lines trace each monkey's path for one day.",
    caption:
      "One simulated dry-season day. Outlines are each monkey's 60% core range, lines are that day's paths, orange dots are ripe trees, and the star is the shared sleeping site. The ranges overlap far more than the paper's optimum of 1/3. Simulated, from our slides.",
  },
  "canopy-talking": {
    img: { src: "/images/canopy-talking.webp", width: 1400, height: 751 },
    alt: "Bar chart of pair intake compared with a silent pair. Talking adds 3.1% in the dry season and 3.6% in the wet; rich talk adds 3.2% and 4.4%; an oracle that knows every tree adds 39.6% and 21.2%.",
    caption:
      "What talking is worth, as the change in pair intake against a silent pair in the same forest. Calls help a little; knowing every tree would help far more. Bars are means over 20 simulated forests with 95% intervals. From our slides.",
  },
  "canopy-spacing-noise": {
    img: { src: "/images/canopy-spacing-noise.webp", width: 1400, height: 907 },
    alt: "Heatmap of pair intake with preferred spacing on the x-axis from 0.25 to 2.5 hearing ranges and honest noise on the y-axis from 0 to 0.5. Colour darkens from left to right but barely changes from bottom to top. A line marking the best spacing in each row stays at 2 to 2.5.",
    caption:
      "Distance against accuracy. Intake changes across the map (spacing), not up it (noise), and the best spacing in every row stays at 2–2.5 hearing ranges, so there's no trade-off to balance. Dry season, simulated. From our slides.",
  },
  "canopy-meanfield": {
    img: { src: "/images/canopy-meanfield.webp", width: 1100, height: 954 },
    alt: "Scatter plot of the simulated feeding share against the three-ODE prediction for 320 runs with different detail and noise settings. The points fall tightly along the diagonal from 0.34 to 0.51.",
    caption:
      "The check: the feeding share predicted by the three mean-field ODEs against the share in the full simulation, for 320 runs. Points on the dashed line mean the two agree; the mean error was 0.004. From our slides.",
  },
  "crutch-assembly": {
    img: { src: "/images/crutch-assembly.webp", width: 1200, height: 1424 },
    alt: "Two Onshape renders of the crutch side by side: on the left collapsed, with the leg tucked into the lower frame; on the right fully extended, with the gray leg reaching well below the frame. Both have a padded shoulder rest, a hand grip between two blue aluminum frame rails, and rows of pin holes.",
    caption: "The assembly in Onshape, collapsed (left) and fully extended (right). The leg slides on a slider mate and locks with a pin.",
  },
  "crutch-drawing": {
    img: { src: "/images/crutch-drawing.webp", width: 1600, height: 1234 },
    alt: "Multiview engineering drawing of the left upper frame with an overall height of 926.89 mm, 172.1 degree bends, a 19 mm tube diameter, and 10 mm pin holes toleranced at plus or minus 0.01 mm.",
    caption: "Multiview drawing of the left upper frame, one of the drawings in the report. Pin holes are held to ±0.01 mm.",
  },
  "biceps-concepts": {
    img: { src: "/images/biceps-concepts.webp", width: 1670, height: 941 },
    alt: "Three illustrations of the proximal radius with a torn biceps tendon brought in from the left. Concept 1 holds the tendon with two buttons inside the near cortex. Concept 2, the selected one, seats the tendon in a tunnel with an interference screw and ties it to a button on the far cortex, drilled with a clutch drill that stops turning at breakthrough. Concept 3 uses two buttons outside the far cortex, also drilled with the clutch.",
    caption:
      "The three concepts we compared: dual unicortical buttons, a bicortical button with an interference screw, and dual bicortical buttons. Concepts 2 and 3 use a clutch drill bit that stops turning when it breaks through the far cortex. Concept illustrations from our final presentation, not to scale.",
  },
  "biceps-prototype": {
    img: { src: "/images/biceps-prototype.webp", width: 1400, height: 1050 },
    photo: true,
    alt: "Prototyping parts laid out on a wooden table: three synthetic radius bones, a 1.8 mm drill bit with yellow end caps, a blue-handled knotless suture anchor inserter, a cortical button threaded with sutures, and a suture anchor with long suture tails.",
    caption:
      "Parts for the first bench builds: synthetic model radii, a 1.8 mm drill bit, a knotless suture anchor inserter, a cortical button with sutures, and a suture anchor.",
  },
};

export function WorkFigure({ name, n, wide }) {
  const f = FIGURES[name];
  if (!f) return null;
  const { Svg, img } = f;
  return (
    <Figure n={n} caption={f.caption} wide={wide} photo={f.photo}>
      {img ? (
        <img src={img.src} width={img.width} height={img.height} alt={f.alt} loading="lazy" decoding="async" />
      ) : (
        <Svg />
      )}
    </Figure>
  );
}

// The drawing or image alone, without the numbered caption (used in previews).
export function FigureArt({ name }) {
  const f = FIGURES[name];
  if (!f) return null;
  const { Svg, img } = f;
  return img ? (
    <img src={img.src} width={img.width} height={img.height} alt={f.alt ?? ""} loading="lazy" decoding="async" />
  ) : (
    <Svg />
  );
}

// Explanatory figures for research entries. Each one draws the actual
// mechanism or data behind a project — no decorative graphics.
// Colors come from CSS classes (see styles/figures.css).

function zigzag(x1, x2, y, peaks = 6, amp = 7) {
  const step = (x2 - x1) / (peaks * 2);
  let d = `M${x1} ${y}`;
  for (let i = 1; i < peaks * 2; i++) d += ` L${x1 + step * i} ${y + (i % 2 ? -amp : amp)}`;
  return d + ` L${x2} ${y}`;
}

export function Figure({ n, caption, children, wide }) {
  return (
    <figure className={`fig ${wide ? "fig--wide" : ""}`}>
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

/* Restenosis validation --------------------------------------------------- */
function RestenosisPlot() {
  const y = (pct) => 180 - pct * 1.5;
  const ticks = [0, 25, 50, 75, 100];
  return (
    <svg viewBox="0 0 360 232" role="img" aria-labelledby="fig-rest-t">
      <title id="fig-rest-t">
        Dot plot comparing model predictions with reference values. Base model: 24.8 percent restenosis at 300
        days versus about 25 percent published. Blind test: 73 percent predicted area stenosis versus 64 plus or
        minus 17 percent observed in porcine data.
      </title>
      {ticks.map((t) => (
        <g key={t}>
          <line className="fig-grid" x1="52" x2="344" y1={y(t)} y2={y(t)} />
          <text className="fig-label" x="44" y={y(t) + 3.5} textAnchor="end">{t}</text>
        </g>
      ))}
      <text className="fig-label" transform="translate(14 105) rotate(-90)" textAnchor="middle">stenosis (%)</text>
      <line className="fig-ink" x1="198" x2="198" y1="26" y2="180" strokeDasharray="2 4" />

      {/* group 1: benchmark */}
      <circle className="fig-ref" cx="108" cy={y(25)} r="5.5" />
      <circle className="fig-model" cx="142" cy={y(24.8)} r="5.5" />
      <text className="fig-label" x="108" y={y(25) - 12} textAnchor="middle">~25</text>
      <text className="fig-label fig-label--accent" x="142" y={y(24.8) - 12} textAnchor="middle">24.8</text>

      {/* group 2: blind test */}
      <line className="fig-ink" x1="254" x2="254" y1={y(81)} y2={y(47)} />
      <line className="fig-ink" x1="248" x2="260" y1={y(81)} y2={y(81)} />
      <line className="fig-ink" x1="248" x2="260" y1={y(47)} y2={y(47)} />
      <circle className="fig-ref" cx="254" cy={y(64)} r="5.5" />
      <circle className="fig-model" cx="292" cy={y(73)} r="5.5" />
      <text className="fig-label" x="254" y={y(47) + 14} textAnchor="middle">64 ± 17</text>
      <text className="fig-label fig-label--accent" x="304" y={y(73) + 3.5}>73</text>

      <text className="fig-label fig-label--ink" x="125" y="200" textAnchor="middle">Base model</text>
      <text className="fig-label" x="125" y="213" textAnchor="middle">vs. published · 300 d</text>
      <text className="fig-label fig-label--ink" x="273" y="200" textAnchor="middle">Blind test</text>
      <text className="fig-label" x="273" y="213" textAnchor="middle">vs. porcine data</text>

      {/* legend */}
      <circle className="fig-model" cx="60" cy="12" r="4" />
      <text className="fig-label fig-label--ink" x="70" y="15.5">model</text>
      <circle className="fig-ref" cx="122" cy="12" r="4" />
      <text className="fig-label fig-label--ink" x="132" y="15.5">reference</text>
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

/* PGD workflow ------------------------------------------------------------- */
function PgdWorkflow() {
  const nodes = [
    { x: 4, lines: ["PGD", "literature"] },
    { x: 102, lines: ["Mechanistic", "synthesis"] },
    { x: 200, lines: ["Mechanistic", "model"], accent: true },
    { x: 298, lines: ["Risk", "stratification"], goal: true },
  ];
  return (
    <svg viewBox="0 0 390 140" role="img" aria-labelledby="fig-pgd-t">
      <title id="fig-pgd-t">
        Workflow: the PGD literature is synthesized through a systematic review, which structures a mechanistic
        model whose goal is to inform risk stratification.
      </title>
      {nodes.map((n, i) => (
        <g key={i}>
          <rect
            className={`fig-box ${n.accent ? "fig-accent-box" : ""} ${n.goal ? "fig-dashed" : ""}`}
            x={n.x}
            y="34"
            width="86"
            height="46"
          />
          {n.lines.map((t, j) => (
            <text key={t} className="fig-label fig-label--ink" x={n.x + 43} y={54 + j * 13} textAnchor="middle">
              {t}
            </text>
          ))}
          {i < nodes.length - 1 && (
            <path className="fig-ink" d={`M${n.x + 88} 57 H${n.x + 100} M${n.x + 96} 53 L${n.x + 100} 57 L${n.x + 96} 61`} fill="none" />
          )}
        </g>
      ))}
      <path className="fig-muted" d="M4 96 V102 H188 V96" fill="none" />
      <text className="fig-label" x="96" y="118" textAnchor="middle">systematic review</text>
      <text className="fig-label" x="243" y="118" textAnchor="middle">in development</text>
      <text className="fig-label" x="341" y="118" textAnchor="middle">aim</text>
      <text className="fig-label" x="4" y="18">evidence → structure → mechanism → decision</text>
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

const FIGURES = {
  hill: {
    Svg: HillModel,
    caption:
      "A Hill-type muscle–tendon unit. The three highlighted parameters come from ultrasound, and they're the ones I tested in the sensitivity analysis.",
  },
  restenosis: {
    Svg: RestenosisPlot,
    caption:
      "Model vs. reference values. Left: our version of the base model compared with the published result. Right: our blind prediction compared with porcine data.",
  },
  artery: {
    Svg: ArterySection,
    caption:
      "Cross-section of a stented femoral artery (not to scale). The module I added ties the stent's outward force, based on how oversized it is, to stress in the artery wall.",
  },
  pgd: {
    Svg: PgdWorkflow,
    caption: "How the project is set up. The systematic review shapes the model, and the goal is to use the model for risk stratification.",
  },
  sigmoid: {
    Svg: SigmoidResponse,
    caption:
      "A sigmoidal reaction norm (illustration). In the original model its shape is fixed. I made two parts of it evolvable: where it switches (E0) and how wide a range of phenotypes it covers (Dc).",
  },
};

export function WorkFigure({ name, n, wide }) {
  const f = FIGURES[name];
  if (!f) return null;
  const { Svg } = f;
  return (
    <Figure n={n} caption={f.caption} wide={wide}>
      <Svg />
    </Figure>
  );
}

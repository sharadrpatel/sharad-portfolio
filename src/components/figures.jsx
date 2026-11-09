// Explanatory figures for research entries. Each one draws the actual
// mechanism or data behind a project — no decorative graphics.
// Colors come from CSS classes (see styles/figures.css).

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
    img: { src: "/images/isr-sizing-map.png", width: 1107, height: 704 },
    alt: "Heatmap of extra neointimal area at 6 months against oversizing ratio from 1.0 to 1.9 and stent outward-force stiffness from 40 to 320 kPa. A white safe zone at the lower left has no stimulus. A solid curve marks where the stimulus starts at 120/80 mmHg and a dashed curve, further left, where it starts at 160/100. The Li control pigs sit near the solid curve and the oversized pigs well inside the blue region. A dotted line marks the 1.4 guideline.",
    caption:
      "Where oversizing becomes risky: extra neointimal area at 6 months compared with a well-sized stent, across oversizing and stent force stiffness. The solid line is where the push signal switches on at 120/80 mmHg; the dashed line is 160/100. Model output, healthy pig artery. From our design review.",
  },
  "isr-blind-test": {
    img: { src: "/images/isr-blind-test.png", width: 1165, height: 451 },
    alt: "Dot plot of area stenosis in oversized pig stents at 4 weeks. Measured: 64%, with a gray 95% confidence band from 53 to 76%. Final 1D model: 69%, with a wide Monte Carlo interval. Final 2D strut-level model: 87%. Milestone 2 model: 73%. Unchanged Escuer model: 40%.",
    caption:
      "The blind test: area stenosis of stents oversized 1.63× in pigs at 4 weeks. The gray band is the 95% confidence interval of the measured mean (n = 11). The growth gain was fit to the control pigs only, so the oversized group was never used for fitting. From our design review.",
  },
  "isr-neointima": {
    img: { src: "/images/isr-neointima.png", width: 1086, height: 557 },
    alt: "Line plot of neointimal area over 365 days. The earlier model with a push that never fades rises to about 15 square millimetres. The final model, where the stent finishes opening, levels off near 10 by about 3 months. Normally sized stents level off near 6. Pig data at 4 weeks sit near the early part of each curve.",
    caption:
      "Neointimal area after implantation in pig-sized arteries. Once the stent finishes opening and its push fades, growth levels off at about 10 mm² instead of climbing all year. Points are the pig histology at 4 weeks. Model output, from our design review.",
  },
  "isr-blood-pressure": {
    img: { src: "/images/isr-blood-pressure.png", width: 949, height: 669 },
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
    Svg: PgdWorkflow,
    caption: "How the project is set up. The systematic review shapes the model, and the goal is to use the model for risk stratification.",
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
    img: { src: "/images/scudem-kl-drift.png", width: 1000, height: 749 },
    alt: "Line plot of KL divergence from the human data over 40 generations for one, three, and five models. One model levels off near 0.28, three near 0.17, and five near 0.15.",
    caption:
      "Model 1: drift from the human data (KL divergence) over 40 generations with 90% AI-generated training data, for one, three, and five models. More models, less drift. From our report.",
  },
  "scudem-task-space": {
    img: { src: "/images/scudem-task-space.png", width: 1400, height: 678 },
    alt: "Two plots of task probability. At generation 0 the distribution is a smooth bell curve centered at task 30. At generation 100 it has three sharp spikes at tasks 20, 35, and 41.",
    caption:
      "Model 2: the task space at generation 0 and after 100 generations, with three models trained on tasks 20, 35, and 41. The distribution collapses into spikes at those tasks. From our report.",
  },
  "mcm-sensitivity": {
    img: { src: "/images/mcm-sensitivity.png", width: 1261, height: 1070 },
    alt: "Bar chart of linear and rank correlation between each of 22 model parameters and the final state of charge. The largest bars are negative for network and processor draw terms and positive for battery capacity; thermal parameters are near zero.",
    caption:
      "Global sensitivity analysis: linear and rank correlation of each parameter with the state of charge after 16 hours, from 10⁴ Monte Carlo samples. Negative bars mean faster drain. From our paper.",
  },
  "mcm-soc": {
    img: { src: "/images/mcm-soc.png", width: 1261, height: 1360 },
    alt: "Line plot of battery percentage over 16 hours. It falls slowly for the first five hours, then in steep steps, reaching zero at about 11 hours.",
    caption:
      "State of charge (percent) over one simulated day of heavy use. It drops in steep steps during use and reaches empty at about 11 hours. (The y-axis label in the original plot reads \"cumulative charge drawn,\" but the curve is the battery percentage.) From our paper.",
  },
  "seatrout-forecast": {
    img: { src: "/images/seatrout-forecast.png", width: 893, height: 490 },
    alt: "Line chart of Gulf seatrout biomass from 2000 to 2023, declining from about 74,000 to 52,000 model units, then four 10-year forecasts. Status quo and plus or minus 20% effort keep declining; only the F_MSY scenario rises toward the B_MSY line.",
    caption:
      "Historical biomass (2000–2023) and 10-year forecasts under constant fishing rates. Only fishing at F_MSY (0.12/yr) moves the stock back toward B_MSY, the dashed line. From our presentation.",
  },
  "seatrout-validation": {
    img: { src: "/images/seatrout-validation.png", width: 889, height: 470 },
    alt: "Line chart comparing the assessment's spawning stock biomass, in metric tons, with the scaled model biomass from 2000 to 2023. Both trend down from about 5,000 tons with similar ups and downs.",
    caption:
      "External check: model biomass, scaled once, against the assessment's spawning stock biomass, which the model was not fit to. Typical relative error was about 10%. From our presentation.",
  },
  "canopy-forest": {
    img: { src: "/images/canopy-forest.png", width: 1100, height: 1095 },
    alt: "Map of an 800 by 800 metre simulated forest. Gray and orange dots mark trees, with orange ones ripe. Blue and red outlines show the two monkeys' core ranges, which overlap heavily around a central star. Thin blue and red lines trace each monkey's path for one day.",
    caption:
      "One simulated dry-season day. Outlines are each monkey's 60% core range, lines are that day's paths, orange dots are ripe trees, and the star is the shared sleeping site. The ranges overlap far more than the paper's optimum of 1/3. Simulated, from our slides.",
  },
  "canopy-talking": {
    img: { src: "/images/canopy-talking.png", width: 1400, height: 751 },
    alt: "Bar chart of pair intake compared with a silent pair. Talking adds 3.1% in the dry season and 3.6% in the wet; rich talk adds 3.2% and 4.4%; an oracle that knows every tree adds 39.6% and 21.2%.",
    caption:
      "What talking is worth, as the change in pair intake against a silent pair in the same forest. Calls help a little; knowing every tree would help far more. Bars are means over 20 simulated forests with 95% intervals. From our slides.",
  },
  "canopy-spacing-noise": {
    img: { src: "/images/canopy-spacing-noise.png", width: 1400, height: 907 },
    alt: "Heatmap of pair intake with preferred spacing on the x-axis from 0.25 to 2.5 hearing ranges and honest noise on the y-axis from 0 to 0.5. Colour darkens from left to right but barely changes from bottom to top. A line marking the best spacing in each row stays at 2 to 2.5.",
    caption:
      "Distance against accuracy. Intake changes across the map (spacing), not up it (noise), and the best spacing in every row stays at 2–2.5 hearing ranges, so there's no trade-off to balance. Dry season, simulated. From our slides.",
  },
  "canopy-meanfield": {
    img: { src: "/images/canopy-meanfield.png", width: 1100, height: 954 },
    alt: "Scatter plot of the simulated feeding share against the three-ODE prediction for 320 runs with different detail and noise settings. The points fall tightly along the diagonal from 0.34 to 0.51.",
    caption:
      "The check: the feeding share predicted by the three mean-field ODEs against the share in the full simulation, for 320 runs. Points on the dashed line mean the two agree; the mean error was 0.004. From our slides.",
  },
  "crutch-assembly": {
    img: { src: "/images/crutch-assembly.png", width: 1200, height: 1424 },
    alt: "Two Onshape renders of the crutch side by side: on the left collapsed, with the leg tucked into the lower frame; on the right fully extended, with the gray leg reaching well below the frame. Both have a padded shoulder rest, a hand grip between two blue aluminum frame rails, and rows of pin holes.",
    caption: "The assembly in Onshape, collapsed (left) and fully extended (right). The leg slides on a slider mate and locks with a pin.",
  },
  "crutch-drawing": {
    img: { src: "/images/crutch-drawing.png", width: 1600, height: 1234 },
    alt: "Multiview engineering drawing of the left upper frame with an overall height of 926.89 mm, 172.1 degree bends, a 19 mm tube diameter, and 10 mm pin holes toleranced at plus or minus 0.01 mm.",
    caption: "Multiview drawing of the left upper frame, one of the drawings in the report. Pin holes are held to ±0.01 mm.",
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

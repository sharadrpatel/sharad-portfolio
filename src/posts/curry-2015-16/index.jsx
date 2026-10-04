import { Link } from "../../lib/router.jsx";
import { Chart, ChartFigure, YAxis, XAxis, Note, lin, season } from "../../components/charts.jsx";
import {
  TOP10, GAPS, VOLUME, SCORERS, DISTANCE,
  THREE_QUARTERS, PACE, COLDEST, TEAM_AVERAGE, SHOT_VALUE, TREND, TREND_FIT,
} from "./data.js";

const pct = (n, d) => `${((100 * n) / d).toFixed(1)}%`;
const num = (n) => n.toLocaleString("en-US");

/* ── Fig. 1: the ten highest totals in every season ─────────────────────── */
function RecordChart() {
  // Running record after each season.
  const record = [];
  let best = 0;
  for (let yr = 1980; yr <= 2026; yr++) {
    best = Math.max(best, ...TOP10.filter((d) => d[0] === yr).map((d) => d[1]));
    record.push([yr, best]);
  }

  const build = (b) => {
    const x = lin(1979.5, 2026.5, b.l, b.r);
    const y = lin(0, 430, b.bt, b.t);
    const step = record
      .map(([yr, v], i) => `${i ? "V" : "M" + x(yr - 0.5).toFixed(1)}${i ? "" : " "}${y(v).toFixed(1)} H${x(yr + 0.5).toFixed(1)}`)
      .join(" ");
    const points = TOP10.map((d) => ({ x: x(d[0]), y: y(d[1]), d }));
    const at = (yr, v) => ({ x: x(yr), y: y(v) });
    return {
      points,
      svg: (
        <>
          <rect className="ch-band" x={x(1994.5)} width={x(1997.5) - x(1994.5)} y={b.t} height={b.bt - b.t} />
          <YAxis b={b} y={y} ticks={[0, 100, 200, 300, 400]} />
          <XAxis b={b} x={x} ticks={b.compact ? [1980, 2000, 2020] : [1980, 1990, 2000, 2010, 2020]} />
          {!b.compact && (
            <text className="ch-tick" x={x(1996)} y={b.t + 12} textAnchor="middle">
              22-ft line
            </text>
          )}
          {points.map((p, i) => (
            <circle key={i} className="ch-field" cx={p.x} cy={p.y} r={b.compact ? 1.8 : 2.3} />
          ))}
          <path className="ch-line" d={step} />
          <circle className="ch-accent ch-ring" {...{ cx: at(2016, 402).x, cy: at(2016, 402).y }} r="5.5" />
          <Note {...at(2016, 402)} dx={-10} dy={4} anchor="end" strong>
            {b.compact ? "Curry, 402" : "Stephen Curry, 2015–16: 402"}
          </Note>
          <Note {...at(2019, 378)} dx={8} dy={4}>
            {b.compact ? "378" : "Harden, 378"}
          </Note>
          {!b.compact && (
            <>
              <Note {...at(2015, 286)} dx={-16} dy={-34} anchor="end" leader>
                Old record, 286
              </Note>
              <Note {...at(1996, 267)} dy={-12} anchor="middle">
                Dennis Scott, 267
              </Note>
            </>
          )}
        </>
      ),
    };
  };

  return (
    <Chart
      label="Dot plot of the ten highest three-point totals in each NBA season from 1979–80 to 2025–26, with a line for the record. The record rises slowly to 286 in 2014–15, then jumps to 402 in 2015–16. No season since has passed 378."
      build={build}
      margin={{ left: 34, right: 10 }}
      tip={(d) => (
        <>
          <strong>{d[1]} threes</strong>
          <span>{d[2]}</span>
          <span>{season(d[0])}</span>
        </>
      )}
    />
  );
}

/* ── Fig. 2: gap between first and second place ─────────────────────────── */
function GapChart() {
  const build = (b) => {
    const x = lin(1979.5, 2026.5, b.l, b.r);
    const y = lin(0, 140, b.bt, b.t);
    const bw = Math.max(3, Math.min(14, (x(1981) - x(1980)) * 0.62));
    const points = GAPS.map((d) => ({ x: x(d[0]), y: y(d[2] - d[4]), d, r: 5 }));
    const rad = Math.min(3, bw / 2);
    const bar = (cx, top) =>
      `M${cx - bw / 2} ${b.bt} V${top + rad} Q${cx - bw / 2} ${top} ${cx - bw / 2 + rad} ${top} H${cx + bw / 2 - rad} Q${cx + bw / 2} ${top} ${cx + bw / 2} ${top + rad} V${b.bt} Z`;
    const top = (yr) => points.find((p) => p.d[0] === yr);
    return {
      points,
      svg: (
        <>
          <YAxis b={b} y={y} ticks={[0, 50, 100]} />
          <XAxis b={b} x={x} ticks={b.compact ? [1980, 2000, 2020] : [1980, 1990, 2000, 2010, 2020]} />
          {points.map((p) =>
            p.d[2] - p.d[4] > 0 ? (
              <path key={p.d[0]} className={p.d[0] === 2016 ? "ch-accent" : "ch-bar"} d={bar(p.x, p.y)} />
            ) : null,
          )}
          <Note {...top(2016)} dy={-8} anchor="middle" strong>
            126
          </Note>
          {!b.compact && (
            <>
              <Note {...top(2016)} dx={-12} dy={10} anchor="end">
                {["Curry 402,", "Thompson 276"]}
              </Note>
              <Note {...top(2024)} dy={-8} anchor="middle">
                73
              </Note>
              <Note {...top(2006)} dy={-8} anchor="middle">
                70
              </Note>
            </>
          )}
        </>
      ),
    };
  };

  return (
    <Chart
      label="Bar chart of the gap in threes made between the league leader and the runner-up in each season from 1979–80 to 2025–26. The 2015–16 bar, 126, is the tallest. The next largest is 73, in 2023–24."
      build={build}
      snap="x"
      ratio={0.46}
      minH={230}
      maxH={330}
      margin={{ left: 34, right: 10, top: 22 }}
      tip={(d) => (
        <>
          <strong>Gap of {d[2] - d[4]}</strong>
          <span>
            {d[1]}, {d[2]}
          </span>
          <span>
            {d[3]}, {d[4]}
          </span>
          <span>{season(d[0])}</span>
        </>
      )}
    />
  );
}

/* ── Fig. 3: attempts against accuracy ──────────────────────────────────── */
function VolumeChart() {
  const build = (b) => {
    const x = lin(400, 1060, b.l, b.r);
    const y = lin(27, 51, b.bt, b.t);
    const iso = (makes, from) => {
      const pts = [];
      for (let a = from; a <= 1060; a += 10) pts.push(`${x(a).toFixed(1)} ${y((100 * makes) / a).toFixed(1)}`);
      return "M" + pts.join(" L");
    };
    const points = VOLUME.map((d) => ({ x: x(d[0]), y: y(d[1]), d }));
    const find = (name, yr) => points.find((p) => p.d[2] === name && p.d[3] === yr);
    const curry = find("Stephen Curry", 2016);
    const harden = find("James Harden", 2019);
    const korver = find("Kyle Korver", 2015);
    const others = points.filter((p) => p.d[2] === "Stephen Curry" && p.d[3] !== 2016);
    return {
      points,
      svg: (
        <>
          <YAxis b={b} y={y} ticks={[30, 35, 40, 45, 50]} fmt={(t) => `${t}%`} />
          <XAxis b={b} x={x} ticks={b.compact ? [400, 600, 800, 1000] : [400, 500, 600, 700, 800, 900, 1000]} fmt={num} title="three-point attempts" />
          <path className="ch-iso" d={iso(300, 590)} />
          <path className="ch-iso ch-iso--strong" d={iso(402, 790)} />
          <text className="ch-tick" x={x(606)} y={y(49.3) - 4} textAnchor="start">
            300 makes
          </text>
          <text className="ch-tick ch-tick--ink" x={x(960)} y={y(41.9) - 8} textAnchor="start">
            402 makes
          </text>
          {points.map((p, i) => (
            <circle key={i} className="ch-field" cx={p.x} cy={p.y} r={b.compact ? 1.8 : 2.3} />
          ))}
          {others.map((p) => (
            <circle key={p.d[3]} className="ch-ref" cx={p.x} cy={p.y} r="4.5" />
          ))}
          {(b.compact ? [harden] : [harden, korver]).map((p) => (
            <circle key={p.d[2]} className="ch-dot ch-ring" cx={p.x} cy={p.y} r="4" />
          ))}
          <circle className="ch-accent ch-ring" cx={curry.x} cy={curry.y} r="5.5" />
          <Note {...curry} dx={10} dy={-8} strong>
            {b.compact ? "Curry, ’16" : ["Curry, 2015–16", "886 at 45.4%"]}
          </Note>
          {b.compact ? (
            <Note {...harden} dx={-9} dy={4} anchor="end">
              Harden, ’19
            </Note>
          ) : (
            <Note {...harden} dx={-2} dy={22} anchor="end">
              {["Harden, 2018–19", "1,028 at 36.8%"]}
            </Note>
          )}
          {!b.compact && (
            <Note {...korver} dx={9} dy={4}>
              Korver, 2014–15
            </Note>
          )}
        </>
      ),
    };
  };

  return (
    <Chart
      label="Scatter plot of three-point attempts against three-point percentage for every NBA season with at least 400 attempts. A curve marks the combinations that produce 402 makes. Stephen Curry's 2015–16 season, 886 attempts at 45.4 percent, is the only point on it. James Harden's 2018–19, 1,028 attempts at 36.8 percent, is the nearest."
      build={build}
      ratio={0.66}
      maxH={460}
      margin={{ left: 40, right: 12, bottom: 46 }}
      tip={(d) => (
        <>
          <strong>
            {d[4]} of {num(d[0])} ({d[1].toFixed(1)}%)
          </strong>
          <span>{d[2]}</span>
          <span>{season(d[3])}</span>
        </>
      )}
    />
  );
}

/* ── Fig. 4: accuracy by distance, 2015–16 ──────────────────────────────── */
function DistanceChart() {
  const TWO = 49.1; // league two-point percentage, 2015–16
  const build = (b) => {
    const band = (b.r - b.l) / DISTANCE.length;
    const cx = (i) => b.l + band * (i + 0.5);
    const y = lin(0, 62, b.bt, b.t);
    const rows = DISTANCE.map((d, i) => ({ d, x: cx(i), c: (100 * d[1]) / d[2], o: (100 * d[3]) / d[4] }));
    const points = rows.map((r) => ({ x: r.x, y: y(r.c), d: r.d, r: 9 }));
    return {
      points,
      svg: (
        <>
          <YAxis b={b} y={y} ticks={[0, 20, 40, 60]} fmt={(t) => `${t}%`} />
          <line className="ch-axis" x1={b.l} x2={b.r} y1={b.bt} y2={b.bt} />
          <line className="ch-refline" x1={b.l} x2={b.r} y1={y(TWO)} y2={y(TWO)} />
          {rows.map((r) => (
            <g key={r.d[0]}>
              <line className="ch-leader" x1={r.x} x2={r.x} y1={y(r.c)} y2={y(r.o)} />
              <circle className="ch-ref" cx={r.x} cy={y(r.o)} r="6" />
              <circle className="ch-accent ch-ring" cx={r.x} cy={y(r.c)} r="6.5" />
              <text className="ch-note ch-note--strong" x={r.x} y={y(r.c) - 12} textAnchor="middle">
                {r.c.toFixed(0)}%
              </text>
              <text className="ch-note" x={r.x} y={y(r.o) + 21} textAnchor="middle">
                {r.o.toFixed(0)}%
              </text>
              <text className="ch-tick" x={r.x} y={b.bt + 16} textAnchor="middle">
                {b.compact ? r.d[0].replace(" ft", "").replace("Under ", "<") : r.d[0]}
              </text>
            </g>
          ))}
          <text className="ch-tick" x={b.r} y={b.bt + 32} textAnchor="end">
            {b.compact ? "shot distance (ft)" : "shot distance"}
          </text>
        </>
      ),
    };
  };

  return (
    <Chart
      label="Dot plot of three-point percentage by shot distance in 2015–16 for Stephen Curry and for the rest of the league. Curry is above 42 percent in every range and at 52 percent from 28 to 35 feet, where the rest of the league shot 25 percent."
      build={build}
      snap="x"
      ratio={0.5}
      minH={250}
      maxH={340}
      margin={{ left: 40, right: 12, bottom: 46 }}
      tip={(d) => (
        <>
          <strong>{d[0]}</strong>
          <span>
            Curry: {d[1]} of {d[2]} ({pct(d[1], d[2])})
          </span>
          <span>
            Rest of league: {num(d[3])} of {num(d[4])} ({pct(d[3], d[4])})
          </span>
        </>
      )}
    />
  );
}

/* ── Fig. 5: scoring volume against efficiency ──────────────────────────── */
function ScoringChart() {
  const build = (b) => {
    const x = lin(24.6, 38, b.l, b.r);
    const y = lin(-5, 14.5, b.bt, b.t);
    const points = SCORERS.map((d) => ({ x: x(d[0]), y: y(d[1]), d }));
    const find = (name, yr) => points.find((p) => p.d[2] === name && p.d[3] === yr);
    const curry = find("Stephen Curry", 2016);
    const named = [
      [find("Charles Barkley", 1988), "Barkley, 1987–88", { dx: -9, dy: 4, anchor: "end" }],
      [find("Adrian Dantley", 1984), "Dantley, 1983–84", { dx: 9, dy: 4 }],
      [find("Kevin Durant", 2014), "Durant, 2013–14", { dx: 9, dy: -5 }],
      [find("James Harden", 2019), "Harden, 2018–19", { dx: 0, dy: -11, anchor: "middle" }],
      [find("Michael Jordan", 1987), "Jordan, 1986–87", { dx: 6, dy: -10, anchor: "end" }],
      [find("Allen Iverson", 2002), "Iverson, 2001–02", { dx: 9, dy: 4 }],
    ];
    const shown = named.filter(([, text]) => !b.compact || /Barkley|Jordan/.test(text));
    return {
      points,
      svg: (
        <>
          <YAxis b={b} y={y} ticks={[-5, 0, 5, 10]} fmt={(t) => (t > 0 ? `+${t}` : `${t}`)} />
          <XAxis b={b} x={x} ticks={b.compact ? [25, 30, 35] : [25, 27.5, 30, 32.5, 35, 37.5]} title="points per game" />
          <line className="ch-refline" x1={b.l} x2={b.r} y1={y(0)} y2={y(0)} />
          <text className="ch-tick ch-tick--ink" x={b.r} y={y(0) + 14} textAnchor="end">
            League-average efficiency
          </text>
          {points.map((p, i) => (
            <circle key={i} className="ch-field" cx={p.x} cy={p.y} r={b.compact ? 2.2 : 2.8} />
          ))}
          {shown.map(([p, text]) => (
            <circle key={text} className="ch-dot ch-ring" cx={p.x} cy={p.y} r="4" />
          ))}
          <circle className="ch-accent ch-ring" cx={curry.x} cy={curry.y} r="5.5" />
          <Note {...curry} dx={10} dy={-6} strong>
            {b.compact ? "Curry, ’16" : "Curry, 2015–16"}
          </Note>
          {shown.map(([p, text, pos]) => (
            <Note key={text} {...p} {...pos}>
              {b.compact ? text.replace(/, \d{4}–/, ", ’") : text}
            </Note>
          ))}
        </>
      ),
    };
  };

  return (
    <Chart
      label="Scatter plot of points per game against true shooting percentage relative to the league, for every season of 25 or more points per game since 1979–80. Stephen Curry's 2015–16 season, 30.1 points at 12.8 points above league average, is the highest point. Charles Barkley's 1987–88 is just below it at 28.3 points."
      build={build}
      ratio={0.66}
      maxH={460}
      margin={{ left: 34, right: 12, bottom: 46, top: 18 }}
      tip={(d) => (
        <>
          <strong>
            {d[0].toFixed(1)} ppg, {d[1] > 0 ? "+" : ""}
            {d[1].toFixed(1)}
          </strong>
          <span>{d[2]}</span>
          <span>
            {season(d[3])} · {d[4].toFixed(1)}% true shooting
          </span>
        </>
      )}
    />
  );
}

/* ── Horizontal bars, label above each bar. rows: [label, value, isCurry] ── */
function RowBars({ rows, max, fmt = String, label, tip }) {
  const ROW = 46;
  const height = rows.length * ROW + 6;
  const build = (b) => {
    const x = lin(0, max, b.l, b.r - 46); // room for the value at the tip
    const points = rows.map((d, i) => ({ x: x(d[1]), y: b.t + i * ROW + 27, d, r: 0 }));
    return {
      points,
      svg: rows.map((d, i) => {
        const top = b.t + i * ROW;
        const end = x(d[1]);
        return (
          <g key={d[0]}>
            <text className={`ch-note ${d[2] ? "ch-note--strong" : ""}`} x={b.l} y={top + 12}>
              {d[0]}
            </text>
            <path
              className={d[2] ? "ch-accent" : "ch-bar"}
              d={`M${b.l} ${top + 20} H${end - 3} Q${end} ${top + 20} ${end} ${top + 23} V${top + 31} Q${end} ${top + 34} ${end - 3} ${top + 34} H${b.l} Z`}
            />
            <text className="ch-note ch-note--strong" x={end + 8} y={top + 31.5}>
              {fmt(d[1])}
            </text>
          </g>
        );
      }),
    };
  };
  return (
    <Chart label={label} build={build} snap="y" ratio={0} minH={height} maxH={height} margin={{ left: 0, right: 0, top: 2, bottom: 4 }} tip={tip} />
  );
}

/* ── Fig. 4: running total by game ──────────────────────────────────────── */
function PaceChart() {
  const OLD_RECORD = 286;
  const build = (b) => {
    const x = lin(1, 80, b.l + 4, b.r - (b.compact ? 66 : 104));
    const y = lin(0, 430, b.bt, b.t);
    const path = (k) =>
      "M" + PACE.filter((d) => d[k] != null).map((d) => `${x(d[0]).toFixed(1)} ${y(d[k]).toFixed(1)}`).join(" L");
    const mine = PACE.filter((d) => d[1] != null);
    const points = mine.map((d) => ({ x: x(d[0]), y: y(d[1]), d }));
    const last = mine[mine.length - 1];
    const other = PACE[PACE.length - 1];
    const passed = mine.find((d) => d[1] > OLD_RECORD);
    const [c0, c1, perGame] = COLDEST;
    return {
      points,
      svg: (
        <>
          <rect className="ch-band" x={x(c0 - 0.5)} width={x(c1 + 0.5) - x(c0 - 0.5)} y={b.t} height={b.bt - b.t} />
          <YAxis b={b} y={y} ticks={[0, 100, 200, 300, 400]} />
          <XAxis b={{ ...b, r: x(80) }} x={x} ticks={b.compact ? [1, 40, 79] : [1, 20, 40, 60, 79]} title="his game number" />
          <text className="ch-tick ch-tick--ink" x={x((c0 + c1) / 2)} y={b.t + 12} textAnchor="middle">
            {b.compact ? "Coldest 20" : `Coldest 20 games: ${perGame.toFixed(1)} a game`}
          </text>
          <line className="ch-refline" x1={b.l} x2={x(80)} y1={y(OLD_RECORD)} y2={y(OLD_RECORD)} />
          <text className="ch-tick ch-tick--ink" x={b.l + 4} y={y(OLD_RECORD) - 6}>
            Old record, {OLD_RECORD}
          </text>
          <path className="ch-line-muted" d={path(2)} />
          <path className="ch-line-accent" d={path(1)} />
          <circle className="ch-dot ch-ring" cx={x(passed[0])} cy={y(passed[1])} r="4" />
          {!b.compact && (
            <Note x={x(passed[0])} y={y(passed[1])} dx={-12} dy={-34} anchor="end" leader>
              {[`Game ${passed[0]}, Feb 27`, "passes the record"]}
            </Note>
          )}
          <circle className="ch-accent ch-ring" cx={x(last[0])} cy={y(last[1])} r="5" />
          <Note x={x(last[0])} y={y(last[1])} dx={9} dy={4} strong>
            {`Curry, ${last[1]}`}
          </Note>
          <Note x={x(other[0])} y={y(other[2])} dx={8} dy={4}>
            {b.compact ? `${other[2]}` : `Thompson, ${other[2]}`}
          </Note>
        </>
      ),
    };
  };

  return (
    <Chart
      label="Line chart of running three-point totals by game in 2015–16. Stephen Curry passes the old record of 286 in his 56th game and finishes with 402. Klay Thompson, who finished second, ends at 276 after 80 games."
      build={build}
      snap="x"
      margin={{ left: 34, right: 0, bottom: 46 }}
      tip={(d) => (
        <>
          <strong>{d[1]} threes</strong>
          <span>
            Game {d[0]}, {d[3]}
          </span>
          <span>
            {d[4]} that night{d[2] != null ? ` · Thompson after ${d[0]} games: ${d[2]}` : ""}
          </span>
        </>
      )}
    />
  );
}

/* ── Fig. 5: the average team's threes per game ─────────────────────────── */
function TeamsChart() {
  const CURRY_PER_GAME = 402 / 79;
  const build = (b) => {
    const x = lin(1979.5, 2026.5, b.l, b.r);
    const y = lin(0, 15, b.bt, b.t);
    const points = TEAM_AVERAGE.map((d) => ({ x: x(d[0]), y: y(d[1]), d }));
    const d = "M" + points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L");
    const y2001 = points.find((p) => p.d[0] === 2001);
    const end = points[points.length - 1];
    return {
      points,
      svg: (
        <>
          <rect className="ch-band" x={x(1994.5)} width={x(1997.5) - x(1994.5)} y={b.t} height={b.bt - b.t} />
          <YAxis b={b} y={y} ticks={[0, 5, 10, 15]} />
          <XAxis b={b} x={x} ticks={b.compact ? [1980, 2000, 2020] : [1980, 1990, 2000, 2010, 2020]} />
          <line className="ch-refline-accent" x1={b.l} x2={b.r} y1={y(CURRY_PER_GAME)} y2={y(CURRY_PER_GAME)} />
          <text className="ch-note ch-note--strong" x={b.l + 4} y={y(CURRY_PER_GAME) - 8}>
            {b.compact ? "Curry, 5.09" : "Curry alone: 5.09 a game"}
          </text>
          <path className="ch-line" d={d} />
          <circle className="ch-dot ch-ring" cx={y2001.x} cy={y2001.y} r="4" />
          <Note {...y2001} dx={8} dy={17}>
            {b.compact ? "’01: 4.85" : "2000–01: 4.85"}
          </Note>
          <Note {...end} dx={-2} dy={-10} anchor="end">
            {`Average team, ${end.d[1].toFixed(1)}`}
          </Note>
        </>
      ),
    };
  };

  return (
    <Chart
      label="Line chart of three-pointers made per game by the average NBA team in each season from 1979–80 to 2025–26, with a horizontal line at 5.09, the number Stephen Curry made per game by himself in 2015–16. The average team was below that line as recently as 2000–01."
      build={build}
      snap="x"
      ratio={0.5}
      minH={240}
      maxH={350}
      margin={{ left: 30, right: 10 }}
      tip={(d) => (
        <>
          <strong>{d[1].toFixed(2)} a game</strong>
          <span>Average team, {season(d[0])}</span>
        </>
      )}
    />
  );
}

/* ── Fig. 10: the leader's total against league volume ──────────────────── */
function TrendChart() {
  const [a, slope] = TREND_FIT;
  const fit = (v) => a + slope * v;
  const needed = (402 - a) / slope;
  const build = (b) => {
    const x = lin(10, 51, b.l, b.r);
    const y = lin(150, 430, b.bt, b.t);
    const points = TREND.map((d) => ({ x: x(d[1]), y: y(d[2]), d }));
    const find = (yr) => points.find((p) => p.d[0] === yr);
    const curry = find(2016);
    const lastX = TREND[TREND.length - 2][1] > TREND[TREND.length - 1][1] ? TREND[TREND.length - 2][1] : TREND[TREND.length - 1][1];
    const firstX = TREND[0][1];
    return {
      points,
      svg: (
        <>
          <YAxis b={b} y={y} ticks={[200, 300, 400]} />
          <XAxis b={b} x={x} ticks={[10, 20, 30, 40, 50]} title={b.compact ? "team 3PA per game" : "three-point attempts per team per game"} />
          <line className="ch-leader" x1={x(needed)} x2={x(needed)} y1={y(402)} y2={b.bt} />
          <path className="ch-fit" d={`M${x(firstX)} ${y(fit(firstX))} L${x(lastX)} ${y(fit(lastX))}`} />
          <path className="ch-fit ch-fit--projected" d={`M${x(lastX)} ${y(fit(lastX))} L${x(needed)} ${y(402)}`} />
          {points.map((p) => (
            <circle key={p.d[0]} className="ch-bar" cx={p.x} cy={p.y} r={b.compact ? 3 : 3.5} />
          ))}
          <circle className="ch-dot ch-ring" cx={x(needed)} cy={y(402)} r="4" />
          <Note x={x(needed)} y={y(402)} dx={-9} dy={-9} anchor="end">
            {b.compact ? "Trend hits 402 at 48" : "The trend reaches 402 at 48 a game"}
          </Note>
          <circle className="ch-accent ch-ring" cx={curry.x} cy={curry.y} r="5.5" />
          <Note {...curry} dx={-10} dy={4} anchor="end" strong>
            {b.compact ? "Curry, ’16" : "Curry, 2015–16"}
          </Note>
          {!b.compact && (
            <>
              <Note {...find(2019)} dx={-9} dy={-6} anchor="end">
                Harden, 2018–19
              </Note>
              <Note {...find(2026)} dx={9} dy={12}>
                2025–26
              </Note>
            </>
          )}
        </>
      ),
    };
  };

  return (
    <Chart
      label="Scatter plot of the league leader's three-point total against three-point attempts per team per game, for each season since 1997–98, with a fitted line. The line predicts 268 for 2015–16. Stephen Curry made 402. Extended, the line reaches 402 when teams take 48 threes a game. In 2025–26 they took 37."
      build={build}
      ratio={0.62}
      maxH={440}
      margin={{ left: 34, right: 12, bottom: 46, top: 18 }}
      tip={(d) => (
        <>
          <strong>{d[2]} threes</strong>
          <span>
            {d[3]}, {season(d[0])}
          </span>
          <span>Teams took {d[1].toFixed(1)} a game</span>
        </>
      )}
    />
  );
}

/* ── Sections (also used for the table of contents) ─────────────────────── */
export const SECTIONS = [
  { id: "record", label: "The record moved by 116" },
  { id: "field", label: "Second place was 126 behind" },
  { id: "parts", label: "Parts of the season were enough" },
  { id: "teams", label: "One player against whole teams" },
  { id: "tradeoff", label: "Volume and accuracy" },
  { id: "scoring", label: "It wasn't only the threes" },
  { id: "since", label: "Ten seasons of trying" },
  { id: "takes", label: "What it would take" },
  { id: "caveats", label: "What I'd be careful about" },
  { id: "verdict", label: "So can it happen again?" },
];

const STATS = [
  { value: "402", label: "Threes made", text: "The record going into the season was 286, and it was his." },
  { value: "126", label: "Ahead of second place", text: "Klay Thompson made 276. No other leader has finished more than 73 ahead." },
  { value: "45.4%", label: "On 886 attempts", text: "Nobody else has topped 41.6% on 700 or more." },
  { value: "+12.8", label: "True shooting vs. the league", text: "The widest margin for a scoring leader since at least 1979–80." },
];

const NEEDS = [
  ["45.4%", "Curry, 2015–16", "888", "10.8"],
  ["42%", "", "960", "11.7"],
  ["40%", "", "1,008", "12.3"],
  ["38%", "", "1,061", "12.9"],
  ["36.8%", "Harden, 2018–19", "1,096", "13.4"],
];

// Share of 100,000 replays of 2016–17 through 2025–26 in which someone reaches 402.
const REPLAYS = [
  ["With the attempts each player really took", "4.6%", "3.6%"],
  ["If every player had played all 82 games", "Nearly 100%", "30%"],
];

export default function Curry2016() {
  return (
    <>
      <div className="post__prose">
        <p className="post__lead">
          In 2014–15 Stephen Curry broke the record for threes in a season with 286. The next season he made 402.
        </p>
        <p>
          This is the first post on this blog, and I wanted to start with the craziest season I know of. I've written
          about it once already. In <Link to="/work/shot-dna">Shot DNA</Link> I compared players by where they shoot
          from, and 2015–16 was the one year the league had nobody who shot like Curry. That piece was about what kind
          of shots he took. This one is about how many went in, and about a claim I wanted to test: nobody is going to
          have that season again.
        </p>
        <p>
          To check it I pulled every player season since the NBA added the three-point line in 1979–80. That's 20,550
          of them. Most of the claim held up. One part didn't, and I get to it near the end.
        </p>
      </div>

      <dl className="outcomes post__stats">
        {STATS.map((s) => (
          <div key={s.label} className="has-value">
            <dt>
              <span className="outcomes__value">{s.value}</span>
              <span className="label label--muted">{s.label}</span>
            </dt>
            <dd>{s.text}</dd>
          </div>
        ))}
      </dl>

      <section className="post__prose" aria-labelledby="record">
        <h2 id="record">The record moved by 116</h2>
        <p>
          For most of the three-point era the record went up slowly. Dennis Scott made 267 in 1995–96, during the three
          seasons when the league moved the line in to 22 feet. It took ten years for Ray Allen to pass him, and he did
          it by two. Curry got to 272 in 2012–13 and 286 in 2014–15. So over 19 seasons the record went up by 19 threes.
        </p>
        <p>
          Then it went up by 116 in one season. That's a 41% jump. If somebody did that to the home run record, they
          would hit 103.
        </p>
      </section>

      <ChartFigure
        n={1}
        title="One season left the pack"
        sub="Threes made, the ten highest totals in each season"
        legend={[
          { kind: "field", label: "Top ten each season" },
          { kind: "line", label: "Record at the time" },
          { kind: "accent", label: "Curry, 2015–16" },
        ]}
        caption="Seasons are labeled by the year they ended, so 2016 is 2015–16. The shaded band is 1994–95 through 1996–97, when the three-point line was 22 feet all the way around. Hover or tap a dot for the player."
      >
        <RecordChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          For 35 years the top of the league moves up together, a few threes at a time. In 2015–16 one dot leaves the
          group.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="field">
        <h2 id="field">Second place was 126 behind</h2>
        <p>
          A record can jump because the whole league changed, which is what happened when the line moved in. That isn't
          what happened here. Klay Thompson finished second in 2015–16 with 276. At the time that would have been the
          second-highest total ever. Curry beat him by 126.
        </p>
      </section>

      <ChartFigure
        n={2}
        title="The biggest lead any three-point leader has had"
        sub="Threes made by the league leader minus the runner-up, by season"
        caption="Three seasons ended in a tie for first, so they have no bar. Hover or tap for the two players."
      >
        <GapChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          In the other 46 seasons, the biggest gap between first and second is 73. That was also Curry, in 2023–24.
        </p>
        <p>
          Here's another way to look at it. Among players who logged at least 1,500 minutes in 2015–16, the average was
          79 threes. Curry was five standard deviations above that.
        </p>
        <p>
          It shows up in single games too. A player made eight or more threes in a game 36 times that season. Curry
          had 16 of those. The other 20 were split among 14 players.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="parts">
        <h2 id="parts">Parts of the season were enough</h2>
        <p>
          Here's a different way to size it up. Take pieces of the season away and see how much is left.
        </p>
        <p>
          Start with fourth quarters. Golden State won a lot of games early, and in 21 of his 79 games Curry didn't
          take a shot after the third quarter. So I counted only the threes he made in the first three quarters.
          That's 337. The old record, set over full games, was 286.
        </p>
      </section>

      <ChartFigure
        n={3}
        title="Three quarters would have broken the record"
        sub="Threes made in 2015–16"
        caption="If every game that season had ended after the third quarter, he still breaks the record by 51. Counted from the shot-location data, which has 401 of his 402 makes."
      >
        <RowBars
          rows={THREE_QUARTERS}
          max={337}
          label="Bar chart. Stephen Curry made 337 threes in the first three quarters of games in 2015–16. The old full-season record was 286. Klay Thompson made 276 in full games and 221 in the first three quarters."
          tip={(d) => (
            <>
              <strong>{d[1]} threes</strong>
              <span>{d[0]}</span>
              {d[2] && <span>144 in first quarters, 70 in second, 123 in third</span>}
            </>
          )}
        />
      </ChartFigure>

      <section className="post__prose">
        <p>
          His first quarters are a season on their own. He made 144 threes in first quarters, and only 23 other
          players in the league made more than that all year.
        </p>
        <p>
          His slow stretches don't change the picture either. His coldest 20 games ran from November 20 to January 5.
          He averaged 4.1 threes a game over that stretch and shot 43.9%. Thompson averaged 3.45 for the season. At the
          pace of his worst 20 games, Curry makes 324 over his 79 games and still breaks the record by 38.
        </p>
      </section>

      <ChartFigure
        n={4}
        title="He had the title won in February"
        sub="Running total of threes by game, 2015–16"
        legend={[
          { kind: "line-accent", label: "Curry" },
          { kind: "line-muted", label: "Klay Thompson, who finished second" },
        ]}
        caption="The shaded band is his 20 games with the fewest threes. Hover or tap for each game."
      >
        <PaceChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          He matched Thompson's final total on February 25, in his 55th game, with 24 still to play. Two days later he
          passed his own record. He could have stopped in February and still led the league.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="teams">
        <h2 id="teams">One player against whole teams</h2>
        <p>
          Curry made 5.09 threes a game. As recently as 2000–01, the average NBA team made 4.85.
        </p>
      </section>

      <ChartFigure
        n={5}
        title="More threes than the average team used to make"
        sub="Threes made per game by the average team, by season"
        caption="The shaded band is the three seasons with the shorter line. Hover or tap for each season."
      >
        <TeamsChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          Since the line came in, 44% of the teams that played a full 82-game season finished with fewer than 402
          threes. The most recent was Memphis in 2012–13, with 382. That was three seasons before Curry did it alone.
        </p>
        <p>
          It holds for the deep ones too. From 28 to 35 feet he made 44. No other team made more than 27.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="tradeoff">
        <h2 id="tradeoff">Volume and accuracy usually trade off</h2>
        <p>
          Making 402 takes two things that don't normally go together. You have to shoot a lot, and you have to keep
          making them.
        </p>
        <p>
          The players who shoot 45% from three are usually specialists. They take open shots that someone else creates,
          and not that many of them. Kyle Korver shot 49.2% in 2014–15 on 449 attempts. The players who take 800 or
          more are stars making their own shots off the dribble, and they land in the high 30s. James Harden took 1,028
          in 2018–19 and made 36.8%.
        </p>
        <p>Curry took 886 and made 45.4%.</p>
      </section>

      <ChartFigure
        n={6}
        title="Nobody else has been near the 402 line"
        sub="Attempts and accuracy, every season with at least 400 three-point attempts"
        legend={[
          { kind: "field", label: "One player season" },
          { kind: "ref", label: "Curry's other seasons" },
          { kind: "accent", label: "Curry, 2015–16" },
        ]}
        caption="Each curve shows the combinations of attempts and accuracy that add up to the same number of makes. 707 seasons, 1979–80 through 2025–26."
      >
        <VolumeChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          There have been 23 seasons with 700 or more attempts. Curry's 45.4% is the best of them, and the next two are
          also his. The best by anyone else is Malik Beasley's 41.6% in 2024–25.
        </p>
        <p>
          The player who takes the most threes is usually not one of the most accurate. Since 1992–93 the league's
          attempts leader has typically ranked around 38th in three-point percentage among qualified shooters. Curry
          took 229 more than anyone else and ranked second out of 103. No attempts leader other than Curry has finished
          higher than fifth.
        </p>
        <p>
          A number I like for this is makes above average. It's how many more threes a player made than a
          league-average shooter would have made on the same attempts. Curry was 89 above average in 2015–16. Second on
          the all-time list is Curry again, at 66 in 2018–19. The best season by anyone else is Korver's, at 64.
        </p>
        <p>
          And these weren't easy shots. In{" "}
          <a href="https://sharadrpatel.github.io/shot-dna/analysis/story.html">the Shot DNA piece</a> I found that he
          took 85 shots from 28 feet and beyond,
          almost twice as many as anyone else, and made 44 of them.
        </p>
      </section>

      <ChartFigure
        n={7}
        title="He got better where everyone else falls off"
        sub="Three-point percentage by distance, 2015–16"
        legend={[
          { kind: "accent", label: "Curry" },
          { kind: "ref", label: "Rest of the league" },
          { kind: "refline", label: "League average on two-pointers, 49%" },
        ]}
        caption="Distances are measured from the shot coordinates. Heaves from 35 feet and beyond are left out. Hover or tap for makes and attempts."
      >
        <DistanceChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          From 28 feet and out he shot 52%. The rest of the league shot 25% from there. The league as a whole made 49%
          of its two-pointers that year, so a Curry three from four feet behind the line went in more often than an
          average two.
        </p>
        <p>
          Put that in points. A Curry three was worth 1.36 points every time he took one. The league's average shot at
          the rim was worth 1.20.
        </p>
      </section>

      <ChartFigure
        n={8}
        title="A Curry three was worth more than a shot at the rim"
        sub="Points per shot, 2015–16"
        caption="Shots at the rim are those in the restricted area. The top bar is 85 shots, so I wouldn't lean on its second decimal."
      >
        <RowBars
          rows={SHOT_VALUE}
          max={1.55}
          fmt={(v) => v.toFixed(2)}
          label="Bar chart of points per shot in 2015–16. Stephen Curry from 28 feet and out, 1.55. Two free throws by a league-average shooter, 1.51. All of Curry's threes, 1.36. League-average shots at the rim, 1.20. League-average threes, 1.06. League-average twos, 0.98."
          tip={(d) => (
            <>
              <strong>{d[1].toFixed(2)} points</strong>
              <span>{d[0]}</span>
            </>
          )}
        />
      </ChartFigure>

      <section className="post__prose">
        <p>
          His shots from 28 feet and out were worth 1.55 each. Sending an average shooter to the line for two free
          throws costs you 1.51. So fouling an ordinary player was cheaper than letting Curry shoot from 28 feet.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="scoring">
        <h2 id="scoring">It wasn't only the threes</h2>
        <p>
          He also led the league in scoring, at 30.1 points a game, and he did it in 34.2 minutes a night.
        </p>
        <p>
          True shooting percentage rolls twos, threes, and free throws into one efficiency number. Curry's was 66.9% in
          a league that averaged 54.1%. That 12.8-point margin is the widest for any scoring leader since 1979–80,
          which is as far back as I looked. The next closest is Adrian Dantley in 1983–84, at 10.9.
        </p>
      </section>

      <ChartFigure
        n={9}
        title="The most efficient 30-point season"
        sub="True shooting percentage minus the league average, by points per game"
        legend={[
          { kind: "field", label: "Every 25-point scorer since 1979–80" },
          { kind: "accent", label: "Curry, 2015–16" },
        ]}
        caption="313 seasons of at least 25 points per game and 58 games played. Further up means more efficient than the league that year."
      >
        <ScoringChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          He shot 50.4% from the field, 45.4% from three, and 90.8% at the line. It's the only 50–40–90 season by a
          player who averaged 30 points. Larry Bird came closest, at 29.9 in 1987–88.
        </p>
        <p>The Warriors went 73–9, which is still the best record ever, and he was the first unanimous MVP.</p>
      </section>

      <section className="post__prose" aria-labelledby="since">
        <h2 id="since">Ten seasons of trying</h2>
        <p>
          This is the part that convinced me. The league didn't stay where it was. In 2015–16 teams took 24.1 threes a
          game. In 2024–25 they took 37.6, which is 56% more.
        </p>
        <p>
          Some of that shows up at the top. Before 2015–16 nobody had made 300 threes in a season. Since then it has
          happened nine more times, and five of those are Curry.
        </p>
        <p>
          But 400 has still happened once. The closest anyone has come is Harden's 378 in 2018–19, and he needed 142
          more attempts than Curry to finish 24 short. After that it's Curry himself, with 357 in 2023–24. The leader
          in 2025–26 was Kon Knueppel, a rookie, with 273.
        </p>
        <p>
          The extra threes didn't go to one player. They got spread around. Curry made 1.9% of all the threes in the
          league in 2015–16. Knueppel led the league with 0.8%. To take the share Curry took, a player in 2025–26 would
          have needed about 630.
        </p>
        <p>
          I also asked what the league leader should have made in 2015–16. Since 1997–98 the leader's total has tracked
          how many threes teams take. Each extra attempt per team per game has been worth about 5.5 more threes for
          the leader. For 2015–16 that line says 268. Curry was 134 over it, and a typical miss is about 33.
        </p>
      </section>

      <ChartFigure
        n={10}
        title="By the trend, 402 is still a long way off"
        sub="The league leader's threes against how many threes teams take, each season since 1997–98"
        caption="The line is fit to every season except 2015–16. The dashed part is beyond anything the league has done. Shortened seasons are scaled to 82 games."
      >
        <TrendChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          The line doesn't reach 402 until teams are taking 48 threes a game. They took 37 in 2025–26, slightly fewer
          than the season before.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="takes">
        <h2 id="takes">What it would take</h2>
        <p>Getting to 403 is a multiplication problem: attempts times accuracy.</p>
      </section>

      <div className="post__table">
        <table>
          <caption className="visually-hidden">Three-point attempts needed to make 403 at different accuracies</caption>
          <thead>
            <tr>
              <th scope="col">If you shoot</th>
              <th scope="col" className="is-num">
                Attempts needed
              </th>
              <th scope="col" className="is-num">
                Per game, 82 games
              </th>
            </tr>
          </thead>
          <tbody>
            {NEEDS.map(([p, who, att, per]) => (
              <tr key={p}>
                <th scope="row">
                  {p}
                  {who && <span>{who}</span>}
                </th>
                <td className="is-num">{att}</td>
                <td className="is-num">{per}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="post__prose">
        <p>
          Only one player has ever taken 900 threes in a season, and that was Harden. Only Curry has shot 42% on 700 or
          more. Breaking the record means doing both in the same year, or being Curry.
        </p>
        <p>
          I also tried it as a probability problem. Treat every three as a coin flip with a fixed chance of going in,
          and give a shooter the same 886 attempts. A true 40% shooter gets to 402 about once in 1,500 seasons. A 42%
          shooter gets there about 2% of the time.
        </p>
        <p>
          Curry made 41.9% of his threes across all of his other seasons. Plug that in and even he gets to 402 about
          once in 50 tries. So 2015–16 was the best three-point shooter ever, taking more threes than in any other
          season of his career, in the best shooting year of his life. All three had to line up.
        </p>
        <p>
          The last thing I did was replay the ten seasons since. Every player with 300 or more attempts keeps the
          attempts he really took and gets a true three-point percentage based on his career. His makes are then drawn
          at random. I ran that 100,000 times. The record fell in 4.6% of the replays, and only two seasons ever got
          there: Harden's 2018–19, about 3.5% of the time, and Curry's 2023–24, about 1%.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="caveats">
        <h2 id="caveats">What I'd be careful about</h2>
        <p>
          The number 402 isn't safe, and this is the part of the claim that didn't hold up. Per game, Curry has beaten
          his 2015–16 pace twice. He made 5.35 a game in 2020–21 and 5.13 in 2018–19, against 5.09 in 2015–16. He just
          didn't play enough games either time. At his 2020–21 rate over the 79 games he played in 2015–16, he makes
          423. So the record has been within reach for exactly one player, and he turns 39 in March 2027.
        </p>
        <p>
          The replays say the same thing. If I give every player a full 82 games at his own rate, the record falls
          almost every time, and it's nearly always Curry in 2020–21. Take Curry out and it falls in 30% of the
          replays, nearly all of them Harden in 2018–19.
        </p>
      </section>

      <div className="post__table">
        <table>
          <caption className="visually-hidden">How often the record falls in 100,000 replays of the ten seasons since</caption>
          <thead>
            <tr>
              <th scope="col">Replaying 2016–17 to 2025–26</th>
              <th scope="col" className="is-num">
                Record falls
              </th>
              <th scope="col" className="is-num">
                Without Curry
              </th>
            </tr>
          </thead>
          <tbody>
            {REPLAYS.map(([scenario, all, without]) => (
              <tr key={scenario}>
                <th scope="row">{scenario}</th>
                <td className="is-num">{all}</td>
                <td className="is-num">{without}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="post__prose">
        <p>
          Measures like standard deviations get strange when almost nobody shoots. By that measure Darrell Griffith in
          1983–84 was further from the pack than Curry, because he made 91 threes when the average regular made about
          six. I read those early seasons as a league that hadn't figured out the shot yet. But it does mean "biggest
          outlier ever" depends on where you start counting.
        </p>
        <p>
          On efficiency, Charles Barkley in 1987–88 is close to a tie. He was 12.7 points above the league's true
          shooting on 28.3 points a game. He just wasn't the scoring leader.
        </p>
        <p>
          The coin-flip model is crude. Shots aren't independent and they aren't equally hard, and a defense treats a
          player differently once he's making everything. I'd trust the order of magnitude and not the decimals.
        </p>
        <p>
          League averages here are added up from player totals, and true shooting uses the usual 0.44 weight on free
          throws. The shot-location data is missing 2 of Curry's 886 three-point attempts and about 0.3% of the
          league's, so the quarter-by-quarter counts could each be one low. Everything is regular season only.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="verdict">
        <h2 id="verdict">So can it happen again?</h2>
        <p>
          Somebody might make 403 threes one day. It would take a full, healthy season from a shooter as good as Curry
          who takes more threes than Curry ever took. Nobody like that has shown up in ten seasons of the league
          shooting far more threes than it used to.
        </p>
        <p>
          What I don't think happens again is the season. He broke the record by 41%. He finished 126 ahead of second
          place. He shot 45% on the most three-point attempts anyone had ever taken, and he led the league in scoring
          more efficiently than any scoring leader of the three-point era. Any one of those is a career year, and he
          did all four at once.
        </p>
      </section>

      <p className="post__source">
        Statistics are from Basketball-Reference season totals, 1979–80 through 2025–26, plus NBA.com shot charts and
        ESPN box scores for 2015–16. Regular season only. The numbers behind the charts:{" "}
        <a href="/data/curry-2015-16-top10-by-season.csv">top ten by season</a>,{" "}
        <a href="/data/curry-2015-16-volume-accuracy.csv">attempts and accuracy</a>,{" "}
        <a href="/data/curry-2015-16-scorers.csv">scoring and efficiency</a>.
      </p>
    </>
  );
}

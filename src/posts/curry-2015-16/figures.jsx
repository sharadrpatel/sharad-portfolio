// Every chart in the post. The text lives in index.jsx.
import { Chart, YAxis, XAxis, Note, lin, season } from "../../components/charts.jsx";
import {
  TOP10, GAPS, VOLUME, SCORERS, DISTANCE,
  THREE_QUARTERS, PACE, COLDEST, TEAM_AVERAGE, SHOT_VALUE, TREND, TREND_FIT,
  REGULARS, REGULARS_SPREAD, GAME_STRIPS, MAKES_CURRY, MAKES_RUNNER_UP,
} from "./data.js";

const pct = (n, d) => `${((100 * n) / d).toFixed(1)}%`;
const num = (n) => n.toLocaleString("en-US");

/* ── the ten highest totals in every season ─────────────────────── */
export function RecordChart() {
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

/* ── gap between first and second place ─────────────────────────── */
export function GapChart() {
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

/* ── attempts against accuracy ──────────────────────────────────── */
export function VolumeChart() {
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

/* ── accuracy by distance, 2015–16 ──────────────────────────────── */
export function DistanceChart() {
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

/* ── scoring volume against efficiency ──────────────────────────── */
export function ScoringChart() {
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

/* ── running total by game ──────────────────────────────────────── */
export function PaceChart() {
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

/* ── the average team's threes per game ─────────────────────────── */
export function TeamsChart() {
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

/* ── the leader's total against league volume ──────────────────── */
export function TrendChart() {
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

export function ThreeQuartersChart() {
  return (
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
  );
}

export function ShotValueChart() {
  return (
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
  );
}

/* ── Every regular as a dot, with a ruler in standard deviations ─────────── */
export function RulerChart() {
  const [mean, sd] = REGULARS_SPREAD;
  const BIN = 8; // threes per column of dots
  const build = (b) => {
    const x = lin(0, 410, b.l, b.r - 6);
    const r = b.compact ? 1.9 : 3;
    const step = r * 2 + 1;
    const stack = {};
    const points = REGULARS.map((d) => {
      const bin = Math.floor(d[0] / BIN);
      const k = (stack[bin] = (stack[bin] ?? 0) + 1);
      return { x: x(bin * BIN + BIN / 2), y: b.bt - 4 - (k - 1) * step - r, d };
    });
    const curry = points[points.length - 1];
    const second = points[points.length - 2];
    const rulerY = b.t + 26;
    return {
      points,
      svg: (
        <>
          <line className="ch-axis" x1={b.l} x2={b.r} y1={b.bt} y2={b.bt} />
          {[0, 100, 200, 300, 400].map((t) => (
            <text key={t} className="ch-tick" x={x(t)} y={b.bt + 16} textAnchor="middle">
              {t}
            </text>
          ))}
          <text className="ch-tick" x={b.r} y={b.bt + 32} textAnchor="end">
            threes made
          </text>
          <line className="ch-refline" x1={x(mean)} x2={x(mean + 5 * sd)} y1={rulerY} y2={rulerY} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <g key={k}>
              <line className="ch-refline" x1={x(mean + k * sd)} x2={x(mean + k * sd)} y1={rulerY - 4} y2={rulerY + 4} />
              <text className="ch-tick ch-tick--ink" x={x(mean + k * sd)} y={rulerY - 9} textAnchor="middle">
                {k === 0 ? (b.compact ? "avg" : `average, ${Math.round(mean)}`) : `+${k}${b.compact ? "" : " SD"}`}
              </text>
            </g>
          ))}
          <line className="ch-leader" x1={x(mean)} x2={x(mean)} y1={rulerY + 4} y2={b.bt} />
          <line className="ch-leader" x1={curry.x} x2={curry.x} y1={rulerY + 4} y2={curry.y - 8} />
          {points.slice(0, -1).map((p, i) => (
            <circle key={i} className="ch-bar" cx={p.x} cy={p.y} r={r} />
          ))}
          <circle className="ch-accent ch-ring" cx={curry.x} cy={curry.y} r="5.5" />
          <Note {...curry} dx={-10} dy={-12} anchor="end" strong>
            {b.compact ? "Curry, 402" : "Stephen Curry, 402"}
          </Note>
          <Note {...second} dy={-12} anchor="middle">
            {b.compact ? `${second.d[0]}` : `${second.d[1]}, ${second.d[0]}`}
          </Note>
        </>
      ),
    };
  };

  return (
    <Chart
      label="Dot plot of threes made in 2015–16 by every player with at least 1,500 minutes, one dot per player, with a ruler marking standard deviations above the average of 79. Most players are between 0 and 150. Klay Thompson is at 276, about three standard deviations above average. Stephen Curry is alone at 402, five standard deviations above."
      build={build}
      ratio={0.5}
      minH={270}
      maxH={340}
      margin={{ left: 6, right: 6, bottom: 44, top: 10 }}
      tip={(d) => (
        <>
          <strong>{d[0]} threes</strong>
          <span>{d[1]}</span>
        </>
      )}
    />
  );
}

/* ── One row per shooter, one cell per game ─────────────────────────────── */
export function GameStripsChart() {
  const ROW = 26;
  const height = GAME_STRIPS.length * ROW + 34;
  const shade = (v) => (v ? { fillOpacity: Math.min(1, 0.1 + v / 10) } : undefined);
  const build = (b) => {
    const labelW = b.compact ? 96 : 152;
    const cell = (b.r - b.l - labelW) / 82;
    const points = [];
    return {
      points,
      svg: (
        <>
          {GAME_STRIPS.map(([name, total, games], i) => {
            const top = b.t + i * ROW;
            return (
              <g key={name}>
                <text className={`ch-note ${i === 0 ? "ch-note--strong" : ""}`} x={b.l} y={top + 14}>
                  {b.compact ? name.split(" ").slice(-1)[0] : name}
                  <tspan className="ch-tick" dx="6">
                    {total}
                  </tspan>
                </text>
                {games.map((v, g) => {
                  const left = b.l + labelW + g * cell;
                  points.push({ x: left + cell / 2, y: top + 11, d: [name, g + 1, v], r: 0 });
                  return (
                    <rect key={g} className={v ? "ch-heat" : "ch-heat-zero"} style={shade(v)} x={left + 0.5} y={top + 2} width={Math.max(1, cell - 1)} height={ROW - 8} />
                  );
                })}
              </g>
            );
          })}
          {[0, 2, 4, 6, 8, 10].map((v, k) => (
            <g key={v}>
              <rect className={v ? "ch-heat" : "ch-heat-zero"} style={shade(v)} x={b.l + labelW + k * 30} y={height - 22} width="14" height="12" />
              <text className="ch-tick" x={b.l + labelW + k * 30 + 18} y={height - 12}>
                {v === 10 ? "10+" : v}
              </text>
            </g>
          ))}
          {!b.compact && (
            <text className="ch-tick" x={b.l + labelW + 190} y={height - 12}>
              threes in the game
            </text>
          )}
        </>
      ),
    };
  };

  return (
    <Chart
      label="Heat strips for the eight players who made the most threes in 2015–16. Each row is a player and each cell is one game, shaded darker for more threes. Stephen Curry's row is the darkest throughout and has no game without a three."
      build={build}
      ratio={0}
      minH={height}
      maxH={height}
      margin={{ left: 0, right: 0, top: 2, bottom: 2 }}
      tip={(d) => (
        <>
          <strong>
            {d[2]} {d[2] === 1 ? "three" : "threes"}
          </strong>
          <span>
            {d[0]}, game {d[1]}
          </span>
        </>
      )}
    />
  );
}

/* ── Every made three on a half court ───────────────────────────────────── */
const COURT_DEPTH = 40; // feet of court shown, measured from the baseline
const DEEP = 28;
const fromBasket = ([x, y]) => Math.hypot(x, y - 5.25);

function CourtChart({ makes, who }) {
  const shown = makes.filter(([, y]) => y <= COURT_DEPTH);
  const build = (b) => {
    const s = (b.r - b.l) / 50; // pixels per foot
    const X = (ft) => (b.l + b.r) / 2 + ft * s;
    const Y = (ft) => b.t + (COURT_DEPTH - ft) * s;
    const arc = 23.75 * s;
    const corner = 5.25 + Math.sqrt(23.75 ** 2 - 22 ** 2); // where the corner line meets the arc
    const points = shown.map((m) => ({ x: X(m[0]), y: Y(m[1]), d: m }));
    return {
      points,
      svg: (
        <>
          <g className="ch-court">
            <rect x={X(-25)} y={Y(COURT_DEPTH)} width={50 * s} height={COURT_DEPTH * s} />
            <path d={`M${X(-22)} ${Y(0)} V${Y(corner)} A${arc} ${arc} 0 0 1 ${X(22)} ${Y(corner)} V${Y(0)}`} />
            <rect x={X(-8)} y={Y(19)} width={16 * s} height={19 * s} />
            <circle cx={X(0)} cy={Y(19)} r={6 * s} />
            <circle cx={X(0)} cy={Y(5.25)} r={0.75 * s} />
            <line x1={X(-3)} x2={X(3)} y1={Y(4)} y2={Y(4)} />
          </g>
          {points.map((p, i) =>
            fromBasket(p.d) >= DEEP ? (
              <circle key={i} className="ch-accent" cx={p.x} cy={p.y} r="2.8" />
            ) : (
              <circle key={i} className="ch-make" cx={p.x} cy={p.y} r="2.2" />
            ),
          )}
        </>
      ),
    };
  };
  const deep = shown.filter((m) => fromBasket(m) >= DEEP).length;
  return (
    <div>
      <p className="chart-pair__title">
        {who} <span>{deep} from {DEEP} feet and beyond</span>
      </p>
      <Chart
        label={`Half-court map of every three ${who} made in 2015–16. ${deep} of them came from ${DEEP} feet and beyond.`}
        build={build}
        ratio={COURT_DEPTH / 50}
        minH={180}
        maxH={420}
        margin={{ left: 1, right: 1, top: 1, bottom: 1 }}
        tip={(d) => (
          <>
            <strong>{fromBasket(d).toFixed(0)} feet</strong>
            <span>{who}</span>
          </>
        )}
      />
    </div>
  );
}

export function ShotMaps() {
  return (
    <div className="chart-pair">
      <CourtChart makes={MAKES_CURRY} who="Stephen Curry" />
      <CourtChart makes={MAKES_RUNNER_UP} who="Klay Thompson" />
    </div>
  );
}

// Small presentational primitives shared across sections.
import { Link } from "../lib/router.jsx";
import { useInView } from "../lib/motion.js";
import { useScrub } from "../lib/scroll.js";

// Section opener: a full-width rule, the one-word title, and beside it the
// dek with a short factual note (counts, place) underneath. Arriving, the rule
// draws across and the title rises out of its line; while the head crosses
// the screen the title drifts in from the right and settles on the margin.
export function SectionHead({ id, title, dek, aside, night = false }) {
  const [ref, inView] = useInView();
  const drift = useScrub("through");
  return (
    <header ref={ref} className={`section-head ${inView ? "is-in" : ""} ${night ? "section-head--night" : ""}`}>
      <h2 id={id} className="h2 section-head__title" ref={drift}>
        <span className="mask">
          <span className="mask__in">{title}</span>
        </span>
      </h2>
      {(dek || aside) && (
        <div className="section-head__side">
          {dek && <p className="dek section-head__dek">{dek}</p>}
          {aside && <p className="section-head__aside">{aside}</p>}
        </div>
      )}
    </header>
  );
}

// A row of toggle buttons that narrows a list. Each shows how many entries it
// holds, so the bar doubles as a summary of what the section contains.
export function FilterBar({ label, options, value, onChange }) {
  return (
    <div className="filters" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className="filter"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
          <span className="filter__count">{o.count}</span>
        </button>
      ))}
    </div>
  );
}

// Tools and methods, set as an inline run of mono text rather than chips.
export function Tags({ items, label = "Tools and methods" }) {
  return (
    <ul className="tags" aria-label={label}>
      {items.map((t) => (
        <li key={t} className="tag">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Badge({ children, soft = false }) {
  return <span className={`badge ${soft ? "badge--soft" : ""}`}>{children}</span>;
}

export function Arrow({ dir = "right" }) {
  const d = {
    right: "M1 6h10M7 2l4 4-4 4",
    down: "M6 1v10M2 7l4 4 4-4",
    up: "M6 11V1M2 5l4-4 4 4",
    out: "M3 9l6-6M4 3h5v5",
    left: "M11 6H1M5 2L1 6l4 4",
  }[dir];
  return (
    <svg className={`arrow arrow--${dir}`} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

export function Button({ to, variant = "primary", icon, children, ...rest }) {
  return (
    <Link to={to} className={`btn btn--${variant}`} {...rest}>
      <span>{children}</span>
      {icon && <Arrow dir={icon} />}
    </Link>
  );
}

export function TextLink({ to, children, icon = "right", ...rest }) {
  return (
    <Link to={to} className="text-link" {...rest}>
      {icon === "left" && <Arrow dir={icon} />}
      <span>{children}</span>
      {icon !== "left" && <Arrow dir={icon} />}
    </Link>
  );
}

// Renders *text* as <em>, e.g. for species names in data strings.
export function Rich({ text }) {
  return text.split(/\*([^*]+)\*/).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));
}

export function Meta({ children }) {
  return <p className="meta">{children}</p>;
}

// "Aug 2024 – Present" → "2024–now"; "Oct 2025" → "2025"; "Aug 2023 – May 2024" → "2023–24".
export function shortPeriod(period) {
  if (!period) return null;
  const years = period.match(/\d{4}/g) ?? [];
  const ongoing = /present/i.test(period);
  if (!years.length) return period;
  if (ongoing) return `${years[0]}–now`;
  if (years.length > 1 && years[0] !== years[1]) return `${years[0]}–${years[1].slice(2)}`;
  return years[0];
}

export function isOngoing(period) {
  return /present/i.test(period ?? "");
}

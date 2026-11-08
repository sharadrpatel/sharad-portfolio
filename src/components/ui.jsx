// Small presentational primitives shared across sections.
import { Link } from "../lib/router.jsx";
import Scramble from "./Scramble.jsx";
import { useInView } from "../lib/motion.js";
import { useScrub } from "../lib/scroll.js";

// Section opener: a ruled line with the section number and a note, then a
// large one-word title with its dek set beside it. On scroll the rule draws
// across and the title rises out of a mask.
export function SectionHead({ id, number, title, dek, aside, night = false }) {
  // The title drifts sideways as the head passes through the viewport.
  const drift = useScrub("through");
  const [ref, inView] = useInView();
  return (
    <header ref={ref} className={`reveal section-head ${inView ? "is-in" : ""} ${night ? "section-head--night" : ""}`}>
      <div className="section-head__rule">
        <Scramble className="section-head__num" text={number} active={inView} />
        {aside && <span className="section-head__aside">{aside}</span>}
      </div>
      <div className="section-head__body" ref={drift}>
        <h2 id={id} className="h2 section-head__title">
          <Mask>{title}</Mask>
        </h2>
        {dek && <p className="dek section-head__dek">{dek}</p>}
      </div>
    </header>
  );
}

// Text that slides up out of its own line box when a parent .reveal comes in.
export function Mask({ children, delay = 0 }) {
  return (
    <span className="mask">
      <span className="mask__in" style={delay ? { "--mask-delay": `${delay}ms` } : undefined}>
        {children}
      </span>
    </span>
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

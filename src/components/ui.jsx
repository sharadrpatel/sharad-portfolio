// Small presentational primitives shared across sections.
import { Link } from "../lib/router.jsx";

export function SectionHead({ id, number, label, title, dek }) {
  return (
    <header className="section-head">
      <p className="section-head__label">
        <span className="section-head__num">{number}</span>
        <span>{label}</span>
      </p>
      <div className="section-head__body">
        <h2 id={id} className="h2">
          {title}
        </h2>
        {dek && <p className="dek">{dek}</p>}
      </div>
    </header>
  );
}

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
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

export function Meta({ children }) {
  return <p className="meta">{children}</p>;
}

import { PROFILE, CURRENTLY, AT_A_GLANCE } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Button, Arrow } from "../components/ui.jsx";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__intro">
          <p className="hero__eyebrow load-in" style={{ "--i": 0 }}>
            <span className="dot" aria-hidden="true" />
            {PROFILE.degree} · {PROFILE.school} · Class of {PROFILE.classOf}
          </p>
          <h1 id="hero-title" className="hero__name load-in" style={{ "--i": 1 }}>
            {PROFILE.name}
          </h1>
          <p className="hero__lead load-in" style={{ "--i": 2 }}>
            {PROFILE.lead}
          </p>
          <ul className="hero__disciplines load-in" style={{ "--i": 3 }} aria-label="Areas of work">
            {PROFILE.disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <div className="hero__actions load-in" style={{ "--i": 4 }}>
            <Button to="/#research" icon="down">Explore research</Button>
            <Button to="/#projects" variant="outline">View projects</Button>
            <Button to={PROFILE.cv} variant="ghost" icon="out" target="_blank" rel="noopener">
              CV
            </Button>
            <Button to="/#contact" variant="ghost">Contact</Button>
          </div>
        </div>

        <aside className="ledger load-in" style={{ "--i": 3 }} aria-labelledby="ledger-title">
          <div className="ledger__head">
            <h2 id="ledger-title" className="label">Currently</h2>
            <span className="label label--muted">Fall 2026</span>
          </div>
          <ol className="ledger__list">
            {CURRENTLY.map((c) => (
              <li key={c.what}>
                <Link to={c.href} className="ledger__item">
                  <span className="ledger__what">{c.what}</span>
                  <span className="ledger__where">
                    {c.where} <span aria-hidden="true">·</span> since {c.since}
                  </span>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <div className="wrap">
        <dl className="glance">
          {AT_A_GLANCE.map((g) => (
            <div key={g.label} className="glance__cell">
              <dt className="label label--muted">{g.label}</dt>
              <dd>
                <span className="glance__value">{g.value}</span>
                <span className="glance__note">{g.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

import { CURRENTLY } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Arrow } from "../components/ui.jsx";

export default function Now() {
  return (
    <section id="now" className="section section--night now" aria-labelledby="now-title">
      <div className="wrap now__grid">
        <div className="now__head">
          <h2 id="now-title" className="now__title">Now</h2>
          <p className="now__dek">
            What's in progress this semester, across the lab, the classroom, and the hospital.
          </p>
          <p className="now__kicker">
            <span className="status__dot" aria-hidden="true" />
            Fall 2026
          </p>
        </div>

        <ul className="now__list">
          {CURRENTLY.map((c) => (
            <li key={c.what}>
              <Link to={c.href} className="now__item">
                <span className="now__what">{c.what}</span>
                <span className="now__meta">
                  <span>{c.where}</span>
                  <span className="now__since">since {c.since}</span>
                </span>
                <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

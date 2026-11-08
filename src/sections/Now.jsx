import { CURRENTLY } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Arrow } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Now() {
  return (
    <section id="now" className="section section--night now" aria-labelledby="now-title">
      <div className="wrap now__grid">
        <div className="now__head">
          <p className="now__kicker">
            <span className="status__dot" aria-hidden="true" />
            Fall 2026
          </p>
          <h2 id="now-title" className="now__title">
            Now
          </h2>
          <p className="now__dek">
            What's in progress this semester, across the lab, the classroom, and the hospital.
          </p>
        </div>

        <Reveal as="ol" className="now__list">
          {CURRENTLY.map((c, i) => (
            <li key={c.what}>
              <Link to={c.href} className="now__item">
                <span className="now__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="now__what">{c.what}</span>
                <span className="now__where">
                  {c.where}
                  <span aria-hidden="true"> · </span>
                  since {c.since}
                </span>
                <Arrow />
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

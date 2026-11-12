import { CURRENTLY } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Arrow } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { useScrub } from "../lib/scroll.js";

export default function Now() {
  // The band opens from a framed panel to full width as it rises into view.
  const scene = useScrub("enter", { end: 0.2 });
  return (
    <section id="now" className="section section--night now" aria-labelledby="now-title" ref={scene}>
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

        <Reveal as="ul" className="now__list has-st">
          {CURRENTLY.map((c, i) => (
            <li key={c.what} className="st" style={{ "--si": i }}>
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
        </Reveal>
      </div>
    </section>
  );
}

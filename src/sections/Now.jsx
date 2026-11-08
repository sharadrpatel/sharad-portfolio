import { CURRENTLY } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Arrow, Mask } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { useScrub } from "../lib/scroll.js";

export default function Now() {
  // The band opens from a framed panel to full width as it rises into view.
  const scene = useScrub("enter", { end: 0.2 });
  return (
    <section id="now" className="section section--night now" aria-labelledby="now-title" ref={scene}>
      <div className="wrap now__grid">
        <div className="now__head">
          <p className="now__kicker">
            <span className="status__dot" aria-hidden="true" />
            Fall 2026
          </p>
          <Reveal as="h2" id="now-title" className="now__title">
            <Mask>Now</Mask>
          </Reveal>
          <p className="now__dek">
            What's in progress this semester, across the lab, the classroom, and the hospital.
          </p>
        </div>

        <Reveal as="ol" className="now__list has-st">
          {CURRENTLY.map((c, i) => (
            <li key={c.what} className="st" style={{ "--si": i }}>
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

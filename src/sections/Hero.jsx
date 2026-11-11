import { PROFILE, EDUCATION } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Button, Arrow } from "../components/ui.jsx";
import PhasePortrait from "../components/PhasePortrait.jsx";
import CountUp from "../components/CountUp.jsx";
import { INTRO } from "../lib/intro.js";

const [FIRST, ...REST] = PROFILE.name.split(" ");

const FACTS = [
  { label: "School", value: EDUCATION.school, note: EDUCATION.location },
  { label: "Degree", value: EDUCATION.degree, note: EDUCATION.minor },
  { label: "Graduation", value: EDUCATION.graduation, note: "Expected" },
  { label: "GPA", value: EDUCATION.gpa, note: "Out of 4.00", numeric: true },
];

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <h1 id="hero-title" className="hero__name">
          {/* With the intro, the name is assembled from points instead of rising. */}
          <span className="hero__name-line">
            <span className={INTRO ? "" : "mask-in"} style={{ "--i": 0 }}>{FIRST}</span>
          </span>{" "}
          <span className="hero__name-line">
            <span className={INTRO ? "" : "mask-in"} style={{ "--i": 1 }}>{REST.join(" ")}</span>
          </span>
        </h1>

        <div className="hero__grid">
          <div className="hero__intro load-in" style={{ "--i": 2 }}>
            <p className="hero__lead">{PROFILE.lead}</p>
            <ul className="tags hero__disciplines" aria-label="Areas of work">
              {PROFILE.disciplines.map((d) => (
                <li key={d} className="tag">{d}</li>
              ))}
            </ul>
            <div className="hero__actions">
              <Button to="/#research" icon="down">Research</Button>
              <Button to="/#projects" variant="outline">Projects</Button>
              <Button to={PROFILE.cv} variant="ghost" icon="out" target="_blank" rel="noopener">
                CV<span className="visually-hidden"> (PDF, opens in a new tab)</span>
              </Button>
            </div>
          </div>

          <figure className="hero__figure load-in" style={{ "--i": 3 }}>
            <PhasePortrait />
            <figcaption>
              A forced Duffing oscillator, integrated in your browser. Scroll to run its clock; turn up the
              forcing and it starts hopping between wells. The same equation runs the{" "}
              <Link to="/work/duffing-oscillator" className="hero__fig-link">
                tabletop chaos demo
                <Arrow />
              </Link>{" "}
              my team is building.
            </figcaption>
          </figure>

          <dl className="facts load-in" style={{ "--i": 4 }} aria-label="Education">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>
                  <span className="facts__value">{f.numeric ? <CountUp value={f.value} /> : f.value}</span>
                  <span className="facts__note">{f.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

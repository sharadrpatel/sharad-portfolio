import { PROFILE, EDUCATION } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Button, Arrow } from "../components/ui.jsx";
import PhasePortrait from "../components/PhasePortrait.jsx";

const [FIRST, ...REST] = PROFILE.name.split(" ");

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero__top load-in" style={{ "--i": 0 }}>
          <span>{PROFILE.degree}</span>
          <span className="hero__top-mid">{PROFILE.school}</span>
          <span>Class of {PROFILE.classOf}</span>
        </div>

        <h1 id="hero-title" className="hero__name">
          <span className="hero__name-line load-in" style={{ "--i": 1 }}>{FIRST}</span>{" "}
          <span className="hero__name-line load-in" style={{ "--i": 2 }}>{REST.join(" ")}</span>
        </h1>

        <div className="hero__grid">
          <div className="hero__intro load-in" style={{ "--i": 3 }}>
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
                CV
              </Button>
            </div>
          </div>

          <figure className="hero__figure load-in" style={{ "--i": 4 }}>
            <PhasePortrait />
            <figcaption>
              <span className="hero__fig-num">Fig. 0</span>
              A forced Duffing oscillator, simulated in your browser. The same equation runs the{" "}
              <Link to="/work/duffing-oscillator" className="hero__fig-link">
                tabletop chaos demo
                <Arrow />
              </Link>{" "}
              my team is building.
            </figcaption>
          </figure>
        </div>

        <dl className="facts load-in" style={{ "--i": 5 }} aria-label="Education">
          <div>
            <dt>School</dt>
            <dd>
              {EDUCATION.school}
              <span>{EDUCATION.location}</span>
            </dd>
          </div>
          <div>
            <dt>Degree</dt>
            <dd>
              {EDUCATION.degree}
              <span>{EDUCATION.minor}</span>
            </dd>
          </div>
          <div>
            <dt>Graduation</dt>
            <dd>
              {EDUCATION.graduation}
              <span>Expected</span>
            </dd>
          </div>
          <div>
            <dt>GPA</dt>
            <dd>
              {EDUCATION.gpa}
              <span>Out of 4.00</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

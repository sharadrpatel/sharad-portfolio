import { PROFILE, EDUCATION } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Button, Arrow } from "../components/ui.jsx";
import PhasePortrait from "../components/PhasePortrait.jsx";
import CountUp from "../components/CountUp.jsx";
import Magnetic from "../components/Magnetic.jsx";
import { useParallax } from "../lib/motion.js";
import { useScrub } from "../lib/scroll.js";
import { INTRO } from "../lib/intro.js";

const [FIRST, ...REST] = PROFILE.name.split(" ");

export default function Hero() {
  const drift = useParallax(0.06);
  const scene = useScrub("exit", { span: 0.9 });
  return (
    <section className="hero" aria-labelledby="hero-title" ref={scene}>
      <div className="wrap">
        <div className="hero__top load-in" style={{ "--i": 0 }}>
          <span>{PROFILE.degree}</span>
          <span className="hero__top-mid">{PROFILE.school}</span>
          <span>Class of {PROFILE.classOf}</span>
        </div>

        <h1 id="hero-title" className="hero__name">
          {/* With the intro, the name is assembled from points instead of rising. */}
          <span className="hero__name-line">
            <span className={INTRO ? "" : "mask-in"} style={{ "--i": 1 }}>{FIRST}</span>
          </span>{" "}
          <span className="hero__name-line">
            <span className={INTRO ? "" : "mask-in"} style={{ "--i": 2 }}>{REST.join(" ")}</span>
          </span>
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
              <Magnetic>
                <Button to="/#research" icon="down">Research</Button>
              </Magnetic>
              <Magnetic>
                <Button to="/#projects" variant="outline">Projects</Button>
              </Magnetic>
              <Button to={PROFILE.cv} variant="ghost" icon="out" target="_blank" rel="noopener">
                CV
              </Button>
            </div>
          </div>

          <figure className="hero__figure load-in" style={{ "--i": 4 }}>
            <div ref={drift}>
              <PhasePortrait />
            </div>
            <figcaption>
              <span className="hero__fig-num">Fig. 0</span>
              A forced Duffing oscillator, simulated live in your browser. Scroll to run its clock; turn up the
              forcing and it starts hopping between wells. The same equation runs the{" "}
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
              <CountUp value={EDUCATION.gpa} />
              <span>Out of 4.00</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

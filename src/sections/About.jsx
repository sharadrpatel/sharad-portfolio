import { EDUCATION, INTERESTS, TOOLKIT } from "../data/profile.js";
import { SectionHead } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import ScrollWords from "../components/ScrollWords.jsx";
import { useParallax } from "../lib/motion.js";
import { useScrub } from "../lib/scroll.js";

const LEDE =
  "I'm a biomedical engineering student at the University of Florida, and most of my research is computational. What I like most is turning a question about how the body works into a model and then finding out whether real data agrees with it.";

export default function About() {
  const drift = useParallax(0.05);
  // The portrait warms from black and white to color as you arrive.
  const develop = useScrub("enter", { end: 0.3 });
  return (
    <section id="about" className="section about-section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about-title" title="About" />

        <div className="about">
          <div className="about__portrait">
            <div className="about__frame" ref={develop}>
              <img
                ref={drift}
                src="/headshot.jpg"
                alt="Portrait of Sharad Patel in a suit, in front of the University of Florida College of Medicine."
                width="676"
                height="733"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="about__place">Gainesville, Florida</p>
          </div>

          <div className="about__text">
            <ScrollWords className="about__lede" text={LEDE} />
            <div className="about__body read">
              <p>
                Outside the lab, I work as a CNA on a medical-surgical unit and TA a human physiology lab. I rewrote
                that lab's curriculum this summer and fall. I also captain Dream Team Engineering's surgical research
                team, where I'm running a study on an infant caudal block simulator.
              </p>
              <p>Long term, I'd like a career that mixes clinical medicine with computational research.</p>
            </div>

            <dl className="about__lists">
              <div>
                <dt className="label">Research interests</dt>
                <dd>
                  <ul>
                    {INTERESTS.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="label">Selected coursework</dt>
                <dd>
                  <ul className="about__courses">
                    {EDUCATION.coursework.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <Reveal as="section" className="toolkit has-st" aria-labelledby="toolkit-title">
          <div className="toolkit__head">
            <h3 id="toolkit-title" className="h3">Toolkit</h3>
            <p className="toolkit__note">What I use for the work above.</p>
          </div>
          <dl className="toolkit__grid">
            {TOOLKIT.map((g, i) => (
              <div key={g.group} className="st" style={{ "--si": i }}>
                <dt>{g.group}</dt>
                <dd>
                  <ul>
                    {g.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

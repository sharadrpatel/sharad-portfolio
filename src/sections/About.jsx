import { EDUCATION, INTERESTS, TOOLKIT } from "../data/profile.js";
import { SectionHead } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { useParallax } from "../lib/motion.js";
import { useScrub } from "../lib/scroll.js";

export default function About() {
  const drift = useParallax(0.05);
  // The portrait warms from black and white to color as you arrive.
  const develop = useScrub("enter", { end: 0.25 });
  return (
    <section id="about" className="section about-section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about-title" number="05 — About" aside="Gainesville, Florida" title="About" />

        <div className="about">
          <Reveal className="about__portrait">
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
          </Reveal>

          <Reveal className="about__text" delay={80}>
            <p className="about__lede">
              I'm a biomedical engineering student at the University of Florida. Most of my research is computational. I
              like taking a question about how the body works, turning it into a model, and seeing how well it holds up
              against real data.
            </p>
            <div className="about__body read">
              <p>
                Outside the lab, I work as a CNA on a medical–surgical unit, lead surgical simulation research with
                transplant surgeons, and TA a physiology lab. I rewrote that lab's curriculum over the summer and fall.
              </p>
              <p>Long term, I want a career that combines clinical medicine with computational research.</p>
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
          </Reveal>
        </div>

        <Reveal className="toolkit has-st" aria-labelledby="toolkit-title">
          <div className="toolkit__head">
            <h3 id="toolkit-title" className="h3">Toolkit</h3>
            <p className="toolkit__note">Software, methods, and certifications I use in the work above.</p>
          </div>
          <dl className="toolkit__grid">
            {TOOLKIT.map((g, i) => (
              <div key={g.group} className="st" style={{ "--si": i }}>
                <dt>
                  <span className="toolkit__n">{String(i + 1).padStart(2, "0")}</span>
                  {g.group}
                </dt>
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

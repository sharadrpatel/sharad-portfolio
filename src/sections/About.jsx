import { EDUCATION, INTERESTS, TOOLKIT } from "../data/profile.js";
import { SectionHead } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about-title" number="05" label="About" title="About me" />

        <div className="about">
          <Reveal className="about__portrait">
            <img
              src="/headshot.jpg"
              alt="Portrait of Sharad Patel in a suit, in front of the University of Florida College of Medicine."
              width="676"
              height="733"
              loading="lazy"
              decoding="async"
            />
          </Reveal>

          <Reveal className="about__text prose" delay={60}>
            <p className="about__lede">
              I'm a biomedical engineering student at the University of Florida. Most of my research
              is computational. I like taking a question about how the body works, turning it into a model, and seeing how
              well it holds up against real data.
            </p>
            <p>
              Outside the lab, I work as a CNA on a medical–surgical unit, lead surgical simulation research with transplant
              surgeons, and TA a physiology lab. I rewrote that lab's curriculum over the summer and fall.
            </p>
            <p>
              Long term, I want a career that combines clinical medicine with computational research.
            </p>

            <div className="interests">
              <h3 className="label">Research interests</h3>
              <ul>
                {INTERESTS.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal as="aside" className="education" delay={120} aria-labelledby="edu-title">
            <h3 id="edu-title" className="label">Selected coursework</h3>
            <p className="education__courses">{EDUCATION.coursework.join(" · ")}</p>
          </Reveal>
        </div>

        <Reveal className="toolkit" aria-labelledby="toolkit-title">
          <div className="toolkit__head">
            <h3 id="toolkit-title" className="label">Toolkit</h3>
            <p className="subhead__note">Software, methods, and certifications I use in the work above.</p>
          </div>
          <dl className="toolkit__grid">
            {TOOLKIT.map((g) => (
              <div key={g.group}>
                <dt>{g.group}</dt>
                <dd>
                  <ul>
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
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

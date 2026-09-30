import { EDUCATION, INTERESTS, TOOLKIT } from "../data/profile.js";
import { SectionHead } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about-title" number="05" label="About" title="An engineer who writes down how the body should behave — then checks." />

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
              I'm a biomedical engineering student at the University of Florida, graduating in May 2027. Most of my work
              sits where mechanics and physiology meet mathematics: I describe how a system should behave, simulate it, and
              test the result against data — whether the system is a thumb muscle, an artery wall, a transplanted lung, or a
              population adapting to a changing environment.
            </p>
            <p>
              Alongside the modeling, I work as a certified nursing assistant on a medical–surgical unit, lead surgical
              simulation research with transplant surgeons, and teach a physiology lab whose curriculum I helped rewrite.
              That time with patients and students is a regular reminder of who the models are ultimately for.
            </p>
            <p>
              Long term, I'm working toward a career that joins clinical medicine with computational research.
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
            <h3 id="edu-title" className="label">Education</h3>
            <p className="education__school">{EDUCATION.school}</p>
            <p>{EDUCATION.degree}</p>
            <dl className="education__facts">
              <div>
                <dt className="label label--muted">Dates</dt>
                <dd>{EDUCATION.period}</dd>
              </div>
              <div>
                <dt className="label label--muted">GPA</dt>
                <dd>{EDUCATION.gpa}</dd>
              </div>
            </dl>
            <h4 className="label label--muted">Selected coursework</h4>
            <p className="education__courses">{EDUCATION.coursework.join(" · ")}</p>
          </Reveal>
        </div>

        <Reveal className="toolkit" aria-labelledby="toolkit-title">
          <div className="toolkit__head">
            <h3 id="toolkit-title" className="label">Toolkit</h3>
            <p className="subhead__note">The tools behind the projects above, grouped by what they are used for.</p>
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

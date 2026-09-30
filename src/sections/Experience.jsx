import { CLINICAL, TEACHING, LEADERSHIP } from "../data/experience.js";
import { SectionHead } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";

function Clinical() {
  const c = CLINICAL;
  return (
    <Reveal as="article" className="clinical" aria-labelledby="clinical-title">
      <div className="clinical__head">
        <h3 className="label">Clinical</h3>
        <ul className="credentials" aria-label="Certifications">
          {c.credentials.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
      <h4 id="clinical-title" className="h3">{c.role}</h4>
      <dl className="clinical__facts">
        <div>
          <dt className="label label--muted">Setting</dt>
          <dd>{c.place}</dd>
        </div>
        <div>
          <dt className="label label--muted">Unit</dt>
          <dd>{c.unit}</dd>
        </div>
        <div>
          <dt className="label label--muted">Since</dt>
          <dd>{c.period.replace(" – Present", "")}</dd>
        </div>
      </dl>
      <dl className="method-list method-list--tight">
        {c.duties.map((d) => (
          <div key={d.label}>
            <dt>{d.label}</dt>
            <dd>{d.text}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

function Teaching() {
  return (
    <Reveal as="article" className="teaching" aria-labelledby="teaching-title">
      <h3 id="teaching-title" className="label">Teaching</h3>
      <ul className="courses">
        {TEACHING.map((t) => (
          <li key={t.course} className="course">
            <div className="course__head">
              <h4 className="course__name">{t.course}</h4>
              {t.highlight && <span className="badge">{t.highlight}</span>}
            </div>
            <p className="meta">
              {t.role} · {t.period} · {t.format}
            </p>
            <p className="course__text">{t.text}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Leadership() {
  return (
    <Reveal as="article" className="leadership" aria-labelledby="leadership-title">
      <h3 id="leadership-title" className="label">Leadership &amp; service</h3>
      <ol className="timeline">
        {LEADERSHIP.map((l) => (
          <li key={l.role + l.org}>
            <span className="timeline__period">{l.period}</span>
            <div>
              <h4 className="timeline__role">
                {l.role} <span>· {l.org}</span>
              </h4>
              <p>{l.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section section--wash" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead
          id="experience-title"
          number="04"
          label="Experience"
          title="At the bedside, in the classroom, and in the community."
          dek="Clinical work keeps the modeling grounded in patients; teaching and leadership keep the explanations clear."
        />
        <div className="experience-grid">
          <Clinical />
          <Teaching />
        </div>
        <Leadership />
      </div>
    </section>
  );
}

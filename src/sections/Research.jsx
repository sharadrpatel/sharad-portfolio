import { RESEARCH } from "../data/work.js";
import { SectionHead, Tags, TextLink } from "../components/ui.jsx";
import { WorkFigure } from "../components/figures.jsx";
import Reveal from "../components/Reveal.jsx";

function StudyMeta({ w }) {
  return (
    <div className="study__meta">
      <span className="study__index">{w.index}</span>
      <dl className="meta-list">
        <div>
          <dt>Lab</dt>
          <dd>{w.lab}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{w.period}</dd>
        </div>
        <div>
          <dt>Field</dt>
          <dd>{w.area.join(" · ")}</dd>
        </div>
      </dl>
    </div>
  );
}

function FeaturedStudy({ w, figN }) {
  const outcomes = w.outcomes?.filter((o) => o.value);
  return (
    <Reveal as="article" className="study study--featured" id={`research-${w.slug}`} aria-labelledby={`t-${w.slug}`}>
      <StudyMeta w={w} />
      <div className="study__main">
        <h3 id={`t-${w.slug}`} className="h3 study__title">{w.title}</h3>
        <p className="study__question">
          <span className="label label--accent">Question</span>
          {w.question}
        </p>
        <div className="study__cols">
          <div className="study__text">
            <p>{w.summary}</p>
            <dl className="method-list">
              {w.approach.slice(0, 4).map((a) => (
                <div key={a.label}>
                  <dt>{a.label}</dt>
                  <dd>{a.text}</dd>
                </div>
              ))}
            </dl>
            {outcomes?.length > 0 && (
              <dl className="stat-row">
                {outcomes.map((o) => (
                  <div key={o.label}>
                    <dt className="label label--muted">{o.label}</dt>
                    <dd>
                      <span className="stat-row__value">{o.value}</span>
                      <span className="stat-row__note">{o.text}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {w.status && (
              <p className="status">
                <span className="status__dot" aria-hidden="true" />
                {w.status}
              </p>
            )}
            <Tags items={w.tools} />
            {w.caseStudy && (
              <TextLink to={`/work/${w.slug}`}>
                Read the case study<span className="visually-hidden">: {w.title}</span>
              </TextLink>
            )}
          </div>
          {w.figure && (
            <div className="study__figure">
              <WorkFigure name={w.figure} n={figN} />
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function SecondaryStudy({ w }) {
  return (
    <Reveal as="article" className="study study--compact" id={`research-${w.slug}`} aria-labelledby={`t-${w.slug}`}>
      <StudyMeta w={w} />
      <div className="study__main">
        <h4 id={`t-${w.slug}`} className="h4 study__title">{w.title}</h4>
        <p className="study__role">{w.role}</p>
        <p>{w.summary}</p>
        <Tags items={w.tools} />
        {w.caseStudy && (
          <TextLink to={`/work/${w.slug}`}>
            Read the case study<span className="visually-hidden">: {w.title}</span>
          </TextLink>
        )}
      </div>
    </Reveal>
  );
}

export default function Research() {
  const featured = RESEARCH.filter((w) => w.tier === "featured");
  const secondary = RESEARCH.filter((w) => w.tier === "secondary");
  return (
    <section id="research" className="section" aria-labelledby="research-title">
      <div className="wrap">
        <SectionHead
          id="research-title"
          number="01"
          label="Research"
          title="Models of the body, tested against data."
          dek="Mechanistic and computational work across musculoskeletal, vascular, and pulmonary systems — each project starting from a physiological question and ending in something that can be checked."
        />
        <div className="studies">
          {featured.map((w, i) => (
            <FeaturedStudy key={w.slug} w={w} figN={i + 1} />
          ))}
        </div>

        <div className="subhead">
          <h3 className="label">Further research</h3>
          <p className="subhead__note">Ecological modeling, neuroimmunology, and surgical simulation.</p>
        </div>
        <div className="studies studies--compact">
          {secondary.map((w) => (
            <SecondaryStudy key={w.slug} w={w} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
          <dt>Where</dt>
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

export function FeaturedStudy({ w, figN, idPrefix = "research", heading: Heading = "h3" }) {
  const outcomes = w.outcomes?.filter((o) => o.value);
  return (
    <Reveal as="article" className="study study--featured" id={`${idPrefix}-${w.slug}`} aria-labelledby={`t-${w.slug}`}>
      <StudyMeta w={w} />
      <div className="study__main">
        <Heading id={`t-${w.slug}`} className="h3 study__title">
          {w.title}
        </Heading>
        {w.question && (
          <p className="study__question">
            <span className="label label--accent">Question</span>
            {w.question}
          </p>
        )}
        <div className="study__cols">
          <div className="study__text">
            <p>{w.summary}</p>
            {w.subprojects ? (
              <ol className="subprojects">
                {w.subprojects.map((sp, n) => (
                  <li key={sp.id}>
                    <span className="subprojects__n">{String(n + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="subprojects__title">{sp.title}</p>
                      <p>{sp.short}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <dl className="method-list">
                {w.approach.slice(0, 4).map((a) => (
                  <div key={a.label}>
                    <dt>{a.label}</dt>
                    <dd>{a.text}</dd>
                  </div>
                ))}
              </dl>
            )}
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
                Read the case study
                <span className="visually-hidden">: {w.title}</span>
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
        <h4 id={`t-${w.slug}`} className="h4 study__title">
          {w.title}
        </h4>
        <p className="study__role">{w.role}</p>
        <p>{w.summary}</p>
        <Tags items={w.tools} />
        {w.caseStudy && (
          <TextLink to={`/work/${w.slug}`}>
            Read the case study
            <span className="visually-hidden">: {w.title}</span>
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
          title="What I'm working on in the lab"
          dek="Most of my research is computational: modeling muscles in the thumb, the evolution of plasticity and dispersal, and lung injury after transplant. For each project, here's the question, what I did, and where it stands."
        />
        <div className="studies">
          {featured.map((w, i) => (
            <FeaturedStudy key={w.slug} w={w} figN={i + 1} />
          ))}
        </div>

        <div className="subhead">
          <h3 className="label">Other research</h3>
          <p className="subhead__note">Parkinson's disease and surgical simulation.</p>
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

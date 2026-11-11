import { useEffect, useState } from "react";
import { RESEARCH } from "../data/work.js";
import { SectionHead, Tags, TextLink, Arrow, Badge, shortPeriod } from "../components/ui.jsx";
import { WorkFigure } from "../components/figures.jsx";

export function ExternalLinks({ links }) {
  return (
    <ul className="ext-links">
      {links.map((l) => (
        <li key={l.href}>
          <a className="text-link" href={l.href} target="_blank" rel="noopener">
            <span>{l.label}</span>
            <Arrow dir="out" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function PlateMeta({ w }) {
  return (
    <p className="plate__meta">
      <span className="plate__index">{w.index}</span>
      <span>{w.lab}</span>
      {w.period && <span className="plate__period">{w.period}</span>}
    </p>
  );
}

// One study, set as a plate: meta rule, title, question, text beside its figure.
export function FeaturedStudy({ w, figN, idPrefix = "research", heading: Heading = "h3" }) {
  const stats = w.outcomes?.filter((o) => o.value);
  return (
    <article className="plate" id={`${idPrefix}-${w.slug}`} aria-labelledby={`t-${w.slug}`}>
      <PlateMeta w={w} />
      <Heading id={`t-${w.slug}`} className="h3 plate__title">
        {w.title}
        {w.badge && <Badge>{w.badge}</Badge>}
      </Heading>
      {w.question && <p className="plate__question">{w.question}</p>}

      <div className={`plate__body ${w.figure ? "" : "plate__body--solo"}`}>
        <div className="plate__text">
          <p className="read">{w.summary}</p>

          {w.subprojects && (
            <ol className="subprojects">
              {w.subprojects.map((sp, n) => (
                <li key={sp.id}>
                  <span className="subprojects__n">{n + 1}</span>
                  <div>
                    <p className="subprojects__title">{sp.title}</p>
                    <p className="subprojects__text">{sp.short}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {/* Studies without their own page carry their methods here. */}
          {!w.caseStudy && w.approach && (
            <dl className="method-list">
              {w.approach.map((a) => (
                <div key={a.label}>
                  <dt>{a.label}</dt>
                  <dd>{a.text}</dd>
                </div>
              ))}
            </dl>
          )}

          {stats?.length > 0 && (
            <dl className="stats">
              {stats.map((o) => (
                <div key={o.label}>
                  <dt>{o.label}</dt>
                  <dd>
                    <span className="stats__value">{o.value}</span>
                    <span className="stats__note">{o.text}</span>
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

          {(w.links || w.caseStudy) && (
            <div className="plate__links">
              {w.caseStudy && (
                <TextLink to={`/work/${w.slug}`}>
                  Read the case study
                  <span className="visually-hidden">: {w.title}</span>
                </TextLink>
              )}
              {w.links && <ExternalLinks links={w.links} />}
            </div>
          )}
        </div>

        {w.figure && (
          <div className="plate__figure">
            <WorkFigure name={w.figure} n={figN} />
          </div>
        )}
      </div>
    </article>
  );
}

function CompactStudy({ w }) {
  return (
    <article className="plate plate--compact" id={`research-${w.slug}`} aria-labelledby={`t-${w.slug}`}>
      <PlateMeta w={w} />
      <h4 id={`t-${w.slug}`} className="h4 plate__title">
        {w.title}
      </h4>
      <p className="plate__role">{w.role}</p>
      <p className="read">{w.summary}</p>
      <Tags items={w.tools} />
      {w.caseStudy && (
        <TextLink to={`/work/${w.slug}`}>
          Read the case study
          <span className="visually-hidden">: {w.title}</span>
        </TextLink>
      )}
    </article>
  );
}

// Highlights the plate currently under the reading line.
function useActivePlate(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join()]);
  return active;
}

export default function Research() {
  const featured = RESEARCH.filter((w) => w.tier === "featured");
  const secondary = RESEARCH.filter((w) => w.tier === "secondary");
  const labs = new Set(RESEARCH.map((w) => w.lab)).size;
  const active = useActivePlate(RESEARCH.map((w) => `research-${w.slug}`));

  return (
    <section id="research" className="section research" aria-labelledby="research-title">
      <div className="wrap">
        <SectionHead
          id="research-title"
          aside={`${RESEARCH.length} projects in ${labs} groups`}
          title="Research"
          dek="Most of it is computational: muscles in the arthritic thumb, how plasticity and dispersal evolve, and lung injury after transplant. Each entry gives the question, what I did, and where it stands."
        />

        <div className="research__layout">
          <nav className="research__index" aria-label="Research projects">
            <ol>
              {RESEARCH.map((w) => (
                <li key={w.slug}>
                  <a
                    href={`#research-${w.slug}`}
                    aria-current={active === `research-${w.slug}` ? "true" : undefined}
                  >
                    <span className="research__index-n">{w.index}</span>
                    <span className="research__index-title">{w.lab}</span>
                    <span className="research__index-year">{shortPeriod(w.period)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="research__plates">
            {featured.map((w, i) => (
              <FeaturedStudy key={w.slug} w={w} figN={i + 1} />
            ))}

            <div className="subhead">
              <h3 className="label">Also in progress</h3>
              <p className="subhead__note">Parkinson's disease and surgical simulation.</p>
            </div>
            <div className="research__compact">
              {secondary.map((w) => (
                <CompactStudy key={w.slug} w={w} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

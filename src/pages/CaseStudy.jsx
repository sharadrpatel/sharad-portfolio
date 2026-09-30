import { useEffect, useState } from "react";
import { CASE_STUDIES, RESEARCH, MODELING_FEATURE } from "../data/work.js";
import { Link } from "../lib/router.jsx";
import { Tags, TextLink, Arrow } from "../components/ui.jsx";
import { WorkFigure } from "../components/figures.jsx";
import { SpecTable } from "../sections/Projects.jsx";

function useActiveHeading(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids.join()]);
  return active;
}

export default function CaseStudy({ work: w }) {
  const isResearch = RESEARCH.includes(w);
  const backHref = isResearch
    ? `/#research-${w.slug}`
    : w === MODELING_FEATURE
      ? `/#project-${w.slug}`
      : "/#projects";
  const i = CASE_STUDIES.indexOf(w);
  const next = CASE_STUDIES[(i + 1) % CASE_STUDIES.length];

  const sections = [
    { id: "problem", label: "Problem", show: !!w.problem },
    { id: "approach", label: "Approach & methods", show: true },
    { id: "specifications", label: "Specifications", show: !!w.specs },
    { id: "contribution", label: "My contribution", show: !!w.contributions },
    { id: "outcomes", label: "Outcomes", show: !!w.outcomes },
    { id: "tools", label: "Tools", show: true },
  ].filter((s) => s.show);
  const active = useActiveHeading(sections.map((s) => s.id));
  let fig = 0;

  return (
    <article className="case" aria-labelledby="case-title">
      <header className="case__header">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link to={backHref}>
              <Arrow dir="left" /> {isResearch ? "Research" : "Projects"}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{w.index}</span>
          </nav>
          <p className="label label--accent">{w.area.join(" · ")}</p>
          <h1 id="case-title" className="case__title">{w.title}</h1>
          {w.question && (
            <p className="case__question">
              <span className="label label--muted">{isResearch ? "Research question" : "Question"}</span>
              {w.question}
            </p>
          )}
          <dl className="case__facts">
            <div>
              <dt className="label label--muted">Where</dt>
              <dd>
                {w.lab}
                <span>{w.org}</span>
              </dd>
            </div>
            <div>
              <dt className="label label--muted">When</dt>
              <dd>{w.period}</dd>
            </div>
            <div>
              <dt className="label label--muted">Role</dt>
              <dd>{w.role}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="wrap case__layout">
        <aside className="case__toc" aria-label="On this page">
          <p className="label label--muted">On this page</p>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="case__body">
          <p className="case__summary">{w.summary}</p>

          {w.figure && (
            <div className="case__figure">
              <WorkFigure name={w.figure} n={++fig} wide />
            </div>
          )}

          {w.problem && (
            <section className="case__section" aria-labelledby="problem">
              <h2 id="problem" className="case__h">Problem</h2>
              <p>{w.problem}</p>
            </section>
          )}

          <section className="case__section" aria-labelledby="approach">
            <h2 id="approach" className="case__h">Approach &amp; methods</h2>
            <ol className="steps">
              {w.approach.map((a, n) => (
                <li key={a.label}>
                  <span className="steps__n">{String(n + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="steps__label">{a.label}</h3>
                    <p>{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {w.secondaryFigure && (
              <div className="case__figure">
                <WorkFigure name={w.secondaryFigure} n={++fig} wide />
              </div>
            )}
          </section>

          {w.specs && (
            <section className="case__section" aria-labelledby="specifications">
              <h2 id="specifications" className="case__h">Specifications</h2>
              <p>
                A few of the 12 user needs from our design traceability matrix. Each one has a marginal and an ideal
                target.
              </p>
              <SpecTable specs={w.specs} caption="Selected target specifications" />
            </section>
          )}

          {w.contributions && (
            <section className="case__section" aria-labelledby="contribution">
              <h2 id="contribution" className="case__h">My contribution</h2>
              <ul className="checklist">
                {w.contributions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {w.outcomes && (
            <section className="case__section" aria-labelledby="outcomes">
              <h2 id="outcomes" className="case__h">Outcomes</h2>
              <dl className="outcomes">
                {w.outcomes.map((o) => (
                  <div key={o.label} className={o.value ? "has-value" : ""}>
                    <dt>
                      {o.value && <span className="outcomes__value">{o.value}</span>}
                      <span className="label label--muted">{o.label}</span>
                    </dt>
                    <dd>{o.text}</dd>
                  </div>
                ))}
              </dl>
              {!w.outcomes.some((o) => o.value) && (
                <p className="status">
                  <span className="status__dot" aria-hidden="true" />
                  This project is still going, so these are what the work is set up to answer rather than final results.
                </p>
              )}
            </section>
          )}

          <section className="case__section" aria-labelledby="tools">
            <h2 id="tools" className="case__h">Tools</h2>
            <Tags items={w.tools} />
          </section>

          <nav className="case__next" aria-label="More work">
            <TextLink to={backHref} icon="left">
              Back to {isResearch ? "research" : "projects"}
            </TextLink>
            <Link to={`/work/${next.slug}`} className="next-card">
              <span className="label label--muted">Next case study · {next.index}</span>
              <span className="next-card__title">{next.title}</span>
              <Arrow />
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
}

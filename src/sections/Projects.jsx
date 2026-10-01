import { useState, useId } from "react";
import { DESIGN, MODELING_FEATURES } from "../data/work.js";
import { FeaturedStudy } from "./Research.jsx";
import { PROJECTS } from "../data/projects.js";
import { SectionHead, Tags, TextLink, Arrow } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";

export function SpecTable({ specs, caption }) {
  return (
    <div className="spec-table-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table className="spec-table">
        <caption className="label label--muted">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">User need</th>
            <th scope="col">Target</th>
            <th scope="col">Basis</th>
          </tr>
        </thead>
        <tbody>
          {specs.map((s) => (
            <tr key={s.need}>
              <th scope="row">{s.need}</th>
              <td className="spec-table__target">{s.target}</td>
              <td>{s.basis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DesignLead({ d }) {
  return (
    <Reveal as="article" className="design-lead" aria-labelledby={`t-${d.slug}`}>
      <div className="design-lead__head">
        <p className="label label--accent">{d.index} · {d.lab}</p>
        <h4 id={`t-${d.slug}`} className="h3">{d.title}</h4>
        <p className="meta">{d.period} · {d.role}</p>
      </div>
      <div className="design-lead__body">
        <div className="pmct">
          <div>
            <h5 className="label">Problem</h5>
            <p>{d.problem}</p>
          </div>
          <div>
            <h5 className="label">Method</h5>
            <p>{d.method}</p>
          </div>
          <div>
            <h5 className="label">Contribution</h5>
            <p>{d.contribution}</p>
          </div>
        </div>
        <SpecTable specs={d.specs} caption="Selected target specifications (of 12 user needs)" />
        <div className="design-lead__foot">
          <Tags items={d.tools} />
          <TextLink to={`/work/${d.slug}`}>
            Read the case study<span className="visually-hidden">: {d.title}</span>
          </TextLink>
        </div>
      </div>
    </Reveal>
  );
}

function DesignCard({ d, delay }) {
  return (
    <Reveal as="article" className="design-card" delay={delay} aria-labelledby={`t-${d.slug}`}>
      <p className="label label--muted">
        {d.index} · {d.period}
      </p>
      <h4 id={`t-${d.slug}`} className="h4">{d.title}</h4>
      {d.lab && <p className="meta">{d.lab}</p>}
      <dl className="pmct pmct--stacked">
        <div>
          <dt className="label">Problem</dt>
          <dd>{d.problem}</dd>
        </div>
        <div>
          <dt className="label">Method</dt>
          <dd>{d.method}</dd>
        </div>
        <div>
          <dt className="label">Contribution</dt>
          <dd>{d.contribution}</dd>
        </div>
      </dl>
      <Tags items={d.tools} />
    </Reveal>
  );
}

function IndexRow({ p, n, open, onToggle }) {
  const uid = useId();
  const panelId = `${uid}-panel`;
  return (
    <li className={`index-row ${open ? "is-open" : ""}`}>
      <h5 className="index-row__heading">
        <button type="button" className="index-row__button" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span className="index-row__n">{String(n).padStart(2, "0")}</span>
          <span className="index-row__title">
            {p.title}
            {p.badge && <span className="badge">{p.badge}</span>}
          </span>
          <span className="index-row__domain">{p.domain}</span>
          <span className="index-row__icon" aria-hidden="true" />
        </button>
      </h5>
      <div id={panelId} className="index-row__panel" role="region" aria-label={p.title} inert={open ? undefined : ""}>
        <div className="index-row__inner">
          <p className="meta">{p.context}</p>
          <dl className="pmct">
            <div>
              <dt className="label">Problem</dt>
              <dd>{p.problem}</dd>
            </div>
            <div>
              <dt className="label">Method</dt>
              <dd>{p.method}</dd>
            </div>
            <div>
              <dt className="label">Outcome</dt>
              <dd>{p.outcome}</dd>
            </div>
          </dl>
          <div className="index-row__foot">
            <Tags items={p.tools} />
            {p.link &&
              (p.link.internal ? (
                <TextLink to={p.link.href}>{p.link.label}</TextLink>
              ) : (
                <a className="text-link" href={p.link.href} target="_blank" rel="noopener">
                  <span>{p.link.label}</span>
                  <Arrow dir="out" />
                </a>
              ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Projects() {
  const [lead, ...cards] = DESIGN;
  const [open, setOpen] = useState(() => new Set([PROJECTS[0].id]));
  const toggle = (id) =>
    setOpen((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const allOpen = open.size === PROJECTS.length;

  return (
    <section id="projects" className="section section--wash" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead
          id="projects-title"
          number="02"
          label="Projects"
          title="Design and modeling projects"
          dek="Senior design, class projects, modeling competitions, and a few things I built on my own. Each one covers the problem, what we did, and how it turned out."
        />

        <div className="subhead">
          <h3 className="label">Engineering design</h3>
          <p className="subhead__note">Medical devices and CAD.</p>
        </div>
        <DesignLead d={lead} />
        <div className="design-grid">
          {cards.map((d, i) => (
            <DesignCard key={d.slug} d={d} delay={i * 80} />
          ))}
        </div>

        <div className="subhead">
          <h3 className="label">Modeling &amp; computation</h3>
          <p className="subhead__note">Class projects, competitions, and independent work.</p>
        </div>
        <div className="studies">
          {MODELING_FEATURES.map((w, i) => (
            <FeaturedStudy key={w.slug} w={w} figN={4 + i} idPrefix="project" heading="h4" />
          ))}
        </div>

        <div className="subhead subhead--minor">
          <h4 className="label">More projects</h4>
          <button
            type="button"
            className="subhead__action"
            onClick={() => setOpen(allOpen ? new Set() : new Set(PROJECTS.map((p) => p.id)))}
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
        <Reveal as="ol" className="index">
          {PROJECTS.map((p, i) => (
            <IndexRow key={p.id} p={p} n={i + 1} open={open.has(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

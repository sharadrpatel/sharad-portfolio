import { useMemo, useState, useId } from "react";
import { DESIGN, MODELING_FEATURES, WETLAB_FEATURES } from "../data/work.js";
import { PROJECTS } from "../data/projects.js";
import { Link } from "../lib/router.jsx";
import { SectionHead, Tags, Arrow, Badge, shortPeriod, isOngoing } from "../components/ui.jsx";
import { FigureArt } from "../components/figures.jsx";
import Reveal from "../components/Reveal.jsx";

export function SpecTable({ specs, caption }) {
  return (
    <div className="spec-table-wrap" tabIndex={0} role="region" aria-label={caption} data-lenis-prevent-wheel>
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

// Every project, from every source file, in one shape for the index.
function fromWork(w, group) {
  return {
    key: w.slug,
    code: w.index,
    group,
    title: w.title,
    badge: w.badge,
    context: w.lab,
    period: w.period,
    figure: w.figure,
    caseStudy: w.caseStudy,
    href: w.caseStudy ? `/work/${w.slug}` : null,
    blurb: w.question ?? w.problem ?? w.summary,
    status: w.status,
    tools: w.tools,
    details: w.caseStudy
      ? null
      : [
          ["Problem", w.problem],
          ["Method", w.method],
          ["Contribution", w.contribution],
        ].filter(([, v]) => v),
  };
}

function fromProject(p, i) {
  return {
    key: p.id,
    code: `C.${String(i + 1).padStart(2, "0")}`,
    group: "code",
    title: p.title,
    badge: p.badge,
    context: `${p.context} · ${p.domain}`,
    period: null,
    figure: null,
    caseStudy: false,
    href: null,
    blurb: p.problem,
    tools: p.tools,
    link: p.link,
    details: [
      ["Problem", p.problem],
      ["Method", p.method],
      ["Outcome", p.outcome],
    ],
  };
}

const GROUPS = [
  { id: "design", label: "Design", note: "Medical devices and CAD", items: DESIGN.map((w) => fromWork(w, "design")) },
  { id: "wetlab", label: "Wet lab", note: "Cell culture and assays", items: WETLAB_FEATURES.map((w) => fromWork(w, "wetlab")) },
  {
    id: "modeling",
    label: "Modeling",
    note: "Classes, competitions, and teaching",
    items: MODELING_FEATURES.map((w) => fromWork(w, "modeling")),
  },
  { id: "code", label: "Code & data", note: "Smaller things I built", items: PROJECTS.map(fromProject) },
];

const ALL = GROUPS.flatMap((g) => g.items);
const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]));

function RowInner({ e, open }) {
  return (
    <>
      <span className="work-row__code">{e.code}</span>
      <span className="work-row__main">
        <span className="work-row__title">
          {e.title}
          {e.badge && <Badge>{e.badge}</Badge>}
        </span>
        <span className="work-row__context">{e.context}</span>
      </span>
      <span className={`work-row__year ${isOngoing(e.period) ? "is-ongoing" : ""}`}>
        {shortPeriod(e.period) ?? "—"}
      </span>
      {e.href ? (
        <Arrow />
      ) : (
        <span className={`work-row__plus ${open ? "is-open" : ""}`} aria-hidden="true" />
      )}
    </>
  );
}

function Row({ e, active, onActivate, index }) {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const hover = { onMouseEnter: onActivate, onFocus: onActivate };
  return (
    <li id={`project-${e.key}`} className={`work-item st ${active ? "is-active" : ""}`} style={{ "--si": index }}>
      {e.href ? (
        <Link to={e.href} className="work-row" {...hover}>
          <RowInner e={e} />
          <span className="visually-hidden">, read the case study</span>
        </Link>
      ) : (
        <>
          <button
            type="button"
            className="work-row"
            aria-expanded={open}
            aria-controls={`${uid}-panel`}
            onClick={() => setOpen((o) => !o)}
            {...hover}
          >
            <RowInner e={e} open={open} />
          </button>
          <div id={`${uid}-panel`} className="work-detail" hidden={!open}>
            <dl className="work-detail__list">
              {e.details.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <Tags items={e.tools} />
            {e.link &&
              (e.link.internal ? (
                <Link to={e.link.href} className="text-link">
                  <span>{e.link.label}</span>
                  <Arrow />
                </Link>
              ) : (
                <a className="text-link" href={e.link.href} target="_blank" rel="noopener">
                  <span>{e.link.label}</span>
                  <Arrow dir="out" />
                </a>
              ))}
          </div>
        </>
      )}
    </li>
  );
}

// A visual companion to the list: it follows hover and keyboard focus. Its
// contents repeat what the rows and case studies already say, so it is hidden
// from assistive technology.
function Preview({ e }) {
  return (
    <div className="work__preview" aria-hidden="true">
      <div className="preview" key={e.key}>
        <div className={`preview__art ${e.figure ? "" : "preview__art--type"}`}>
          {e.figure ? (
            <FigureArt name={e.figure} />
          ) : (
            <span className="preview__code">{e.code}</span>
          )}
        </div>
        <p className="preview__meta">
          <span>{GROUP_LABEL[e.group]}</span>
          <span>{e.code}</span>
        </p>
        <p className="preview__blurb">{e.blurb}</p>
        {e.status && <p className="preview__status">{e.status}</p>}
        <Tags items={e.tools.slice(0, 5)} />
      </div>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const visible = useMemo(() => (filter === "all" ? GROUPS : GROUPS.filter((g) => g.id === filter)), [filter]);
  const [activeKey, setActiveKey] = useState(ALL[0].key);
  const active = ALL.find((e) => e.key === activeKey) ?? visible[0].items[0];

  const choose = (id) => {
    setFilter(id);
    const first = (id === "all" ? GROUPS : GROUPS.filter((g) => g.id === id))[0].items[0];
    setActiveKey(first.key);
  };

  const caseStudies = ALL.filter((e) => e.caseStudy).length;

  return (
    <section id="projects" className="section work" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead
          id="projects-title"
          number="02 — Projects"
          aside={`${ALL.length} projects · ${caseStudies} case studies`}
          title="Projects"
          dek="Senior design, wet lab work, modeling competitions, a teaching demo, and a few things I built on my own. Open any row for the full write-up."
        />

        <div className="work__filters" role="group" aria-label="Filter projects">
          {[{ id: "all", label: "All", count: ALL.length }, ...GROUPS.map((g) => ({ ...g, count: g.items.length }))].map(
            (f) => (
              <button
                key={f.id}
                type="button"
                className="filter"
                aria-pressed={filter === f.id}
                onClick={() => choose(f.id)}
              >
                {f.label}
                <span className="filter__count">{f.count}</span>
              </button>
            )
          )}
        </div>

        <div className="work__layout">
          <div className="work__list" key={filter}>
            {visible.map((g) => (
              <div key={g.id} className="work-group">
                <div className="work-group__head">
                  <h3 className="label">{g.label}</h3>
                  <p className="work-group__note">{g.note}</p>
                </div>
                <Reveal as="ol" className="work-group__rows has-st">
                  {g.items.map((e, i) => (
                    <Row
                      key={e.key}
                      e={e}
                      index={i}
                      active={e.key === active.key}
                      onActivate={() => setActiveKey(e.key)}
                    />
                  ))}
                </Reveal>
              </div>
            ))}
          </div>
          <Preview e={active} />
        </div>
      </div>
    </section>
  );
}

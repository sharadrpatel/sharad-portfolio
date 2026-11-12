import { useState, useId } from "react";
import { DESIGN, MODELING_FEATURES, WETLAB_FEATURES } from "../data/work.js";
import { PROJECTS } from "../data/projects.js";
import { SectionHead, FilterBar, Tags, TextLink, Arrow, Badge, shortPeriod, isOngoing } from "../components/ui.jsx";
import { FigureArt } from "../components/figures.jsx";
import Reveal from "../components/Reveal.jsx";
import Featured from "./Featured.jsx";

// Every project, from every source file, in one shape for the index. Each
// entry carries a short brief (question, what was built, the approach, my
// part in it, and any headline numbers) that opens in place under its row.
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
    href: w.caseStudy ? `/work/${w.slug}` : null,
    question: w.question ?? w.problem,
    questionLabel: w.question ? "Question" : "Problem",
    summary: w.summary,
    // Case studies list their steps by name; shorter entries describe the method in a sentence.
    steps: w.caseStudy ? w.approach?.map((a) => a.label) : null,
    approach: w.caseStudy ? null : w.method,
    role: w.caseStudy ? w.role : w.contribution,
    stats: w.outcomes?.filter((o) => o.value) ?? [],
    status: w.status,
    tools: w.tools,
    links: w.links ?? [],
  };
}

function fromProject(p, i) {
  return {
    key: p.id,
    code: `C.${String(i + 1).padStart(2, "0")}`,
    group: "code",
    title: p.title,
    badge: p.badge,
    context: `${p.context}, ${p.domain.toLowerCase()}`,
    period: null,
    figure: null,
    href: null,
    question: p.problem,
    questionLabel: "Problem",
    approach: p.method,
    outcome: p.outcome,
    stats: [],
    tools: p.tools,
    links: p.link ? [p.link] : [],
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
const FILTERS = [
  { id: "all", label: "All", count: ALL.length },
  ...GROUPS.map((g) => ({ id: g.id, label: g.label, count: g.items.length })),
];

// A project named in the URL (e.g. arriving back from its case study) starts open.
function keyFromHash() {
  if (typeof window === "undefined") return null;
  const key = decodeURIComponent(window.location.hash).replace(/^#project-/, "");
  return ALL.some((e) => e.key === key) ? key : null;
}

function Brief({ e, showFigure }) {
  return (
    <div className="brief">
      <p className="brief__question">
        <span className="label label--muted">{e.questionLabel}</span>
        {e.question}
      </p>

      {/* The sticky preview shows the figure on wide screens; below that it sits here. */}
      {e.figure && showFigure && (
        <div className="brief__figure">
          <FigureArt name={e.figure} />
        </div>
      )}

      {e.summary && <p className="brief__summary">{e.summary}</p>}

      <dl className="brief__list">
        {e.steps && (
          <div>
            <dt>Approach</dt>
            <dd>
              <ol className="brief__steps">
                {e.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </dd>
          </div>
        )}
        {e.approach && (
          <div>
            <dt>Approach</dt>
            <dd>{e.approach}</dd>
          </div>
        )}
        {e.role && (
          <div>
            <dt>My part</dt>
            <dd>{e.role}</dd>
          </div>
        )}
        {e.outcome && (
          <div>
            <dt>Outcome</dt>
            <dd>{e.outcome}</dd>
          </div>
        )}
        {e.stats.length > 0 && (
          <div>
            <dt>Results</dt>
            <dd>
              <ul className="brief__stats">
                {e.stats.map((o) => (
                  <li key={o.label}>
                    <span className="brief__value">{o.value}</span>
                    <span className="brief__stat-label">{o.label}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {e.status && (
          <div>
            <dt>Status</dt>
            <dd>{e.status}</dd>
          </div>
        )}
        <div>
          <dt>Tools</dt>
          <dd>
            <Tags items={e.tools} />
          </dd>
        </div>
      </dl>

      {(e.href || e.links.length > 0) && (
        <div className="brief__actions">
          {e.href && (
            <TextLink to={e.href}>
              Read the case study
              <span className="visually-hidden">: {e.title}</span>
            </TextLink>
          )}
          {e.links.map((l) => (
            <a key={l.href} className="text-link" href={l.href} target="_blank" rel="noopener">
              <span>{l.label}</span>
              <Arrow dir="out" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ e, open, active, onToggle, onActivate, index }) {
  const uid = useId();
  // The figure is only mounted once a row has been opened, so closed rows
  // never fetch their images.
  const [everOpen, setEverOpen] = useState(open);
  if (open && !everOpen) setEverOpen(true);

  return (
    <li
      id={`project-${e.key}`}
      className={`work-item st ${open ? "is-open" : ""} ${active ? "is-active" : ""}`}
      style={{ "--si": index }}
    >
      <h4 className="work-item__head">
        <button
          type="button"
          id={`${uid}-row`}
          className="work-row"
          aria-expanded={open}
          aria-controls={`${uid}-panel`}
          onClick={onToggle}
          onMouseEnter={onActivate}
          onFocus={onActivate}
        >
          <span className="work-row__code">{e.code}</span>
          <span className="work-row__main">
            <span className="work-row__title">
              {e.title}
              {e.badge && <Badge>{e.badge}</Badge>}
            </span>
            <span className="work-row__context">{e.context}</span>
          </span>
          <span className={`work-row__year ${isOngoing(e.period) ? "is-ongoing" : ""}`}>
            {shortPeriod(e.period) ?? <span className="visually-hidden">Undated</span>}
          </span>
          <span className="work-row__plus" aria-hidden="true" />
        </button>
      </h4>
      <div
        id={`${uid}-panel`}
        className="work-detail"
        role="region"
        aria-labelledby={`${uid}-row`}
        inert={open ? undefined : ""}
      >
        <div className="work-detail__clip">
          <Brief e={e} showFigure={everOpen} />
        </div>
      </div>
    </li>
  );
}

// A visual companion to the list: it follows hover and keyboard focus. Its
// contents repeat what the rows and briefs already say, so it is hidden from
// assistive technology.
function Preview({ e }) {
  return (
    <div className="work__preview" aria-hidden="true">
      <div className="preview" key={e.key}>
        {e.figure && (
          <div className="preview__art">
            <FigureArt name={e.figure} />
          </div>
        )}
        <p className="preview__meta">
          <span>{GROUP_LABEL[e.group]}</span>
          <span className="preview__code">{e.code}</span>
        </p>
        <p className={`preview__blurb ${e.figure ? "" : "preview__blurb--solo"}`}>{e.question}</p>
        {e.status && <p className="preview__status">{e.status}</p>}
      </div>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [opened, setOpened] = useState(() => new Set([keyFromHash()].filter(Boolean)));
  const [activeKey, setActiveKey] = useState(() => keyFromHash() ?? ALL[0].key);
  const active = ALL.find((e) => e.key === activeKey) ?? ALL[0];

  const choose = (id) => {
    setFilter(id);
    setActiveKey((id === "all" ? GROUPS[0] : GROUPS.find((g) => g.id === id)).items[0].key);
  };

  const toggle = (key) => {
    setActiveKey(key);
    setOpened((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const caseStudies = ALL.filter((e) => e.href).length;

  return (
    <section id="projects" className="section work" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead
          id="projects-title"
          aside={`${ALL.length} projects, ${caseStudies} with full case studies`}
          title="Projects"
          dek="Senior design, wet lab work, modeling competitions, a teaching demo, and a few things I built on my own. Open a row for the short version; most link on to a full write-up."
        />
      </div>

      <Featured />

      <div className="wrap work__index">
        <h3 className="work__index-title">Every project</h3>
        <FilterBar label="Filter projects by type" options={FILTERS} value={filter} onChange={choose} />

        <div className="work__layout">
          <div className="work__list">
            {GROUPS.map((g) => (
              <div key={g.id} className="work-group" hidden={filter !== "all" && filter !== g.id}>
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
                      open={opened.has(e.key)}
                      active={e.key === active.key}
                      onToggle={() => toggle(e.key)}
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

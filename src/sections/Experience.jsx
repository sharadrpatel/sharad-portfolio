import { useState } from "react";
import { CLINICAL, TEACHING, LEADERSHIP } from "../data/experience.js";
import { SectionHead, FilterBar, Badge } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { useScrub } from "../lib/scroll.js";

// One grammar for every group: period on the left, role and place, then what
// the work involves.
function Entry({ period, role, org, note, highlight, index = 0, children }) {
  return (
    <li className="cv-entry st" style={{ "--si": index }}>
      <p className="cv-entry__period">{period}</p>
      <div className="cv-entry__body">
        <h4 className="cv-entry__role">
          {role}
          {highlight && <Badge>{highlight}</Badge>}
        </h4>
        <p className="cv-entry__org">
          {org}
          {note && <span>, {note.toLowerCase()}</span>}
        </p>
        {children}
      </div>
    </li>
  );
}

function Group({ id, label, note, hidden, children }) {
  const rail = useScrub("read", { line: 0.55 });
  return (
    <Reveal as="section" className="cv__group has-st" aria-labelledby={id} hidden={hidden}>
      <div className="cv__label">
        <h3 id={id} className="label">{label}</h3>
        {note && <p className="cv__count">{note}</p>}
      </div>
      <ol className="cv__entries has-rail" ref={rail}>
        {children}
      </ol>
    </Reveal>
  );
}

const FILTERS = [
  { id: "all", label: "All", count: 1 + TEACHING.length + LEADERSHIP.length },
  { id: "clinical", label: "Clinical", count: 1 },
  { id: "teaching", label: "Teaching", count: TEACHING.length },
  { id: "leadership", label: "Leadership & service", count: LEADERSHIP.length },
];

export default function Experience() {
  const c = CLINICAL;
  const [filter, setFilter] = useState("all");
  const off = (id) => filter !== "all" && filter !== id;
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead
          id="experience-title"
          aside="Research roles are listed under Research"
          title="Experience"
          dek="What I do outside of research: patient care on a hospital unit, teaching four courses, and community work."
        />

        <FilterBar label="Filter experience by type" options={FILTERS} value={filter} onChange={setFilter} />

        <div className="cv">
          <Group id="cv-clinical" label="Clinical" note={`Certified: ${c.credentials.join(", ")}`} hidden={off("clinical")}>
            <Entry period={c.period} role={c.role} org={c.place} note={c.unit}>
              <dl className="duties">
                {c.duties.map((d) => (
                  <div key={d.label}>
                    <dt>{d.label}</dt>
                    <dd>{d.text}</dd>
                  </div>
                ))}
              </dl>
            </Entry>
          </Group>

          <Group id="cv-teaching" label="Teaching" note={`${TEACHING.length} roles`} hidden={off("teaching")}>
            {TEACHING.map((t, i) => (
              <Entry key={t.course} index={i} period={t.period} role={t.course} org={t.role} note={t.format.replace(" · ", " and ")} highlight={t.highlight}>
                <p className="cv-entry__text">{t.text}</p>
              </Entry>
            ))}
          </Group>

          <Group id="cv-leadership" label="Leadership & service" note={`${LEADERSHIP.length} roles`} hidden={off("leadership")}>
            {LEADERSHIP.map((l, i) => (
              <Entry key={l.role + l.org} index={i} period={l.period} role={l.role} org={l.org}>
                <p className="cv-entry__text">{l.text}</p>
              </Entry>
            ))}
          </Group>
        </div>
      </div>
    </section>
  );
}

import { PUBLICATIONS, SELF } from "../data/publications.js";
import { SectionHead } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(ym) {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

function isUpcoming(ym) {
  const now = new Date();
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return ym > current;
}

function Authors({ list }) {
  return (
    <p className="pub__authors">
      {list.map((a, i) => (
        <span key={a}>
          {a === SELF ? <strong>{a}</strong> : a}
          {i < list.length - 1 && ", "}
        </span>
      ))}
    </p>
  );
}

export default function Publications() {
  const firstAuthor = PUBLICATIONS.filter((p) => p.authors[0] === SELF).length;
  return (
    <section id="publications" className="section" aria-labelledby="publications-title">
      <div className="wrap">
        <SectionHead
          id="publications-title"
          number="03"
          label="Publications & presentations"
          title="Publications and presentations"
          dek={`${PUBLICATIONS.length} so far, ${firstAuthor} as first author. Half come from surgical simulation research. The rest cover pediatric MRI, anesthesia monitoring, and a math modeling talk.`}
        />
        <Reveal as="ol" className="pubs">
          {PUBLICATIONS.map((p) => (
            <li key={p.title} className="pub">
              <div className="pub__date">
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                {isUpcoming(p.date) && <span className="badge badge--soft">Upcoming</span>}
              </div>
              <div className="pub__body">
                <h3 className="pub__title">{p.title}</h3>
                <Authors list={p.authors} />
                <p className="pub__venue">{p.venue}</p>
              </div>
              <p className="pub__type label label--muted">{p.type}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

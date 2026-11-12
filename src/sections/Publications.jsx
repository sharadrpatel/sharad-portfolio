import { PUBLICATIONS, SELF } from "../data/publications.js";
import { SectionHead, Badge } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { useScrub } from "../lib/scroll.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonth(ym) {
  return MONTHS[Number(ym.split("-")[1]) - 1];
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

// A rail beside each year's list fills down to the reading line.
function Rail({ children }) {
  const ref = useScrub("read", { line: 0.55 });
  return (
    <ol ref={ref} className="pubs__list has-rail">
      {children}
    </ol>
  );
}

export default function Publications() {
  const firstAuthor = PUBLICATIONS.filter((p) => p.authors[0] === SELF).length;
  const years = [...new Set(PUBLICATIONS.map((p) => p.date.slice(0, 4)))];
  return (
    <section id="publications" className="section" aria-labelledby="publications-title">
      <div className="wrap">
        <SectionHead
          id="publications-title"
          aside={`${PUBLICATIONS.length} in total, ${firstAuthor} as first author`}
          title="Publications"
          dek="Posters and talks. Half come from surgical simulation research; the rest cover pediatric MRI, anesthesia monitoring, and a math modeling talk."
        />
        <div className="pubs">
          {years.map((y) => (
            <Reveal as="section" key={y} className="pubs__year has-st" aria-labelledby={`pubs-${y}`}>
              <h3 id={`pubs-${y}`} className="pubs__y">{y}</h3>
              <Rail>
                {PUBLICATIONS.filter((p) => p.date.startsWith(y)).map((p, i) => (
                  <li key={p.title} className="pub st" style={{ "--si": i }}>
                    <p className="pub__when">
                      <time dateTime={p.date}>{formatMonth(p.date)}</time>
                      <span className="pub__type">{p.type}</span>
                    </p>
                    <div className="pub__body">
                      <h4 className="pub__title">
                        {p.title}
                        {isUpcoming(p.date) && <Badge>Upcoming</Badge>}
                      </h4>
                      <Authors list={p.authors} />
                      <p className="pub__venue">{p.venue}</p>
                    </div>
                  </li>
                ))}
              </Rail>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

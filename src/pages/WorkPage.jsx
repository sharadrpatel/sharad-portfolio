import { Link } from "../lib/router.jsx";
import { PAGES, THREADS } from "../data/work.js";
import Schematic from "../components/Schematic.jsx";

export default function WorkPage({ work: w }) {
  const thread = THREADS.find((t) => t.id === w.thread);
  const i = PAGES.indexOf(w);
  const prev = PAGES[(i - 1 + PAGES.length) % PAGES.length];
  const next = PAGES[(i + 1) % PAGES.length];
  return (
    <article className="work">
      <div className="wrap">
        <Link to={`/#${thread.section}`} className="work__back"><span aria-hidden="true">←</span> All {thread.section}</Link>
        <header className="work__head">
          <div>
            <p className="eyebrow">{thread.title}</p>
            <h1>{w.title}</h1>
            <p className="work__sum">{w.summary}</p>
          </div>
          <div className="work__fig">
            <Schematic name={w.figure} label={`Schematic for ${w.short}`} />
            <p>Schematic of the idea, not a result.</p>
          </div>
        </header>

        <dl className="work__meta">
          <div><dt>Where</dt><dd>{w.where}</dd></div>
          <div><dt>With</dt><dd>{w.advisor}</dd></div>
          <div><dt>When</dt><dd>{w.period}</dd></div>
          <div><dt>Status</dt><dd>{w.status}</dd></div>
        </dl>

        <div className="work__body">
          <section>
            <h2>Why it matters</h2>
            <p className="work__why">{w.why}</p>
          </section>

          <section>
            <h2>What I did</h2>
            <ul className="work__did">
              {w.did.map((d) => <li key={d}>{d}</li>)}
            </ul>
            {w.metrics && (
              <dl className="work__metrics">
                {w.metrics.map((m) => (
                  <div key={m.label}>
                    <dt>{m.value} <small>{m.unit}</small></dt>
                    <dd>{m.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {w.explainer && (
            <section className="remark">
              <h2>{w.explainer.title}</h2>
              <p>{w.explainer.text}</p>
            </section>
          )}

          <section>
            <h2>Where it went</h2>
            <ul className="work__out">
              {w.outputs.map((o) => (
                <li key={o.text}>
                  <span className="pill pill--on">{o.kind}</span>
                  <p>{o.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Methods and tools</h2>
            <p className="tags">{w.tools.map((t) => <span key={t} className="tag">{t}</span>)}</p>
          </section>
        </div>

        <nav className="work__nav" aria-label="More work">
          <Link to={`/work/${prev.slug}`}><small>← Previous</small>{prev.short}</Link>
          <Link to={`/work/${next.slug}`}><small>Next →</small>{next.short}</Link>
        </nav>
      </div>
    </article>
  );
}

import { BLOG, POSTS, formatPostDate, noBreak } from "../posts/index.js";
import { Link } from "../lib/router.jsx";
import { Arrow } from "../components/ui.jsx";

export default function Blog() {
  return (
    <section className="blog" aria-labelledby="blog-title">
      <div className="wrap">
        <header className="blog__head">
          <p className="label label--accent">{BLOG.title}</p>
          <h1 id="blog-title" className="blog__title">
            Notes on data, science, medicine, modeling, and sports
          </h1>
          <p className="dek">{BLOG.dek}</p>
        </header>

        <ol className="post-list">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`} className="post-row">
                <p className="post-row__meta">
                  <time dateTime={p.date}>{formatPostDate(p.date)}</time>
                  <span>{p.minutes} min read</span>
                </p>
                <div className="post-row__body">
                  <h2 className="post-row__title">{noBreak(p.title)}</h2>
                  <p className="post-row__dek">{p.dek}</p>
                  <p className="label label--muted">{p.topics.join(" · ")}</p>
                </div>
                <Arrow />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

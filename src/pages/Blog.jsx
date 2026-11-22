import { POSTS, formatPostDate } from "../lib/posts.js";
import { BLOG, issueNo } from "../data/blog.js";
import { PROFILE } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Arrow } from "../components/ui.jsx";
import CrossSectionsMark from "../components/CrossSectionsMark.jsx";

export default function Blog() {
  return (
    <section className="section blog" aria-labelledby="blog-title">
      <div className="wrap">
        <header className="masthead">
          <p className="masthead__line">
            <span>
              {BLOG.volume} · Est. {BLOG.established}
            </span>
            <span>By {PROFILE.name}</span>
          </p>
          <h1 id="blog-title" className="masthead__title">
            <CrossSectionsMark />
            <span>{BLOG.name}</span>
          </h1>
          <div className="masthead__rule" aria-hidden="true" />
          <p className="masthead__dek">{BLOG.tagline}</p>
        </header>

        {POSTS.length === 0 ? (
          <div className="blog__empty">
            <p className="issue-label">{issueNo(1)}</p>
            <p className="status">
              <span className="status__dot" aria-hidden="true" />
              In preparation
            </p>
            <p>Nothing posted yet. I'm working on the first one.</p>
          </div>
        ) : (
          <ol className="post-list">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}`} className="post-item">
                  <span className="post-item__no">{issueNo(p.no)}</span>
                  <span className="post-item__meta">
                    <time dateTime={p.date}>{formatPostDate(p.date)}</time>
                    <span>{p.minutes} min read</span>
                    {p.draft && <span className="badge badge--soft">Draft</span>}
                  </span>
                  <span className="post-item__title">{p.title}</span>
                  {p.summary && <span className="post-item__summary">{p.summary}</span>}
                  <Arrow />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

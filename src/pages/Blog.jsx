import { POSTS, formatPostDate } from "../lib/posts.js";
import { Link } from "../lib/router.jsx";
import { Arrow } from "../components/ui.jsx";

export default function Blog() {
  return (
    <section className="section blog" aria-labelledby="blog-title">
      <div className="wrap">
        <header className="blog__head">
          <p className="label label--accent">Blog</p>
          <h1 id="blog-title" className="blog__title">Writing</h1>
          <p className="dek">Notes on my research, projects, and things I'm learning along the way.</p>
        </header>

        {POSTS.length === 0 ? (
          <div className="blog__empty">
            <p className="status">
              <span className="status__dot" aria-hidden="true" />
              Work in progress
            </p>
            <p>I'm getting this set up. The first posts are coming soon.</p>
          </div>
        ) : (
          <ol className="post-list">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}`} className="post-item">
                  <span className="post-item__meta">
                    <time dateTime={p.date}>{formatPostDate(p.date)}</time>
                    <span aria-hidden="true">·</span>
                    {p.minutes} min read
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

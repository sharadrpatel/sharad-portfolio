import { useEffect, useState } from "react";
import { POSTS, formatPostDate, noBreak } from "../posts/index.js";
import { PROFILE } from "../data/profile.js";
import { Link } from "../lib/router.jsx";
import { Arrow, TextLink } from "../components/ui.jsx";

function useActiveHeading(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids.join()]);
  return active;
}

export default function Post({ post: p }) {
  const active = useActiveHeading(p.sections.map((s) => s.id));
  const i = POSTS.indexOf(p);
  const next = POSTS.length > 1 ? POSTS[(i + 1) % POSTS.length] : null;
  const { Body } = p;

  return (
    <article className="case post" aria-labelledby="post-title">
      <header className="case__header">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link to="/blog">
              <Arrow dir="left" /> Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{p.topics[0]}</span>
          </nav>
          <p className="label label--accent">{p.topics.join(" · ")}</p>
          <h1 id="post-title" className="case__title post__title">
            {noBreak(p.title)}
          </h1>
          <p className="post__dek">{p.dek}</p>
          <p className="post__byline">
            <span>{PROFILE.name}</span>
            <time dateTime={p.date}>{formatPostDate(p.date)}</time>
            <span>{p.minutes} min read</span>
          </p>
        </div>
      </header>

      <div className="wrap case__layout">
        <aside className="case__toc" aria-label="On this page">
          <p className="label label--muted">On this page</p>
          <ol>
            {p.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="case__body post__body">
          <Body />

          <nav className="case__next" aria-label="More posts">
            <TextLink to="/blog" icon="left">
              All posts
            </TextLink>
            {next && (
              <Link to={`/blog/${next.slug}`} className="next-card">
                <span className="label label--muted">Next post</span>
                <span className="next-card__title">{noBreak(next.title)}</span>
                <Arrow />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}

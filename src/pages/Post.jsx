import { useMemo } from "react";
import { marked } from "marked";
import { formatPostDate } from "../lib/posts.js";
import { Link } from "../lib/router.jsx";
import { Arrow, Tags, TextLink } from "../components/ui.jsx";

export default function Post({ post }) {
  // Posts are Markdown files from this repository, so their HTML is trusted.
  const html = useMemo(() => marked.parse(post.body), [post]);
  return (
    <article className="post" aria-labelledby="post-title">
      <header className="post__header">
        <div className="wrap post__wrap">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link to="/blog">
              <Arrow dir="left" /> Blog
            </Link>
          </nav>
          <h1 id="post-title" className="post__title">
            {post.title}
            {post.draft && <span className="badge badge--soft">Draft</span>}
          </h1>
          <p className="post__meta">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            {post.minutes} min read
          </p>
        </div>
      </header>
      <div className="wrap post__wrap">
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
        {post.tags.length > 0 && <Tags items={post.tags} label="Topics" />}
        <nav className="post__foot" aria-label="More writing">
          <TextLink to="/blog" icon="left">
            All posts
          </TextLink>
        </nav>
      </div>
    </article>
  );
}

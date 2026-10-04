// Blog posts are Markdown files in src/posts/. Each file starts with a small
// header ("front matter") between --- lines, then the post itself:
//
//   ---
//   title: My first post
//   date: 2026-10-05
//   summary: One or two sentences shown on the blog page.
//   tags: modeling, research
//   draft: false
//   ---
//
//   The post, written in Markdown...
//
// The file name becomes the URL: src/posts/my-first-post.md -> /blog/my-first-post.
// Files starting with "_" (like _template.md) are ignored. Posts marked
// "draft: true" only show up when running the site locally (npm run dev).

const files = import.meta.glob(["../posts/*.md", "!../posts/_*.md"], {
  query: "?raw",
  import: "default",
  eager: true,
});

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (key) meta[key] = value;
  }
  return { meta, body: match[2] };
}

function toPost(path, raw) {
  const slug = path.split("/").pop().replace(/\.md$/, "");
  const { meta, body } = parseFrontMatter(raw);
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: meta.title || slug.replace(/-/g, " "),
    date: meta.date || "",
    summary: meta.summary || "",
    tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    draft: meta.draft === "true",
    minutes: Math.max(1, Math.round(words / 220)),
    body,
  };
}

const showDrafts = import.meta.env.DEV;

export const POSTS = Object.entries(files)
  .map(([path, raw]) => toPost(path, raw))
  .filter((p) => showDrafts || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function findPost(slug) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatPostDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

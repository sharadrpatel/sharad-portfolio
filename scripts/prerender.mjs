// Runs after `vite build`.
//
// The site is a single-page app, so every address is served the same
// index.html. Link-preview bots (LinkedIn, Slack, iMessage) and some crawlers
// don't run JavaScript, which meant every case study shared the homepage's
// title and description. This writes one static HTML file per route with its
// own <title>, description, canonical URL, and Open Graph tags, plus a
// sitemap. The app still boots and renders exactly as before; only the <head>
// differs. Vercel serves these files ahead of the catch-all rewrite.
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, staticRoutes, postMeta } from "../src/lib/meta.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Published blog posts, read straight from their Markdown headers.
async function blogRoutes() {
  const dir = join(root, "src/posts");
  const routes = [];
  for (const file of await readdir(dir)) {
    if (!file.endsWith(".md") || file.startsWith("_")) continue;
    const raw = await readFile(join(dir, file), "utf8");
    const header = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    const field = (key) => header.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1].trim().replace(/^["']|["']$/g, "") ?? "";
    if (field("draft") === "true") continue;
    const slug = file.replace(/\.md$/, "");
    routes.push(postMeta({ slug, title: field("title") || slug.replace(/-/g, " "), summary: field("summary") }));
  }
  return routes;
}

function withMeta(html, { path, title, description }) {
  const url = SITE_URL + (path === "/" ? "/" : path);
  const swap = (pattern, replacement) => {
    if (!pattern.test(html)) throw new Error(`prerender: no match for ${pattern} in index.html`);
    html = html.replace(pattern, replacement);
  };
  swap(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  swap(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`);
  swap(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${esc(title)}$2`);
  swap(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`);
  swap(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`);
  swap(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);
  if (path !== "/") swap(/(<meta\s+property="og:type"\s+content=")[^"]*(")/, `$1article$2`);
  return html;
}

const template = await readFile(join(dist, "index.html"), "utf8");
const routes = [...staticRoutes(), ...(await blogRoutes())];

for (const route of routes) {
  if (route.path === "/") continue; // the template already carries the homepage's tags
  const dir = join(dist, route.path);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), withMeta(template, route));
}

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `  <url><loc>${SITE_URL}${r.path === "/" ? "/" : r.path}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
await writeFile(join(dist, "sitemap.xml"), sitemap);

console.log(`prerender: wrote ${routes.length - 1} route pages and sitemap.xml (${routes.length} URLs)`);

// After `vite build`: write a static HTML file for each project page so that
// direct visits and shared links get the right title and description.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { PAGES } from "../src/data/work.js";
import { metaFor } from "../src/lib/meta.js";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const base = readFileSync("dist/index.html", "utf8");

for (const work of PAGES) {
  const { title, description } = metaFor("work", work);
  const html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${esc(description)}"`);
  mkdirSync(`dist/work/${work.slug}`, { recursive: true });
  writeFileSync(`dist/work/${work.slug}/index.html`, html);
}
// Static hosts such as GitHub Pages serve 404.html for unknown paths; the app
// then shows the right page (or its own "not found").
copyFileSync("dist/index.html", "dist/404.html");
console.log(`prerender: wrote ${PAGES.length} project pages`);

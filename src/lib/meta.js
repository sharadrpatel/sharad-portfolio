// Page metadata, defined once and used twice: the app applies it on every
// navigation, and scripts/prerender.mjs writes it into a static HTML file per
// route at build time, so link previews and search results get the right
// title and description without running JavaScript.
import { PROFILE } from "../data/profile.js";
import { CASE_STUDIES } from "../data/work.js";

export const SITE_URL = "https://www.sharadrpatel.com";
export const SITE_TITLE = `${PROFILE.name} — Biomedical Engineering`;
export const SITE_DESCRIPTION =
  "Sharad Patel is a biomedical engineering student at the University of Florida who does research in computational modeling and biomechanics.";

function clip(text, max = 200) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "") + "…";
}

export function homeMeta() {
  return { path: "/", title: SITE_TITLE, description: SITE_DESCRIPTION };
}

export function caseMeta(work) {
  return {
    path: `/work/${work.slug}`,
    title: `${work.title} · ${PROFILE.name}`,
    description: clip(work.question ?? work.summary),
  };
}

export function blogMeta() {
  return {
    path: "/blog",
    title: `Blog · ${PROFILE.name}`,
    description: `Notes from ${PROFILE.name} on research, projects, and things learned along the way.`,
  };
}

export function postMeta(post) {
  return {
    path: `/blog/${post.slug}`,
    title: `${post.title} · ${PROFILE.name}`,
    description: clip(post.summary || SITE_DESCRIPTION),
  };
}

export function notFoundMeta() {
  return { path: null, title: `Not found · ${PROFILE.name}`, description: SITE_DESCRIPTION };
}

// Every route with a fixed address (blog posts are added by the prerender script).
export function staticRoutes() {
  return [homeMeta(), ...CASE_STUDIES.map(caseMeta), blogMeta()];
}

// Client side: keep the document head in step with the current route.
export function applyMeta({ path, title, description }) {
  document.title = title;
  const set = (selector, attr, value) => document.head.querySelector(selector)?.setAttribute(attr, value);
  set('meta[name="description"]', "content", description);
  set('meta[property="og:title"]', "content", title);
  set('meta[property="og:description"]', "content", description);
  const url = path ? SITE_URL + (path === "/" ? "/" : path) : SITE_URL + "/";
  set('meta[property="og:url"]', "content", url);
  set('link[rel="canonical"]', "href", url);
}

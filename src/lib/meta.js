// Page titles and descriptions, shared by the app and scripts/prerender.mjs.
export const SITE_NAME = "Sanandan Ojha";
const HOME = {
  title: "Sanandan Ojha · Mathematics, modeling and medicine",
  description:
    "Sanandan Ojha studies mathematics and biomedical engineering at the University of Florida. Mathematical modeling, numerical methods and Bayesian inference, applied to biology and medicine.",
};

export function metaFor(page, work) {
  if (page === "work" && work) return { title: `${work.short || work.title} · ${SITE_NAME}`, description: work.summary };
  if (page === "404") return { title: `Page not found · ${SITE_NAME}`, description: HOME.description };
  return HOME;
}

export function applyMeta({ title, description }) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
}

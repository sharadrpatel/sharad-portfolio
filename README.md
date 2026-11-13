# Sanandan Ojha — Portfolio

Personal site for research and project work in mathematics, modeling and medicine. Built with React and Vite.

## Development

```bash
npm install
```

```bash
npm run dev
```

`npm run build` produces the static site in `dist/`, including one HTML file per project page.

## Where things live

```
src/
  data/        All content. Edit these files to update the site.
    site.js      Name, contact links, education, interests, trajectory
    work.js      Research and projects (entries with `page: true` get a page at /work/<slug>)
    record.js    Publications, talks, posters, honors, training, skills, teaching, leadership
  pages/       Home, the project page, 404
  components/  Nav, footer, theme toggle, the live hero figure, schematics
  lib/         Router and page metadata
  styles/      tokens.css (colors, type) and site.css (everything else)
scripts/       Build step that writes per-page HTML for link previews
public/        CV, favicon, link-preview image
```

## How the site is organized

- **Everything is on one page**, in sections: About, Research, Projects, Record, Preparation, Teaching and
  leadership, Contact. Featured work has its own page with motivation, what was done, a plain-language
  explanation of the method, and where it was presented. Other entries expand in place.
- **The opening sequence** (`Intro.jsx`) plays once per session: the strange attractor of a forced Duffing
  oscillator assembles itself, then the page is revealed. Click or press a key to skip.
- **The hero figure** runs a real ABC-SMC fit on synthetic data in the browser (`Posterior.jsx`). It is
  an illustration of the method, not research data.
- **Motion** lives in `src/lib/motion.js`: smooth scrolling (Lenis) and scroll-linked scenes. A registered
  element gets a `--p` custom property (0 → 1) that the CSS animates against: the hero name parting,
  section titles rising, the About passage inking in word by word, the trajectory rail filling, the
  methods ticker. Schematics draw themselves when first seen. All of it is off under
  `prefers-reduced-motion`.
- **Schematics** on the cards (`Schematic.jsx`) are diagrams of each idea. Replace them with real figures
  when available.
- **Themes:** charcoal (dark, default) and paper (light). Colors and fonts are defined once in
  `src/styles/tokens.css`. Fraunces for headings, Instrument Sans for text, JetBrains Mono for data.

## Things to fill in

Search the `src/data/` files for `TODO`:

- `PROFILE.linkedin` in `site.js` (the LinkedIn buttons appear once it is set).
- `EDUCATION.coursework` in `site.js` (a "Selected coursework" block appears once it has entries).
- The Duffing oscillator entry in `work.js` is a short placeholder description. Add your own role and details.

## Deployment

The site is published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `master`.
One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

The workflow builds with `BASE_PATH=/<repository name>/`, so the site works from
`https://<user>.github.io/portfolio/`. On a custom domain or on Vercel, leave `BASE_PATH` unset and the
site is served from `/`. `vercel.json` is kept for that case.

Once the address is final, add `og:url` and a canonical link in `index.html` and make the `og:image`
address absolute.

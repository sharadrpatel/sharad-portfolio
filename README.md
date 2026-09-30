# Sharad Patel — Personal Portfolio

Portfolio for research and engineering work in biomedical engineering, built with React + Vite.
Live at [sharadrpatel.com](https://sharadrpatel.com).

## Development

```bash
npm install
npm run dev
```

## Structure

```
src/
  data/        Content — edit these to update the site (profile, research, projects, publications, experience)
  sections/    Homepage sections (Hero, Research, Projects, Publications, Experience, About, Contact)
  pages/       Home, case-study page (/work/:slug), 404
  components/  Nav, Footer, Reveal, figures, small UI primitives
  lib/         Minimal History-API router
  styles/      Design tokens and styles (tokens → base → components → sections → figures → case)
```

- Research entries live in `src/data/work.js`. `tier: "featured"` gives a large row with a figure;
  `caseStudy: true` generates a page at `/work/<slug>`.
- Colors, type, and spacing are defined once in `src/styles/tokens.css`.
- `public/CV.pdf` is the downloadable CV and the factual source for site content.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` to auto-deploy. `vercel.json` rewrites
unknown paths to `index.html` so case-study URLs work on direct load.

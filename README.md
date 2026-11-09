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
  sections/    Homepage sections (Hero, Now, Research, Projects, Publications, Experience, About, Contact)
  pages/       Home, case-study page (/work/:slug), 404
  components/  Nav, Footer, Reveal, figures, small UI primitives
  lib/         Minimal History-API router
  styles/      Design tokens and styles (tokens → base → components → sections → figures → case)
```

- Research entries live in `src/data/work.js`. `tier: "featured"` gives a full plate with a figure;
  `caseStudy: true` generates a page at `/work/<slug>`.
- Design, wet lab, and modeling entries (also in `work.js`) and the smaller projects in
  `src/data/projects.js` all feed the one filterable Projects index. Entries with a case study link to
  it; the rest expand in place.
- "Now" on the homepage lists `CURRENTLY` from `src/data/profile.js`.
- Colors, type, and spacing are defined once in `src/styles/tokens.css`: bone paper, near-black ink, one
  cobalt accent; Schibsted Grotesk for structure, Source Serif 4 for reading, DM Mono for annotation.
- Motion: `src/lib/scroll.js` gives registered elements a `--p` custom property (0 → 1) that follows
  the scroll both ways, and the scroll scenes in `src/styles/motion.css` are written against it.
  `Reveal` entrances replay when content drops back below the fold. The intro screen
  (`src/components/Loader.jsx`) runs once per session: a model fit whose R² is the countdown, then
  the measurements burst into points that assemble into the hero name. The footer signature (`Signature.jsx`) reverses the idea on scroll.
  Everything rests in its finished state under `prefers-reduced-motion`.
- Smooth scrolling: `src/lib/smooth.js` runs Lenis for wheel and trackpad scrolling (touch stays
  native; off under reduced motion). The router's in-page links glide through it, and route changes
  jump through it so its measurements stay in sync.
- Themes: white (default) and black. Dark values live under `:root[data-theme="dark"]` in
  `tokens.css`; `index.html` sets the theme before first paint (saved choice, else system setting),
  and `ThemeToggle.jsx` switches it with a circular view transition.
- `public/CV.pdf` is the downloadable CV and the factual source for site content.

## Writing a blog post

Posts are Markdown files in `src/posts/`. The file name becomes the address:
`src/posts/my-first-post.md` is published at `/blog/my-first-post`.

1. Copy `src/posts/_template.md` and rename it (lowercase, dashes instead of spaces).
2. Fill in the header at the top: `title`, `date` (YYYY-MM-DD), `summary`, `tags`.
3. Set `draft: false` when it's ready. Drafts only show up when running `npm run dev`.
4. Put any images in `public/blog-images/` and link them as `/blog-images/name.png`.

You can do all of this on github.com without installing anything: open `src/posts/`,
choose **Add file → Upload files** (or **Create new file**), and commit to `master`.
Vercel rebuilds the site automatically.

Coming from a rich-text document: Google Docs can export Markdown directly
(**File → Download → Markdown (.md)**). Then add the header block at the top.

The blog page shows "Work in progress" until the first published post exists.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `master` to auto-deploy. `vercel.json` rewrites
unknown paths to `index.html` so case-study URLs work on direct load.

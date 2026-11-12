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
  components/  Nav, Footer, figures, intro, small UI primitives (section heads, filters, buttons)
  lib/         Minimal History-API router, page metadata, scroll helpers
  styles/      Design tokens and styles (fonts → tokens → base → components → sections → figures → case → motion → theme)
scripts/       Build step that writes per-route HTML and the sitemap
```

- Research entries live in `src/data/work.js`. `tier: "featured"` gives a full plate with a figure;
  `caseStudy: true` generates a page at `/work/<slug>`.
- Design, wet lab, and modeling entries (also in `work.js`) and the smaller projects in
  `src/data/projects.js` all feed the one filterable Projects index. Entries with a case study link to
  it; the rest expand in place.
- "Now" on the homepage lists `CURRENTLY` from `src/data/profile.js`.
- Every project row in the Projects index opens a short brief in place (question, what was built, the
  approach, my part, headline results, tools); entries with a case study link on to it from there. The
  brief is generated from the same fields the case-study page uses, so there is nothing extra to write.
- Colors, type, and spacing are defined once in `src/styles/tokens.css`: bone paper, near-black ink, one
  cobalt accent. Schibsted Grotesk for structure (headings, labels, interface), Source Serif 4 for
  reading, DM Mono only for data (dates, catalog codes, tool names, figure readouts). The fonts are
  self-hosted from the `@fontsource` packages; `src/styles/fonts.css` declares just the subsets in use.
- Motion has two layers, both off under `prefers-reduced-motion`:
  - Scrubbed scenes follow the scroll both ways. `src/lib/scroll.js` gives a registered element a
    `--p` custom property (0 → 1) from one shared rAF loop, and `src/styles/scenes.css` is written
    against it: the hero name parting, the Now band opening, section titles gliding in, figures
    drawing themselves, timeline rails filling, the About passage inking in word by word
    (`ScrollWords.jsx`), the portrait warming to color, and the Selected work strip.
  - Entrances play once when something first comes into view (`Reveal.jsx`, `SectionHead`).
  The intro (`Loader.jsx`) runs once per session: a model fit whose R² is the countdown, then the
  measurements become the hero name; the footer `Signature.jsx` is its bookend. The tools marquee
  (`Ticker.jsx`) speeds up and turns around with the scroll.
- Selected work (`src/sections/Featured.jsx`) is a strip of picture-led cards at the top of Projects.
  On wide screens it pins and vertical scrolling moves it sideways; on phones it is a swipeable row.
  Edit the `FEATURED` list there to change which projects appear or which figure leads.
- Smooth scrolling: `src/lib/scrolling.js` runs Lenis for wheel and trackpad scrolling (touch stays
  native). The router's in-page links glide through it.
- Numbers are rendered as their real values. `CountUp.jsx` only plays on a figure arriving from below
  the fold, and never leaves a placeholder on the page.
- Themes: white (default) and black. Dark values live under `:root[data-theme="dark"]` in
  `tokens.css`; `index.html` sets the theme before first paint (saved choice, else system setting),
  and `ThemeToggle.jsx` switches it with a circular view transition.
- Page metadata lives in `src/lib/meta.js`. The app applies it on navigation, and
  `scripts/prerender.mjs` (run by `npm run build`) writes a static HTML file per route with the right
  title, description, canonical URL, and Open Graph tags, plus `sitemap.xml`, so shared links preview
  correctly. `public/og.png` is the preview image. If the primary domain changes, update `SITE_URL`
  there and the URLs in `index.html` and `public/robots.txt`.
- Figure plots in `public/images/` are lossless WebP. New plots can be added as PNG or WebP; set the
  path and pixel size in `src/components/figures.jsx`.
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
unknown paths to `index.html` so any URL works on direct load (the prerendered route files are served
first), and sets long-lived caching for the hashed build assets.

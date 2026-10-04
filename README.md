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

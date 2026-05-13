# slop-scan docs

Static Vite site for the `voku/slop-scan` documentation landing page.

## Production URL

- GitHub Pages: https://voku.github.io/slop-scan_docs/

## Local development

**Prerequisites**

- Node.js 20+
- npm

**Commands**

```bash
npm install
npm run dev
```

The local dev server runs on `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` outputs the static site to `dist/`.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

The workflow:

1. installs dependencies with `npm ci`
2. builds the site with Vite
3. uploads `dist/` as the Pages artifact
4. deploys the artifact to GitHub Pages

## Key files

- `src/App.tsx` — main landing page content
- `src/index.css` — Tailwind theme and custom styles
- `index.html` — document metadata, favicon, and Open Graph tags
- `public/favicon.svg` — browser tab icon
- `public/og-preview.svg` — social preview image
- `vite.config.ts` — Vite config for static builds and aliases
- `.github/workflows/deploy-pages.yml` — automatic GitHub Pages deployment

## Key Files Detector helper prompt

Use this prompt when you want an agent to identify the most important files in the repo before making changes:

```text
You are reviewing the slop-scan docs repository.

Identify the smallest set of key files needed to understand and safely change this site.
For each file, explain why it matters in one sentence.
Prioritize files that control:
- page content
- styling
- metadata and social previews
- build and deployment behavior

Return the result as a short bullet list ordered by importance.
```

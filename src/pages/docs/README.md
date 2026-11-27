# Piral Documentation

Official documentation for [Piral](https://piral.io) — the open-source framework for building micro frontend applications.

**Built with [Rspress v2](https://rspress.rs)** — a high-performance static site generator based on Rsbuild.

## Features

- ⚡ Millisecond cold starts via Rspack + lazy compilation
- 🔍 Built-in full-text search (no external service)
- 🌙 Light / dark mode toggle
- 📱 Fully responsive
- 📝 MDX support — use React components inside Markdown
- ✏️ Edit-on-GitHub link on every page
- 🚀 Static output — deploys to GitHub Pages, Netlify, Vercel, S3, anywhere

## Local development

```bash
npx lerna run dev --scope piral-docs       # → http://localhost:5173 (or similar)
npx lerna run build --scope piral-docs     # → doc_build/
npx lerna run preview --scope piral-docs   # preview the production build
```

## Project structure

```
piral/
├── docs/                    ← all content (Markdown / MDX)
│   ├── index.md             ← homepage
│   ├── getting-started/
│   ├── concepts/
│   ├── guides/
│   ├── reference/
│   ├── advanced/
│   ├── api/
│   └── public/              ← static assets (logos, diagrams)
│       └── diagrams/        ← SVG architecture diagrams
└── src/pages/docs/
    ├── theme/
    |   ├── index.tsx        ← theme entry (wraps rspress default)
    |   └── index.css        ← Piral brand CSS overrides
    ├── rspress.config.ts        ← site config: nav, sidebar, social links
    └── package.json
```

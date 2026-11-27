---
title: Deploying to production
description: How to ship the app shell as a static site and publish pilets to a feed — with server configs and CI examples.
---

# Deploying to production

A Piral application has **two independent deployment streams**, and keeping them separate is the whole point:

- The **app shell** is a static site. You build it once and host the `dist/release/` output like any SPA. It changes rarely.
- **Pilets** are published to a **feed service**, not bundled into the shell. They ship continuously, on each team's own schedule, without ever redeploying the shell.

This page covers both, plus the server configuration and caching that make it reliable.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two independent deployment streams: the app shell builds to a static host; pilets publish to a feed service. The browser loads the shell, then the pilets the feed returns.">
  <rect class="d-fill" x="0" y="0" width="760" height="270" rx="14" fill="var(--dg-canvas)"/>

  <rect class="d-stroke" x="24" y="40" width="178" height="52" rx="9" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="113" y="64" fill="var(--dg-brand)">App shell project</text>
  <text class="d-s d-tc" x="113" y="81" fill="var(--dg-ink-soft)">built once, changes rarely</text>
  <path class="d-dash" d="M202 66 H270" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M266 59 L280 66 L266 73 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="236" y="56" fill="var(--dg-ink-soft)">npm run build</text>
  <rect class="d-stroke" x="284" y="40" width="214" height="52" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-h d-tc" x="391" y="64" fill="var(--dg-ink)">Static host / CDN</text>
  <text class="d-s d-tc" x="391" y="81" fill="var(--dg-ink-soft)">nginx · S3+CloudFront · Netlify</text>

  <rect class="d-stroke" x="24" y="176" width="178" height="58" rx="9" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h d-tc" x="113" y="200" fill="var(--dg-a)">Pilet projects</text>
  <text class="d-s d-tc" x="113" y="218" fill="var(--dg-ink-soft)">shipped continuously, per team</text>
  <path class="d-dash" d="M202 205 H270" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M266 198 L280 205 L266 212 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="236" y="195" fill="var(--dg-ink-soft)">pilet publish</text>
  <rect class="d-stroke" x="284" y="182" width="214" height="52" rx="9" fill="var(--dg-ok-bg)" stroke="var(--dg-ok)"/>
  <text class="d-h d-tc" x="391" y="206" fill="var(--dg-ok)">Feed service</text>
  <text class="d-s d-tc" x="391" y="223" fill="var(--dg-ink-soft)">Piral Cloud or custom</text>

  <path class="d-dash" d="M498 66 H560 V120" stroke="var(--dg-brand)"/>
  <path class="d-fill" d="M553 116 L560 130 L567 116 Z" fill="var(--dg-brand)"/>
  <path class="d-dash" d="M498 208 H560 V150" stroke="var(--dg-ok)"/>
  <path class="d-fill" d="M553 154 L560 140 L567 154 Z" fill="var(--dg-ok)"/>

  <rect class="d-stroke-2" x="566" y="104" width="170" height="62" rx="10" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-h d-tc" x="651" y="130" fill="var(--dg-ink)">Users' browser</text>
  <text class="d-s d-tc" x="651" y="148" fill="var(--dg-ink-soft)">shell loads, then pilets</text>
</svg>
</div>
<figcaption>Two independent pipelines: the shell deploys as a static site, pilets publish to the feed — and they meet only in the browser.</figcaption>
</figure>

## Deploying the app shell

`npm run build` produces `dist/release/` — plain static files (HTML, JS, CSS, assets). Serve them from any static host or web server. There is one hard requirement: because routing is client-side, the server must **fall back to `index.html`** for any path that isn't a real file, so deep links and refreshes work.

### Self-hosted: nginx

A complete server block for a self-hosted static deployment, with SPA fallback, compression, and correct caching:

```nginx
server {
  listen 443 ssl http2;
  server_name app.example.com;
  root /var/www/my-portal;          # contents of dist/release/
  index index.html;

  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1024;

  # Hashed assets never change — cache them aggressively
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
  }

  # The HTML entry point must never be cached
  location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # SPA fallback: every other route renders the app shell
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Self-hosted: Apache / IIS

For Apache, an `.htaccess` in the web root handles the fallback:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

For IIS, add a rewrite rule in `web.config` that maps non-file requests to `/index.html`. The principle is identical: real files are served as-is, everything else returns the shell.

### Managed static hosts

Most platforms need only a one-line fallback rule:

| Host | SPA fallback configuration |
|---|---|
| Netlify | `_redirects`: `/* /index.html 200` |
| Vercel | `vercel.json` rewrite: `"source": "/(.*)", "destination": "/index.html"` |
| GitHub Pages | Copy `index.html` to `404.html` |
| Azure Static Web Apps | `staticwebapp.config.json` `navigationFallback` → `/index.html` |
| AWS S3 + CloudFront | Set the error document to `index.html` (403/404 → 200) |

### App shell via GitHub Actions

```yaml
name: Deploy app shell
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/release
```

### App shell to AWS S3 + CloudFront

```bash
aws s3 sync dist/release s3://my-bucket --delete
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"
```

## Caching strategy

Get these headers right and the app feels instant while still updating predictably:

```
# Hashed asset bundles (app shell + pilets) — cache forever
Cache-Control: public, max-age=31536000, immutable

# index.html — never cache, so new releases are picked up immediately
Cache-Control: no-cache, no-store, must-revalidate

# The feed response — short TTL so rollouts/rollbacks propagate fast
Cache-Control: public, max-age=30, stale-while-revalidate=60
```

The feed TTL is the lever that controls how quickly a pilet rollout or rollback reaches users — typically within 30–60 seconds.

## Deploying pilets

Pilets never go through the app shell's pipeline. Each pilet builds and publishes to the feed independently:

```yaml
name: Publish pilet
on:
  push:
    branches: [main]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm test
      - run: npx pilet build
      - run: npx pilet publish --url ${{ vars.FEED_URL }}/api/v1/pilets --api-key ${{ secrets.FEED_API_KEY }}
```

The feed stores the bundle on your CDN and records the new version; the next feed response includes it. Where the feed lives — [Piral Cloud](https://www.piral.cloud) or a [custom feed service](/advanced/custom-feed) — doesn't change the publish step.

## Rollback

Because the shell only knows the feed URL, rolling back a pilet never touches the shell. Point the feed at the previous version and users pick it up on their next load:

| Feed type | How to roll back |
|---|---|
| Piral Cloud | One click in the dashboard |
| Self-hosted feed | Set the active version in your database |
| Static JSON feed | Edit the `version` / `link` in the JSON file |

No app shell rebuild, no `git revert`, no redeploy.

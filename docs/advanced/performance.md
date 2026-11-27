---
title: Performance & lazy loading
description: Keeping a Piral application fast with many pilets — code splitting, deferring pilets from the shell, dependency optimisation, and caching.
---

# Performance & lazy loading

## The default loading model

On startup, the app shell:

1. Fetches the feed (one request)
2. Loads every pilet's JS bundle in parallel
3. Calls each pilet's `setup()`

With 30 pilets averaging 80 KB gzipped, that's 2.4 MB before the page is interactive — even if the user only needs three pilets. The strategies below cut that down.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Eager loading downloads every pilet bundle at startup; lazy loading defers a pilet's bundle until its route is visited.">
  <rect class="d-fill" x="0" y="0" width="760" height="250" rx="14" fill="var(--dg-canvas)"/>
  <text class="d-h d-tc" x="190" y="30" fill="var(--dg-ink)">Eager — all at startup</text>
  <text class="d-h d-tc" x="570" y="30" fill="var(--dg-brand)">Lazy — on demand</text>
  <rect class="d-stroke" x="36" y="44" width="308" height="180" rx="10" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s d-tc" x="190" y="64" fill="var(--dg-ink-soft)">on startup, fetch every bundle</text>
  <rect class="d-fill" x="56" y="76" width="84" height="34" rx="6" fill="var(--dg-a-bg)"/>
  <rect class="d-fill" x="148" y="76" width="84" height="34" rx="6" fill="var(--dg-b-bg)"/>
  <rect class="d-fill" x="240" y="76" width="84" height="34" rx="6" fill="var(--dg-c-bg)"/>
  <rect class="d-fill" x="56" y="118" width="84" height="34" rx="6" fill="var(--dg-a-bg)"/>
  <rect class="d-fill" x="148" y="118" width="84" height="34" rx="6" fill="var(--dg-b-bg)"/>
  <rect class="d-fill" x="240" y="118" width="84" height="34" rx="6" fill="var(--dg-c-bg)"/>
  <text class="d-s d-tc" x="190" y="186" fill="var(--dg-ink-soft)">≈ all bundles downloaded</text>
  <text class="d-s d-tc" x="190" y="206" fill="var(--dg-ink-soft)">slow time-to-interactive</text>
  <rect class="d-stroke" x="416" y="44" width="308" height="180" rx="10" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s d-tc" x="570" y="64" fill="var(--dg-ink-soft)">load now only what's needed</text>
  <rect class="d-fill" x="436" y="76" width="84" height="34" rx="6" fill="var(--dg-a-bg)"/>
  <rect class="d-fill" x="528" y="76" width="84" height="34" rx="6" fill="var(--dg-b-bg)"/>
  <rect class="d-dash" x="620" y="76" width="84" height="34" rx="6" stroke="var(--dg-line)"/>
  <rect class="d-dash" x="436" y="118" width="84" height="34" rx="6" stroke="var(--dg-line)"/>
  <rect class="d-dash" x="528" y="118" width="84" height="34" rx="6" stroke="var(--dg-line)"/>
  <rect class="d-dash" x="620" y="118" width="84" height="34" rx="6" stroke="var(--dg-line)"/>
  <text class="d-s d-tc" x="570" y="186" fill="var(--dg-ink-soft)">dashed = fetched later, on demand</text>
  <text class="d-s d-tc" x="570" y="206" fill="var(--dg-ink-soft)">fast time-to-interactive</text>
</svg>
</div>
<figcaption>Eager loading downloads every pilet up front; lazy techniques defer code until it's actually needed.</figcaption>
</figure>

## Pilets are fast by default

Before reaching for any strategy, it's worth knowing that pilets are inherently fast:

- **Small entry, parallel streaming.** A pilet's `index.js` is small, so it loads quickly — and over HTTP/2 (and newer) many small files stream in parallel, so requesting several pilets at once isn't the penalty it was under HTTP/1.
- **Cached indefinitely, no collisions.** Each pilet is served from a path that contains its **name and version**, so versions can never collide and bundles can be cached **forever**. (The official [Piral Cloud](https://www.piral.cloud) feed serves them exactly this way.)
- **Warm loads beat an SPA.** Because unchanged pilets are already on disk from a previous visit, a returning user often loads *faster* than with an equivalent monolithic SPA — only the pilets that actually changed are fetched again.

So the strategies below matter mostly at larger scale (dozens of pilets) or to shave the very first paint — not as everyday necessities.

## Strategy 1: Code splitting within a pilet

This is the everyday lazy-loading technique, and it's always available. Split heavy pages with `React.lazy` so a pilet ships a small entry and pulls in the rest only when a route is opened:

```tsx
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ReportsPage   = React.lazy(() => import('./pages/ReportsPage'));

export function setup(api: PiletApi) {
  api.registerPage('/analytics', DashboardPage);
  api.registerPage('/analytics/reports', ReportsPage);
}
```

Wrap the shell's `RouteSwitch` in `<Suspense>` so the chunk can load gracefully:

```tsx
const RouteSwitch: React.FC = ({ children }) => (
  <React.Suspense fallback={<PageSkeleton />}>
    {children}
  </React.Suspense>
);
```

The pilet still loads at startup, but it stays tiny; the bulk arrives on navigation. Reach for this first — it needs no shell coordination and no feed changes.

## Strategy 2: Deferring whole pilets from the app shell

Sometimes you want to keep an *entire* pilet out of the initial load — an admin area, a rarely used reporting module — without splitting it internally. Because **you** own `requestPilets`, the shell can decide which pilets load at startup and which load later. A nice side effect: this needs no feed-side orchestration — a static JSON file or a fixed list is enough, since the *shell* does the filtering and the timing.

```tsx
const all = await loadPiletList(); // a static JSON, a fixed list, or a feed response
const eager = all.filter((p) => !p.custom?.deferred);
const deferred = all.filter((p) => p.custom?.deferred);

const instance = createInstance({
  requestPilets: () => Promise.resolve(eager), // load only the essentials at startup
});

// …later, when the condition applies (a feature flag, a role, a route, a "load more"):
const meta = deferred.find((p) => p.name === 'pilet-reports');
await instance.context.addPilet(meta); // load + evaluate + inject on demand
```

`instance.context.addPilet(meta)` fetches, evaluates, and injects the pilet at runtime — its pages, menu items, and extensions light up immediately. The companion `removePilet(name)` tears one down again, and `injectPilet(pilet)` injects an already-loaded one.

Use Strategy 2 when the unit you want to defer is a whole pilet and the decision lives in the shell; use Strategy 1 when the deferral is *within* a single pilet.

## Strategy 3: Optimise shared dependencies

Audit what each pilet actually bundles:

```bash
npx pilet build --source-maps
npx source-map-explorer dist/index.js
```

If you see React, the router, or your design system inside multiple pilet bundles, move them to the app shell's `importmap` (central externals). For domain libraries shared between only some pilets, use a pilet-level `importmap` side-bundle instead. See [Dependency sharing](/concepts/dependency-sharing).

## Strategy 4: CDN caching

Pilet bundles have content-hashed filenames by default. Cache them forever:

```
Cache-Control: public, max-age=31536000, immutable
```

Only `index.html` and the feed JSON should have short cache TTLs.

## Strategy 5: Eliminate the feed round trip

The one thing that can make a Piral app's *first* load longer than a plain SPA is the extra hop to the feed service: the shell loads, asks the feed which pilets to use, then loads them. You can remove that hop by serving `index.html` **dynamically** rather than statically — take the usual static `index.html` and augment it so it already carries the feed response.

Inline the pilet list into the document (for example as a small script the shell reads instead of fetching), and point `requestPilets` at it:

```html
<!-- injected by the server into index.html -->
<script>
  window.__pilets__ = [ /* the feed response, rendered server-side */ ];
</script>
```

```tsx
const instance = createInstance({
  requestPilets: () => Promise.resolve((window as any).__pilets__ ?? fetchFeed()),
});
```

Now the shell starts loading pilets immediately — there's no separate feed request. In the warm-load case those bundles are already cached on disk, so they're available at once, with no network round trip at all for unchanged pilets. This pairs naturally with a server-rendered shell; see [Server-side rendering](/advanced/ssr).

## Performance targets

| Artifact | Good | Warning |
|---|---|---|
| App shell JS (gzipped) | < 100 KB | > 200 KB |
| Individual pilet (gzipped) | < 60 KB | > 150 KB |
| Feed response JSON | < 5 KB | > 20 KB |
| Time to first pilet render | < 2s (fast connection) | > 4s |

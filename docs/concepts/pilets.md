---
title: Pilets
description: What pilets are, how they work, and everything they can do.
---

# Pilets

A pilet is a self-contained JavaScript module: independently developed, independently deployed, loaded at runtime by the app shell. It has one public interface — its `setup` function — through which it registers everything it contributes.

## The setup function

```tsx
import type { PiletApi } from 'my-app-shell';

export function setup(api: PiletApi) {
  // Everything the pilet contributes goes here
}
```

The shell calls `setup` once when the pilet loads. After it returns, all registrations are live.

`setup` can be async. The shell waits for the promise to resolve:

```tsx
export async function setup(api: PiletApi) {
  const flags = await fetch('/api/flags').then(r => r.json());

  // Conditionally register different pages based on feature flags
  if (flags.newCheckoutFlow) {
    api.registerPage('/checkout', NewCheckoutPage);
  } else {
    api.registerPage('/checkout', LegacyCheckoutPage);
  }
}
```

## The teardown function

Alongside the required `setup`, a pilet may export an optional `teardown(api)`. The shell calls it when the pilet is **removed at runtime** — most commonly when it is hot-reloaded during development, but also when it is updated to a new version or disabled via the feed.

```tsx
import type { PiletApi } from 'my-app-shell';

let stop: () => void;

export function setup(api: PiletApi) {
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  stop = () => window.removeEventListener('resize', handler);
}

export function teardown(api: PiletApi) {
  stop?.();
}
```

You don't need `teardown` for anything the shell tracks itself — pages, menus, and extensions are unregistered automatically when the pilet goes away. Use it for **custom cleanup the shell can't see**: removing DOM/event listeners, closing sockets or timers, or otherwise releasing resources your `setup` acquired.

## What a pilet can register

| Method | Description |
|---|---|
| `api.registerPage(path, component)` | Mount a component at a URL route |
| `api.registerMenu(component, opts?)` | Add an item to a named navigation zone |
| `api.registerExtension(name, component)` | Contribute to a named extension slot |
| `api.registerModal(name, component)` | Register a named modal dialog |
| `api.registerTile(component, prefs?)` | Add a tile to the dashboard (`piral-dashboard`) |

The exact available methods depend on which plugins the app shell has installed. TypeScript types reflect exactly what's available — no guessing.

## Cross-pilet communication

Pilets don't share a module scope. Three mechanisms exist for interaction:

### Events

```tsx
// Fire an event
api.emit('cart:item-added', { productId: 'p1', qty: 2 });

// Listen for it (in any pilet)
api.on('cart:item-added', ({ productId, qty }) => {
  updateCartBadge(qty);
});
```

Events don't replay for late-loading pilets. Use them for real-time notifications, not for initial state.

### Shared data store

```tsx
// Write (first pilet to write a key owns it)
api.setData('currentUser', { id: 'u1', name: 'Alice', roles: ['admin'] });

// Read
const user = api.getData('currentUser');

// Subscribe to changes
api.on('store-data', ({ name, value }) => {
  if (name === 'currentUser') refreshUserUI(value);
});
```

Write to the store early in `setup` so pilets that load later find the value already there.

### Extension slots

For sharing UI across pilet boundaries — one pilet declares a slot, another fills it. See [Extension slots](/concepts/extension-slots) for the full story.

## Sharing dependencies

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 332" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Central sharing: the app shell provides react and react-dom to all pilets. Distributed sharing: one pilet declares a package and other pilets reuse the same instance.">
  <rect class="d-fill" x="0" y="0" width="760" height="332" rx="14" fill="var(--dg-canvas)"/>

  <rect class="d-stroke" x="40" y="26" width="680" height="64" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h" x="60" y="52" fill="var(--dg-brand)">App Shell · central importmap</text>
  <text class="d-m" x="60" y="74" fill="var(--dg-ink-soft)">react · react-dom · react-router-dom — pure externals, never bundled</text>

  <path class="d-dash" d="M150 90 V150" stroke="var(--dg-brand)"/>
  <path class="d-dash" d="M380 90 V150" stroke="var(--dg-brand)"/>
  <path class="d-dash" d="M610 90 V150" stroke="var(--dg-brand)"/>
  <text class="d-s d-tc" x="380" y="116" fill="var(--dg-ink-soft)">provided to every pilet</text>

  <rect class="d-stroke" x="60" y="150" width="180" height="150" rx="9" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h d-tc" x="150" y="176" fill="var(--dg-a)">Pilet A · analytics</text>
  <rect class="d-fill" x="76" y="190" width="148" height="44" rx="6" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="150" y="208" fill="var(--dg-ink-soft)">own importmap:</text>
  <text class="d-m d-tc" x="150" y="225" fill="var(--dg-a)">recharts</text>
  <text class="d-s d-tc" x="150" y="262" fill="var(--dg-ink-soft)">resolves recharts first</text>
  <text class="d-s d-tc" x="150" y="280" fill="var(--dg-ink-soft)">→ becomes a side-bundle</text>

  <rect class="d-stroke" x="290" y="150" width="180" height="150" rx="9" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-h d-tc" x="380" y="176" fill="var(--dg-b)">Pilet B · reports</text>
  <rect class="d-fill" x="306" y="190" width="148" height="44" rx="6" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="380" y="208" fill="var(--dg-ink-soft)">declares same name:</text>
  <text class="d-m d-tc" x="380" y="225" fill="var(--dg-b)">recharts</text>
  <text class="d-s d-tc" x="380" y="262" fill="var(--dg-ink-soft)">reuses A's instance</text>
  <text class="d-s d-tc" x="380" y="280" fill="var(--dg-ink-soft)">→ no second download</text>

  <rect class="d-stroke" x="520" y="150" width="180" height="150" rx="9" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-h d-tc" x="610" y="176" fill="var(--dg-c)">Pilet C · account</text>
  <rect class="d-fill" x="536" y="190" width="148" height="44" rx="6" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="610" y="216" fill="var(--dg-ink-soft)">doesn't need recharts</text>
  <text class="d-s d-tc" x="610" y="262" fill="var(--dg-ink-soft)">unaffected — only loads</text>
  <text class="d-s d-tc" x="610" y="280" fill="var(--dg-ink-soft)">what it declares</text>

  <path class="d-dash" d="M240 225 H290" stroke="var(--dg-b)"/>
  <path class="d-fill" d="M286 218 L300 225 L286 232 Z" fill="var(--dg-b)"/>
</svg>
</div>
<figcaption>Central sharing flows from the shell to all pilets; distributed sharing lets the first pilet to resolve a package supply it to the rest.</figcaption>
</figure>

Shared dependencies in Piral are **not limited to what the app shell declares**. Any pilet can declare shared packages via the `importmap` field in its `package.json`:

```json
{
  "name": "pilet-analytics",
  "version": "1.0.0",
  "importmap": {
    "imports": {
      "recharts": "",
      "date-fns": ""
    }
  }
}
```

When this pilet loads, `recharts` and `date-fns` are placed into side-bundles. If another pilet needs those packages — and they've already been resolved — it reuses the existing instances. No duplicate downloads, no central coordination required.

**Central importmap** (app shell's `package.json`): packages are pure externals, always provided by the shell, never bundled by any pilet.

**Pilet importmap**: creates side-bundles. First pilet to resolve a named package wins; all subsequent pilets reuse it.

:::tip
Use central sharing for universal packages like React and your design system; use a pilet-level `importmap` for domain libraries only some teams need. For the full mechanics — externals vs side-bundles, resolution order, and where each dependency belongs — see [Dependency sharing](/concepts/dependency-sharing).
:::

## Pilet lifecycle

<figure>
<div class="diagram-wrap plain">
<svg viewBox="0 0 760 132" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pilet lifecycle in five steps: feed metadata, fetch bundle, evaluate, call setup, registrations live.">
  <g>
    <rect class="d-stroke" x="14" y="34" width="124" height="64" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
    <circle class="d-fill" cx="34" cy="54" r="9" fill="var(--dg-brand-bg)"/>
    <text class="d-l d-tc" x="34" y="58" fill="var(--dg-brand)">1</text>
    <text class="d-s d-tc" x="76" y="80" fill="var(--dg-ink)">feed metadata</text>
  </g>
  <path class="d-dash" d="M142 66 H166" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M162 60 L174 66 L162 72 Z" fill="var(--dg-ink-soft)"/>
  <g>
    <rect class="d-stroke" x="178" y="34" width="124" height="64" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
    <circle class="d-fill" cx="198" cy="54" r="9" fill="var(--dg-brand-bg)"/>
    <text class="d-l d-tc" x="198" y="58" fill="var(--dg-brand)">2</text>
    <text class="d-s d-tc" x="240" y="80" fill="var(--dg-ink)">fetch bundle</text>
  </g>
  <path class="d-dash" d="M306 66 H330" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M326 60 L338 66 L326 72 Z" fill="var(--dg-ink-soft)"/>
  <g>
    <rect class="d-stroke" x="342" y="34" width="124" height="64" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
    <circle class="d-fill" cx="362" cy="54" r="9" fill="var(--dg-brand-bg)"/>
    <text class="d-l d-tc" x="362" y="58" fill="var(--dg-brand)">3</text>
    <text class="d-s d-tc" x="404" y="80" fill="var(--dg-ink)">evaluate</text>
  </g>
  <path class="d-dash" d="M470 66 H494" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M490 60 L502 66 L490 72 Z" fill="var(--dg-ink-soft)"/>
  <g>
    <rect class="d-stroke" x="506" y="34" width="124" height="64" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
    <circle class="d-fill" cx="526" cy="54" r="9" fill="var(--dg-brand-bg)"/>
    <text class="d-l d-tc" x="526" y="58" fill="var(--dg-brand)">4</text>
    <text class="d-m d-tc" x="568" y="80" fill="var(--dg-ink)">setup(api)</text>
  </g>
  <path class="d-dash" d="M634 66 H658" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M654 60 L666 66 L654 72 Z" fill="var(--dg-ink-soft)"/>
  <g>
    <rect class="d-stroke-2" x="670" y="34" width="76" height="64" rx="9" fill="var(--dg-ok-bg)" stroke="var(--dg-ok)"/>
    <circle class="d-fill" cx="690" cy="54" r="9" fill="var(--dg-frame)"/>
    <text class="d-l d-tc" x="690" y="58" fill="var(--dg-ok)">5</text>
    <text class="d-s d-tc" x="708" y="80" fill="var(--dg-ok)">live</text>
  </g>
</svg>
</div>
<figcaption>A pilet goes from feed metadata to live registrations in five steps.</figcaption>
</figure>

Registrations persist for the lifetime of the page session. If the pilet is removed at runtime — hot-reloaded, updated, or disabled via the feed — the shell unregisters everything it tracked and calls the pilet's optional [`teardown`](#the-teardown-function) for any custom cleanup. A full page reload clears everything and restarts from step 1.

## Building and publishing

```bash
npx pilet build      # build the bundle
npx pilet validate   # check format and metadata

# Publish to a feed service (interactive browser login — no secret to handle)
npx pilet publish --url https://feed.example.com/api/v1/pilets --interactive
```

Publishing POSTs the packed `.tgz` to the feed's publish endpoint. The feed stores the bundle on your CDN and records the new version. The next feed response includes it.

In automation (CI/CD) there's no browser, so authenticate with an API key from a secret instead: `npx pilet publish --url … --api-key $FEED_API_KEY`. See [Deploying to production](/guides/deployment).

## Non-React pilets

Official converters exist for Angular, Vue, Svelte, Solid, Preact, Blazor, and more. Set the converter up **inside the pilet** — import its standalone `/convert` submodule and wrap your component. No app-shell changes are required:

```tsx
import { fromVue3 } from 'piral-vue-3/convert';
import ProductPage from './ProductPage.vue';

export function setup(api: PiletApi) {
  api.registerPage('/products', fromVue3(ProductPage));
}
```

See [Multi-framework pilets](/guides/multi-framework) for the full setup (and the rare case for registering a converter centrally in the shell).

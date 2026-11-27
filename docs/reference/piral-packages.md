---
title: Piral packages
description: How piral, piral-core, and piral-base relate — and when (and how) to move from piral to piral-core.
---

# Piral packages

Piral ships as a small stack of layered packages. They share one runtime and one API; the difference is **how much opinion comes pre-wired**. Pick the outermost layer you need, and move inward as your app matures.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 226" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="piral wraps piral-core, which wraps piral-base. piral-base is the framework-agnostic loader, piral-core adds the React runtime, and piral adds the standard plugins.">
  <rect class="d-fill" x="0" y="0" width="760" height="226" rx="14" fill="var(--dg-canvas)"/>
  <rect class="d-stroke-2" x="32" y="24" width="696" height="178" rx="12" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h" x="50" y="46" fill="var(--dg-brand)">piral</text>
  <text class="d-s" x="92" y="46" fill="var(--dg-ink-soft)">— all-in-one: core + standard plugins, opinionated</text>
  <rect class="d-stroke" x="64" y="58" width="632" height="128" rx="10" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h" x="82" y="80" fill="var(--dg-a)">piral-core</text>
  <text class="d-s" x="150" y="80" fill="var(--dg-ink-soft)">— React runtime, extension slots, base Pilet API · you pick plugins</text>
  <rect class="d-stroke" x="96" y="92" width="568" height="78" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-h" x="114" y="124" fill="var(--dg-ink)">piral-base</text>
  <text class="d-s" x="186" y="124" fill="var(--dg-ink-soft)">— pilet loading &amp; lifecycle runtime, no UI framework</text>
  <text class="d-s" x="114" y="148" fill="var(--dg-ink-soft)">use directly only for a custom non-React runtime</text>
</svg>
</div>
<figcaption>Each layer wraps the previous one. Start with <code>piral</code>; graduate to <code>piral-core</code> for the long run.</figcaption>
</figure>

| Package | What it is | Reach for it when |
|---|---|---|
| `piral` | The opinionated, batteries-included framework package | Getting started, prototypes, small apps |
| `piral-core` | The lean React runtime; you choose the plugins | Mid- to long-term, production apps that want control |
| `piral-base` | The framework-agnostic pilet loader | Building a custom, non-React runtime |

## `piral` — the opinionated starting point

`piral` is the fastest way to a working app shell. It re-exports everything from `piral-core` and `piral-base` and bundles a curated set of standard plugins and sensible defaults, so the common capabilities are already wired up.

```tsx
import { createInstance } from 'piral';

const instance = createInstance({
  requestPilets: () => fetch(FEED_URL).then((r) => r.json()).then((r) => r.items),
});
```

Out of the box you get `createInstance`, the root rendering component, `ExtensionSlot`, the standard plugin components and APIs (menu, notifications, modals, dashboard, …), and the hooks (`useGlobalState`, `useAction`, `useExtensions`, `usePilet`). It's opinionated about *what's included* but leaves rendering and layout entirely to you. See [createInstance](/reference/configuration#createinstance) for the full options.

## `piral-core` — the choice for the long run

`piral-core` is the same runtime and the same API surface, but **unopinionated about which plugins are included**. You install and register exactly the capabilities you use — nothing more.

That explicitness is exactly what you want as an application matures:

- **Smaller, intentional footprint** — no plugins you don't use.
- **No surprises on upgrade** — behavior is whatever *you* registered, not whatever the meta-package decided to bundle.
- **Clear dependency graph** — each capability traces to a package you chose.

For these reasons, `piral-core` is the recommended target for mid- to long-term and production applications. `piral` is the great on-ramp; `piral-core` is where serious apps tend to settle.

## Migrating from `piral` to `piral-core`

The migration is mechanical and low-risk, because the runtime and API are identical — you're just making the implicit explicit.

**1. Swap the dependency.** Remove `piral`; add `piral-core` plus the plugin packages you actually use, and make sure React and React Router are direct dependencies.

```bash
npm uninstall piral
npm install piral-core piral-menu piral-notifications piral-modals \
  react react-dom react-router react-router-dom
```

**2. Update imports.** Pull the runtime from `piral-core`, and each plugin factory from its own package (with `piral` these came along for free).

```diff
- import { createInstance, createMenuApi, createNotificationsApi } from 'piral';
+ import { createInstance } from 'piral-core';
+ import { createMenuApi } from 'piral-menu';
+ import { createNotificationsApi } from 'piral-notifications';
```

**3. Register the plugins explicitly.** Anything `piral` set up for you now goes into the `plugins` array.

```tsx
const instance = createInstance({
  plugins: [createMenuApi(), createNotificationsApi(), createModalsApi()],
  requestPilets: () => fetch(FEED_URL).then((r) => r.json()).then((r) => r.items),
});
```

**4. Verify the Pilet API.** Every method your pilets call must come from a plugin you registered. If a pilet uses `api.showNotification` but you didn't add `piral-notifications`, add it. This audit is the point of the move: each capability becomes intentional.

The result behaves identically to your `piral` app — just leaner and fully under your control.

:::tip A pragmatic path
Start on `piral` to move fast and prove the idea. Plan to graduate to `piral-core` once the app and team mature and you want a tighter, explicit footprint. Because the API is the same, the switch is a dependency-and-imports change, not a rewrite.
:::

## `piral-base` — the low-level loader

`piral-base` is the foundation both other packages build on: it fetches, evaluates, and manages the lifecycle of pilets, with **no dependency on React or any UI framework**. You'd use it directly only when building a completely custom, non-React runtime. For anything React-based, you'll be on `piral-core` (or `piral`), which already include it.

## Converter packages

Framework **converters** (`piral-vue`, `piral-svelte`, `piral-ng`, …) are a special case worth calling out. They're published as plugin packages, but a converter should **not** be installed as a plugin in the app shell — that would make every pilet depend on the shell having the right converter.

Instead, each converter also ships a **standalone `convert` submodule** that a pilet imports and uses directly:

```tsx
import { fromSvelte } from 'piral-svelte/convert';

api.registerPage('/profile', fromSvelte(ProfilePage));
```

Used this way, the converter carries its own logic inside the pilet and emits a plain HTML component the core already knows how to render — so the shell stays framework-agnostic and the pilet stays portable. Reach for the `/convert` submodule in pilets and avoid the plugin form for converters. See [Creating a converter](/reference/creating-a-converter) and [Multi-framework pilets](/guides/multi-framework).

## Shared API surface

Whichever layer you choose, the building blocks are the same — these all come from `piral` and `piral-core` alike:

```ts
import {
  createInstance,        // create the runtime
  ExtensionSlot,         // render registered extensions
  useGlobalState,        // read global state
  useAction,             // dispatch a state action
  useSharedData,         // read the shared data store
  usePiletApi,           // the root pilet API (shell-only)
} from 'piral-core';

import type {
  PiletApi,              // the typed pilet API
  PiralPlugin,           // plugin factory type
  PiletMetadata,         // feed response item
  LayoutProps,           // Layout component props
  ComponentsState,       // replaceable shell components
  ErrorComponentsState,  // error page components
} from 'piral-core';
```

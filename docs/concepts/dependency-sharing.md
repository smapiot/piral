---
title: Dependency sharing
description: How importmaps work in Piral — central sharing from the app shell versus distributed sharing between pilets.
---

# Dependency sharing

If every pilet bundled its own copy of React, your users would download React many times over — and worse, you'd have several *different* React instances on the page, which breaks hooks, context, and anything that relies on a singleton. Dependency sharing solves this. The mechanism is the **importmap**, and the key thing to understand is that it works in two different places, with two different meanings.

## What an importmap is

An importmap is a field in a `package.json` that lists packages which should be **shared** rather than bundled:

```json
{
  "name": "my-app-shell",
  "importmap": {
    "imports": {
      "react": "",
      "react-dom": "",
      "react-router-dom": "",
      "my-design-system": ""
    }
  }
}
```

The value is a version specifier. An **empty string means "use the version installed in this project"** — the most common case, because it keeps the shared version in lockstep with your normal dependency management. You can also pin a range (`"recharts": "^2.10.0"`), or point a name at an explicit URL when you host a prebuilt shared bundle yourself.

At build time, Piral reads the importmap and treats those packages specially instead of inlining them into the output bundle.

## Two importmaps, two behaviors

The same field behaves differently depending on whether it lives in the **app shell** or in a **pilet**.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="How a shared dependency resolves: declared in the app shell it is a pure external; declared in a pilet it becomes a side-bundle that the first pilet provides and later pilets reuse.">
  <rect class="d-fill" x="0" y="0" width="760" height="250" rx="14" fill="var(--dg-canvas)"/>
  <text class="d-t" x="30" y="34" fill="var(--dg-ink)">Where is the dependency declared?</text>

  <rect class="d-stroke-2" x="30" y="52" width="330" height="50" rx="9" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-l" x="46" y="73" fill="var(--dg-brand)">App shell importmap</text>
  <text class="d-s" x="46" y="91" fill="var(--dg-ink-soft)">central · e.g. react, design system</text>
  <path class="d-dash" d="M360 77 H416" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M412 70 L426 77 L412 84 Z" fill="var(--dg-ink-soft)"/>
  <rect class="d-stroke" x="426" y="52" width="304" height="50" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s" x="442" y="73" fill="var(--dg-ink)">Pure external — provided by the shell,</text>
  <text class="d-s" x="442" y="91" fill="var(--dg-ink-soft)">never bundled by any pilet, one instance</text>

  <rect class="d-stroke-2" x="30" y="116" width="330" height="50" rx="9" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-l" x="46" y="137" fill="var(--dg-a)">Pilet importmap · first to resolve</text>
  <text class="d-s" x="46" y="155" fill="var(--dg-ink-soft)">e.g. recharts in pilet A</text>
  <path class="d-dash" d="M360 141 H416" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M412 134 L426 141 L412 148 Z" fill="var(--dg-ink-soft)"/>
  <rect class="d-stroke" x="426" y="116" width="304" height="50" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s" x="442" y="137" fill="var(--dg-ink)">Loaded as a side-bundle and published</text>
  <text class="d-s" x="442" y="155" fill="var(--dg-ink-soft)">to the shared registry for later pilets</text>

  <rect class="d-stroke-2" x="30" y="180" width="330" height="50" rx="9" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-l" x="46" y="201" fill="var(--dg-b)">Pilet importmap · already resolved</text>
  <text class="d-s" x="46" y="219" fill="var(--dg-ink-soft)">e.g. recharts in pilet B</text>
  <path class="d-dash" d="M360 205 H416" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M412 198 L426 205 L412 212 Z" fill="var(--dg-ink-soft)"/>
  <rect class="d-stroke" x="426" y="180" width="304" height="50" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s" x="442" y="201" fill="var(--dg-ink)">Reuses the existing instance —</text>
  <text class="d-s" x="442" y="219" fill="var(--dg-ink-soft)">no second download, no duplication</text>
</svg>
</div>
<figcaption>The same importmap field means "external" in the shell and "shared side-bundle" in a pilet.</figcaption>
</figure>

### Central sharing — the app shell importmap

Packages in the **app shell's** importmap become **pure externals**. The shell loads them once and provides the running instance to every pilet. Pilets compile against them but never include them in their bundle.

Use this for things that *must* be a single instance or that *everyone* needs:

- **Singletons** — React and React DOM. Two React copies on one page is a bug, not an optimization.
- **The framework contract** — React Router, so all pilets navigate through the same router.
- **Your design system** — one shared component library, one consistent UI.

Because the shell owns these, it also owns their version. Bump React in the shell and every pilet gets the new version on the next shell release — pilets don't each declare a React version.

### Distributed sharing — the pilet importmap

Packages in a **pilet's** importmap become **side-bundles**. The first pilet that needs a given package loads it and registers it in a shared runtime registry; any later pilet that declares the same name reuses that instance instead of downloading its own.

Use this for **domain libraries that only some teams need** — a charting library, a date utility, an i18n package. The team that introduces the dependency owns the declaration; no coordination with the shell team is required.

```json
{
  "name": "pilet-analytics",
  "importmap": {
    "imports": {
      "recharts": "",
      "date-fns": ""
    }
  }
}
```

## How resolution works at runtime

When a pilet's code imports a shared name, Piral resolves it in this order:

1. **Is it a central external?** If the app shell declared it, the pilet uses the shell's instance. Done.
2. **Is it already in the shared registry?** If an earlier pilet side-bundled it, the pilet reuses that instance.
3. **Otherwise**, the pilet loads its own side-bundle and registers it so later pilets can reuse it.

"First to resolve wins" means load order matters for *which* build of a side-bundled package is used. For libraries where multiple versions can safely coexist, that's fine. For anything that must be a singleton, promote it to the **central** importmap so there's exactly one source of truth.

## Choosing where a dependency belongs

| Put it in… | When | Examples |
|---|---|---|
| **App shell importmap** (external) | Everyone needs it, or it must be a singleton | `react`, `react-dom`, `react-router-dom`, design system |
| **Pilet importmap** (side-bundle) | Only some pilets need it; versions can vary | `recharts`, `date-fns`, `i18next`, a domain SDK |
| **Bundled (no importmap)** | Small, pilet-private, no benefit to sharing | one-off helpers, tiny utilities |

:::warning Keep singletons central
Anything that breaks with multiple instances — React, state libraries, a global event bus — belongs in the **app shell** importmap. Side-bundles allow multiple versions to coexist, which is exactly what you don't want for a singleton.
:::

See [App shell](/concepts/app-shell#centrally-shared-dependencies) for the shell side and [Pilets](/concepts/pilets#sharing-dependencies) for the pilet side.

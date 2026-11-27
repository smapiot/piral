---
title: Server-side rendering
description: Where SSR stands in Piral today, what works now, and the islands-based direction coming in Piral v2.
---

# Server-side rendering

Server-side rendering is an area of active development for Piral. The honest summary up front: **first-class SSR is being addressed in Piral v2**. Today you can already get good results with a static shell plus client hydration, and the modular foundation Piral gives you is exactly what makes a richer SSR story tractable.

## Why Piral is well-positioned for SSR

A Piral application is already a composition of independent modules. That maps almost one-to-one onto the **islands architecture**: each pilet is a self-contained island that can be rendered on the server and hydrated independently on the client, without forcing the whole page through a single monolithic render.

That modular foundation is the hard part — and Piral already has it. Layering SSR on top is then about *where* and *when* each island renders, rather than re-architecting the app. This is why building on Piral pays off even before the full SSR story lands: the structure you adopt now is the structure SSR wants.

## What works today: static shell + client hydration

The pragmatic approach available right now is to pre-render the app shell's skeleton as static HTML and let pilets load and hydrate on the client as usual.

```html
<body>
  <div id="app">
    <header class="app-header">
      <a href="/">My Portal</a>
      <nav id="shell-nav"><!-- pilets fill this --></nav>
    </header>
    <main id="shell-main">
      <div class="loading-placeholder">Loading…</div>
    </main>
  </div>
  <script src="/app-shell.js" defer></script>
</body>
```

This gives you a fast, meaningful first paint (header, navigation, layout) with no server-side rendering infrastructure for the pilets themselves. The trade-off is that pilet content isn't in the initial HTML, so it's not ideal for SEO on pilet-rendered pages. For many internal tools and authenticated apps, that's a perfectly good place to stand.

## The direction: islands SSR in Piral v2

The cohesive, first-class SSR story is landing in **Piral v2**, built around the islands model described above — server-rendering pilets and hydrating them independently.

You can already see the direction in an early prototype: the [Netflix islands demo](https://github.com/piral-samples/netflix-islands-demo) is a Netflix-style portal whose pilets use the islands architecture (built on `piral-server`). It's an older, experimental sample rather than a supported API, but it shows where Piral is heading and what islands-based SSR looks like in practice.

:::tip
Adopt Piral now for the modularity, dynamism, and team independence it gives you today. The investment carries forward: when first-class SSR arrives in v2, it builds on the same modular foundation rather than asking you to restructure.
:::

## Things to keep in mind

Regardless of the approach, a few constraints apply to any SSR setup:

- Pilets that touch browser-only APIs (`window`, `document`) need guards like `if (typeof window !== 'undefined')` so they can run (or no-op) on the server.
- Highly dynamic, per-user feeds make full-page output hard to cache — an argument for island-level rendering and hydration rather than monolithic SSR.
- Non-React pilets (via converters) depend on their framework's own SSR support.

If SEO on pilet-rendered content is a hard requirement today, start with the static shell approach and follow Piral v2 for the first-class path.

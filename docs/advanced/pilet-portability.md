---
title: Pilet portability
description: Why a pilet isn't bound to one app shell — and what it actually depends on.
---

# Pilet portability

When you scaffold a pilet with `--source my-app-shell`, it's easy to assume the pilet is *bound* to that shell. It isn't. That reference exists so the pilet can compile against the shell's TypeScript types and run inside its emulator during development. At **runtime**, a pilet is far more portable: any app shell that satisfies the pilet's assumptions can host it — including a *newer version* of the same shell, or an *entirely different* shell the pilet was never "developed for."

## What a pilet actually depends on

A pilet doesn't depend on a specific shell build. It depends on a set of **capabilities** being present at runtime:

1. **The Pilet API surface it calls.** If a pilet uses `api.registerPage` and `api.showNotification`, the host shell must provide those — meaning it must have the corresponding plugins installed (here, `piral-notifications`).
2. **The centrally shared dependencies it treats as externals.** A pilet that compiles `react` and `react-router-dom` as externals expects the host to provide them at runtime.
3. **Any cross-pilet contracts it relies on.** Extension slot names it fills, shared-data keys it reads, events it listens for.

If a host shell provides all of these, the pilet runs. If it's missing one — say, no notifications plugin — the pilet will fail where it tries to use the absent capability. That's the entire contract.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 286" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="One pilet with a set of assumptions runs on any app shell that satisfies them — the original shell, a newer version, or a different portal — but not on a shell missing a required capability.">
  <rect class="d-fill" x="0" y="0" width="760" height="286" rx="14" fill="var(--dg-canvas)"/>

  <rect class="d-stroke-2" x="28" y="86" width="214" height="116" rx="10" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h" x="46" y="110" fill="var(--dg-a)">pilet-profile</text>
  <text class="d-s" x="46" y="132" fill="var(--dg-ink-soft)">assumes the host provides:</text>
  <text class="d-m" x="46" y="152" fill="var(--dg-ink)">react · react-router</text>
  <text class="d-m" x="46" y="170" fill="var(--dg-ink)">registerPage()</text>
  <text class="d-m" x="46" y="188" fill="var(--dg-ink)">showNotification()</text>

  <path class="d-dash" d="M242 120 H300 V58 H352" stroke="var(--dg-ok)"/>
  <path class="d-fill" d="M348 51 L362 58 L348 65 Z" fill="var(--dg-ok)"/>
  <path class="d-dash" d="M242 144 H352" stroke="var(--dg-ok)"/>
  <path class="d-fill" d="M348 137 L362 144 L348 151 Z" fill="var(--dg-ok)"/>
  <path class="d-dash" d="M242 168 H300 V230 H352" stroke="var(--dg-ok)"/>
  <path class="d-fill" d="M348 223 L362 230 L348 237 Z" fill="var(--dg-ok)"/>

  <rect class="d-stroke" x="362" y="34" width="330" height="48" rx="9" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-l" x="378" y="54" fill="var(--dg-brand)">Shell A v1 — built against ✓</text>
  <text class="d-s" x="378" y="72" fill="var(--dg-ink-soft)">provides react, router, notifications</text>

  <rect class="d-stroke" x="362" y="120" width="330" height="48" rx="9" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-l" x="378" y="140" fill="var(--dg-brand)">Shell A v2 — newer version ✓</text>
  <text class="d-s" x="378" y="158" fill="var(--dg-ink-soft)">same capabilities, no pilet rebuild</text>

  <rect class="d-stroke" x="362" y="206" width="330" height="48" rx="9" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-l" x="378" y="226" fill="var(--dg-brand)">Shell B — a different portal ✓</text>
  <text class="d-s" x="378" y="244" fill="var(--dg-ink-soft)">also provides the assumed capabilities</text>
</svg>
</div>
<figcaption>The same pilet binary runs on any shell that satisfies its assumptions — not just the one it was scaffolded against.</figcaption>
</figure>

## Why this matters

**You can upgrade the shell without rebuilding pilets.** As long as a new shell version keeps providing the API methods and shared dependencies existing pilets use, those pilets keep working untouched. This is how a single shell can host dozens of independently maintained pilets across many versions — old API methods remain present; new ones simply become available to pilets that upgrade their emulator. (See [Emulator → version coordination](/concepts/emulator#version-coordination).)

**You can reuse a pilet across shells.** A "profile" or "notifications" pilet can run in several different portals, as long as each portal's shell offers the capabilities the pilet relies on. The pilet is authored once and dropped into each shell's feed.

**The dev-time link is just a default, not a lock.** The `piral.name` field and the emulator dev dependency tell the tooling which shell to type-check and debug against. They don't restrict where the built pilet can run.

## Keeping pilets portable

- **Depend on the API, not the implementation.** Use the typed Pilet API and shared externals; avoid reaching into shell internals or `window` globals.
- **Treat the API as a versioned contract.** Additive changes keep old pilets working; removing or changing a method is a breaking change for every pilet that uses it.
- **Document the capabilities a shell must provide** — which plugins, which centrally shared packages, which extension slot names — so a pilet can be matched to any compatible shell with confidence.

:::tip The flip side
Portability cuts both ways: if a pilet quietly assumes a plugin or shared package that a target shell doesn't provide, it will break there. Make assumptions explicit (and ideally type-checked against the target emulator) rather than implicit.
:::

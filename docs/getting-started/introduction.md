---
title: What is Piral?
description: A direct, honest introduction to Piral — what it solves, how it works, and when to use it.
---

# What is Piral?

You have a frontend. It works. But as it grows, the same friction keeps appearing: every release touches everything, teams block each other, upgrading a shared library breaks things in five places you didn't expect.

Piral is the framework that makes micro frontends practical rather than just theoretically appealing.

## The core idea

Piral lets you compose a web application at runtime from independently deployed modules — called **pilets** — coordinated by a thin host called the **app shell**.

```
Your users see one application.
Your teams ship independently.
```

## Three parts, one application

Every Piral application has the same structure:

**The app shell** — A small, stable host application. It provides layout, authentication, navigation, and the runtime that loads pilets. The app shell rarely changes. It is the stage.

**Pilets** — Self-contained feature modules. Each is an npm-like package, developed and deployed independently by a single team. A pilet registers its pages, menu items, and UI contributions into the app shell at runtime via the Pilet API.

**The feed service** — A small HTTP endpoint the app shell calls on startup: *"which pilets should I load right now, for this user?"* The feed makes runtime composition dynamic — roll out, roll back, or target pilets per user without touching the app shell.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The feed service lists which pilets exist, pilets provide domain functionality, and the app shell wires them into one application.">
  <rect class="d-fill" x="0" y="0" width="760" height="300" rx="14" fill="var(--dg-canvas)"/>
  <rect class="d-stroke" x="28" y="96" width="176" height="64" rx="9" fill="var(--dg-ok-bg)" stroke="var(--dg-ok)"/>
  <text class="d-h d-tc" x="116" y="124" fill="var(--dg-ok)">Feed service</text>
  <text class="d-s d-tc" x="116" y="143" fill="var(--dg-ink-soft)">which pilets exist</text>
  <rect class="d-stroke-2" x="292" y="84" width="184" height="92" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="384" y="124" fill="var(--dg-brand)">App shell</text>
  <text class="d-s d-tc" x="384" y="144" fill="var(--dg-ink-soft)">wires everything together</text>
  <text class="d-s d-tc" x="648" y="44" fill="var(--dg-ink-soft)">Pilets — domain functionality</text>
  <rect class="d-stroke" x="564" y="52" width="168" height="46" rx="8" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-l d-tc" x="648" y="80" fill="var(--dg-a)">Pilet A</text>
  <rect class="d-stroke" x="564" y="112" width="168" height="46" rx="8" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-l d-tc" x="648" y="140" fill="var(--dg-b)">Pilet B</text>
  <rect class="d-stroke" x="564" y="172" width="168" height="46" rx="8" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-l d-tc" x="648" y="200" fill="var(--dg-c)">Pilet C</text>
  <path class="d-dash" d="M204 128 H286" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M283 122 L292 128 L283 134 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="245" y="120" fill="var(--dg-ink-soft)">lists pilets</text>
  <path class="d-dash" d="M564 75 H484" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M487 69 L477 75 L487 81 Z" fill="var(--dg-ink-soft)"/>
  <path class="d-dash" d="M564 135 H482" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M485 129 L475 135 L485 141 Z" fill="var(--dg-ink-soft)"/>
  <path class="d-dash" d="M564 195 H484" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M487 189 L477 195 L487 201 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="525" y="128" fill="var(--dg-ink-soft)">register</text>
  <path class="d-dash" d="M384 176 V222" stroke="var(--dg-brand)"/>
  <path class="d-fill" d="M378 219 L384 228 L390 219 Z" fill="var(--dg-brand)"/>
  <rect class="d-stroke" x="232" y="228" width="304" height="48" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-h d-tc" x="384" y="250" fill="var(--dg-ink)">One application</text>
  <text class="d-s d-tc" x="384" y="268" fill="var(--dg-ink-soft)">one coherent experience for the user</text>
</svg>
</div>
<figcaption>The feed service says which pilets exist, pilets bring the domain functionality, and the app shell wires them into one application.</figcaption>
</figure>

## What makes Piral distinct

At its core, what sets Piral apart is **loose coupling**. Approaches that wire micro frontends together by importing directly from one another couple them tightly — if a remote disappears or renames an export, its consumers break. Piral instead routes everything through a central engine, so pilets never depend on each other: they only assume the shell is present and interact *indirectly*, through extension slots and events. The features below all exist to make that loose coupling practical.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 312" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Importing directly between micro frontends couples them and breaks when a remote is missing or an export is renamed; Piral routes everything through a central engine so pilets depend only on the shell.">
  <rect class="d-fill" x="0" y="0" width="760" height="312" rx="14" fill="var(--dg-canvas)"/>
  <text class="d-h d-tc" x="190" y="28" fill="var(--dg-ink)">Direct imports</text>
  <text class="d-s d-tc" x="190" y="46" fill="var(--dg-ink-soft)">tight coupling</text>
  <text class="d-h d-tc" x="572" y="28" fill="var(--dg-brand)">Piral — loose coupling</text>
  <path class="d-thin" d="M380 18 V296" stroke="var(--dg-line)"/>
  <rect class="d-stroke" x="66" y="70" width="104" height="48" rx="8" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-l d-tc" x="118" y="99" fill="var(--dg-a)">MFE A</text>
  <rect class="d-stroke" x="210" y="70" width="104" height="48" rx="8" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-l d-tc" x="262" y="99" fill="var(--dg-b)">MFE B</text>
  <rect class="d-stroke" x="138" y="182" width="104" height="48" rx="8" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-l d-tc" x="190" y="211" fill="var(--dg-c)">MFE C</text>
  <path class="d-stroke" d="M170 94 H210" stroke="var(--dg-b)"/>
  <path class="d-fill" d="M207 88 L216 94 L207 100 Z" fill="var(--dg-b)"/>
  <path class="d-fill" d="M173 88 L164 94 L173 100 Z" fill="var(--dg-b)"/>
  <path class="d-stroke" d="M128 118 L172 182" stroke="var(--dg-b)"/>
  <path class="d-fill" d="M165 178 L176 188 L173 174 Z" fill="var(--dg-b)"/>
  <path class="d-stroke" d="M252 118 L208 182" stroke="var(--dg-b)"/>
  <path class="d-fill" d="M211 174 L204 188 L215 178 Z" fill="var(--dg-b)"/>
  <text class="d-s d-tc" x="190" y="262" fill="var(--dg-ink-soft)">a remote vanishes or an export</text>
  <text class="d-s d-tc" x="190" y="278" fill="var(--dg-ink-soft)">is renamed → consumers break</text>
  <rect class="d-stroke-2" x="500" y="132" width="144" height="56" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="572" y="156" fill="var(--dg-brand)">App shell</text>
  <text class="d-s d-tc" x="572" y="175" fill="var(--dg-ink-soft)">central engine</text>
  <rect class="d-stroke" x="522" y="54" width="100" height="44" rx="8" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-l d-tc" x="572" y="81" fill="var(--dg-a)">Pilet</text>
  <rect class="d-stroke" x="410" y="214" width="104" height="44" rx="8" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-l d-tc" x="462" y="241" fill="var(--dg-b)">Pilet</text>
  <rect class="d-stroke" x="630" y="214" width="104" height="44" rx="8" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-l d-tc" x="682" y="241" fill="var(--dg-c)">Pilet</text>
  <path class="d-dash" d="M572 98 V132" stroke="var(--dg-brand)"/>
  <path class="d-dash" d="M500 170 L490 214" stroke="var(--dg-brand)"/>
  <path class="d-dash" d="M644 170 L654 214" stroke="var(--dg-brand)"/>
  <text class="d-s d-tc" x="572" y="296" fill="var(--dg-ink-soft)">pilets depend only on the shell · talk via slots &amp; events</text>
</svg>
</div>
<figcaption>Direct imports couple micro frontends — a missing remote or renamed export breaks consumers. Piral routes everything through a central engine, so pilets depend only on the shell and communicate indirectly.</figcaption>
</figure>

**The Pilet API** — A versioned, TypeScript-typed contract between the app shell and every pilet. Pilets register capabilities through a well-defined interface. This makes pilets portable, safe, and introspectable.

**The emulator** — When you build your app shell, the CLI produces an npm package (the emulator) that pilet developers install locally. Running `pilet debug` renders the pilet inside the real shell, with hot reload, without any platform access. This is the single biggest developer experience improvement over other micro frontend approaches.

**Distributed dependency sharing** — Dependencies are not locked to the app shell. Any pilet can declare shared packages via its own `importmap` in `package.json`. If another pilet has already loaded that package, subsequent pilets reuse the same instance — no duplication, no central coordination required between teams.

**Extension slots** — Pilets contribute UI into each other's pages without coupling. A product pilet registers for a slot the cart pilet declares. Neither knows about the other. The shell's registry connects them.

## When to use Piral

Team scaling is the best-known reason to reach for Piral, but it isn't the only one. Piral makes sense whenever an application benefits from being **composed at runtime from independent modules**:

- **Multiple teams** need to ship features independently, on different release cadences.
- The application is **inherently dynamic** — it's assembled from pieces that vary per user or tenant, come and go behind feature flags, or roll out and back without redeploying the host.
- You want **strong architectural guidelines** to enforce a highly modular system with clear, contract-based boundaries — valuable even for a single team that prizes modularity.
- You're **migrating a monolith** incrementally and want to extract features one at a time.

:::warning A word of caution
Piral adds operational overhead: a feed service to run, pilet packages to publish, more deployment pipelines. If you have a single small application with no need for runtime composition or hard module boundaries, a well-structured monorepo SPA may be the simpler choice. Adopt Piral when modularity, dynamism, or team independence is a genuine goal — not by default.
:::

## Technology stack

- React for the app shell and pilet runtime (pilets themselves can use other frameworks)
- `piral-cli` for debugging, building, and publishing — installed per-project, not globally (scaffold with `npm init piral-instance` / `npm init pilet`)
- MIT licensed, fully open source
- Actively developed and maintained by the community and [smapiot](https://smapiot.com)

## Where to go next

New here? Start with [Why micro frontends?](/getting-started/why-micro-frontends) to understand the problem space, then come back and follow the [Quick start](/getting-started/quick-start).

Already convinced? Jump straight to [Quick start](/getting-started/quick-start).

Want to understand the architecture first? Go to [Architecture overview](/concepts/architecture).

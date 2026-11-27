---
title: Why Piral?
description: What Piral adds to micro frontends that you'd otherwise have to build yourself.
---

# Why Piral?

Module Federation, Native Federation, single-spa, raw import maps, fully custom solutions — there are many ways to implement micro frontends. This page explains what Piral provides that you'd otherwise spend weeks building, and where other approaches might fit better.

## The gap most approaches leave

Module Federation, Native Federation, and single-spa give you the mechanics of loading code across bundle boundaries. What they don't solve out of the box:

- How do you *discover* which modules to load at runtime?
- How do pilet components *register themselves* into the host application?
- How do modules contribute UI *into each other's pages* without coupling?
- How do developers work on a module without running the entire platform?
- What's the CLI workflow for scaffolding, building, and publishing?

These are all problems you'd assemble yourself. Piral has documented, tested opinions on all of them.

## Dynamic feed: the runtime composition layer

The app shell calls a feed endpoint on startup and gets back a JSON list of pilets to load — which modules, which versions, from which CDN URLs. This is dynamic at runtime. It means:

- Change what a user sees **without redeploying the app shell**
- Roll out a pilet to 10% of users for a canary test
- Disable a misbehaving pilet for a specific tenant
- Restore the previous version in seconds — no CI pipeline, no `git revert`

Compare this to the static remote manifests of Module Federation or Native Federation: those support versioned deploys but don't natively support per-user targeting, gradual rollouts, or instant rollback. (Piral can still *use* either as its transport — see [Module & Native Federation](/advanced/module-federation).)

## The emulator: the most underrated DX feature

Here's the common scenario: you're developing a checkout pilet. To test it realistically, you need it running inside the actual app shell — with real layout, real navigation, real shared dependencies — alongside other pilets.

The naive solution is running the full platform locally. That often means spinning up the app shell, a feed service, and multiple other pilets. Infeasible for most developers, especially contractors or new joiners.

Piral's answer: when the app shell builds, it produces an npm package containing a debug build of the shell itself. A pilet developer installs this package and runs `pilet debug`. They see their pilet running inside the real shell, with hot reload, without any platform access. The emulator is a first-class build artifact.

## Distributed importmap sharing — not just the app shell

This is frequently misunderstood. Shared dependencies in Piral are **not limited to what the app shell declares**.

The app shell's `importmap` establishes centrally shared packages — React, React Router, your design system. Pilets treat these as externals and never bundle them.

But any pilet can *also* declare shared packages in its own `importmap`:

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

When this pilet loads, it places those packages into side-bundles. If another pilet needs the same package and it's already been resolved by any other pilet, it reuses the existing instance. No duplicate downloads, no central coordination. Teams independently share what they independently need.

## The Pilet API: a versioned contract

Every pilet receives a typed API object from the shell. That object is the formal, versioned interface between the app shell and the pilet world. It contains everything a pilet can legitimately do: register pages, register menu items, emit events, show notifications, open modals.

This formalization matters because:

- It versions cleanly — bump the shell version when the API changes
- It's TypeScript-typed — autocomplete shows only what's actually available
- It's extensible — app shell authors add capabilities via plugins, which appear as first-class typed API

## Extension slots: first-class UI composition

One of Piral's genuine differentiators. A pilet can declare a named slot; other pilets fill it with components. Neither team imports or knows about the other. The shell's extension registry connects them at runtime.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An extension slot asks the Piral engine, which looks up the components registered for that name and renders them with the slot's params; the consumer never references the provider.">
  <rect class="d-fill" x="0" y="0" width="760" height="300" rx="14" fill="var(--dg-canvas)"/>
  <rect class="d-stroke" x="28" y="66" width="212" height="168" rx="10" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h d-tc" x="134" y="90" fill="var(--dg-a)">Consumer pilet</text>
  <rect class="d-dash" x="46" y="106" width="176" height="76" rx="7" stroke="var(--dg-a)"/>
  <text class="d-m d-tc" x="134" y="132" fill="var(--dg-a)">&lt;ExtensionSlot</text>
  <text class="d-m d-tc" x="134" y="150" fill="var(--dg-a)">name="tile"</text>
  <text class="d-m d-tc" x="134" y="168" fill="var(--dg-a)">params={…} /&gt;</text>
  <text class="d-s d-tc" x="134" y="212" fill="var(--dg-ink-soft)">never references the provider</text>
  <rect class="d-stroke-2" x="300" y="84" width="160" height="124" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="380" y="108" fill="var(--dg-brand)">App shell</text>
  <text class="d-s d-tc" x="380" y="126" fill="var(--dg-ink-soft)">Piral engine</text>
  <rect class="d-fill" x="316" y="140" width="128" height="50" rx="6" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="380" y="159" fill="var(--dg-ink-soft)">extension registry</text>
  <text class="d-m d-tc" x="380" y="178" fill="var(--dg-brand)">tile → Widget</text>
  <rect class="d-stroke" x="520" y="66" width="212" height="168" rx="10" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-h d-tc" x="626" y="90" fill="var(--dg-c)">Provider pilet</text>
  <rect class="d-fill" x="538" y="116" width="176" height="52" rx="7" fill="var(--dg-frame)"/>
  <text class="d-m d-tc" x="626" y="139" fill="var(--dg-c)">registerExtension</text>
  <text class="d-m d-tc" x="626" y="157" fill="var(--dg-c)">('tile', Widget)</text>
  <text class="d-s d-tc" x="626" y="200" fill="var(--dg-ink-soft)">never imports the consumer</text>
  <path class="d-dash" d="M240 122 H296" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M293 116 L302 122 L293 128 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="268" y="113" fill="var(--dg-ink-soft)">look up</text>
  <path class="d-dash" d="M300 172 H244" stroke="var(--dg-brand)"/>
  <path class="d-fill" d="M247 166 L238 172 L247 178 Z" fill="var(--dg-brand)"/>
  <text class="d-s d-tc" x="270" y="190" fill="var(--dg-ink-soft)">render(params)</text>
  <path class="d-dash" d="M520 146 H464" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M467 140 L458 146 L467 152 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="492" y="137" fill="var(--dg-ink-soft)">register</text>
</svg>
</div>
<figcaption>An extension slot never reaches the provider directly: it asks the Piral engine, which looks up the components registered for that name and renders them with the slot's <code>params</code>.</figcaption>
</figure>

Crucially, this is **declarative UI composition**, not messaging. Every slot resolves through the engine — so the consumer and provider stay fully decoupled, yet the result is a normal component. You *could* try to wire cross-pilet UI with events instead, but events map poorly onto the component lifecycle: there's no natural mount/unmount, props don't flow in cleanly, and a prop or state change won't re-render the right thing on its own. An extension slot mounts, renders with `params`, re-renders when they change, and unmounts — exactly what UIs need. Events stay great for *notifications*; extension slots are the right tool for *rendering*.

Module Federation and single-spa don't provide this out of the box. You'd implement it yourself, with all the version coordination that implies.

## Where other approaches win

:::tip Module Federation might be better if:
- You're extending an existing setup where it's already configured (Webpack, Rspack, or Next.js — Module Federation 2.0 is no longer Webpack-only)
- You need first-class SSR *today* (its SSR story is currently more mature — though Piral's lands in v2; see [Server-side rendering](/advanced/ssr))
- Your team prefers lower-level control over the loading mechanism

:::

:::tip Native Federation might be better if:
- You want a standards-based transport (native ES modules + import maps) with no bundler lock-in and a minimal runtime
- You're in the Angular ecosystem where it's the common choice
- You only need to wire together a small, fixed set of apps without runtime discovery or targeting

:::

:::tip single-spa might be better if:
- You want framework-agnostic coordination with no React in the host layer
- You're integrating legacy applications that can't be reasonably wrapped as pilets

:::

These aren't strictly either/or: Piral can sit on top of Module Federation or Native Federation, using them as the transport while adding discovery, targeting, the emulator, and extension slots. For most greenfield micro frontend projects, that combination ships a working system faster than assembling the pieces by hand.

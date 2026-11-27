---
title: Module & Native Federation
description: How Piral relates to Module Federation and Native Federation — and how to use them together.
---

# Module & Native Federation

When people compare Piral to "federation," they usually mean one of two things: **Module Federation** or **Native Federation**. Both solve the *loading* layer of a micro frontend — getting code from one independently built app into another at runtime. Piral solves that layer too, but wraps a whole framework around it. This page draws the lines clearly and shows how they combine.

## What they all share

All three let you:

- Deploy UI modules independently of the host.
- Share dependencies (React, etc.) at runtime instead of bundling them everywhere.
- Load code dynamically, without one monolithic bundle.

The difference is how much of the system each one gives you out of the box.

## The three approaches

**Module Federation** is a code-sharing mechanism baked into a bundler. One build exposes modules; another consumes them at runtime. It originated in Webpack 5, and with **Module Federation 2.0** it's no longer Webpack-only — it runs on Rspack and has a bundler-independent runtime, with community plugins for Vite and others. What it still doesn't define for you: how to *discover* which remotes to load, how modules *register* themselves into the host, local developer experience, or the end-to-end CLI workflow.

**Native Federation** takes the same idea but builds it on web standards — native ES modules and [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) — instead of bundler internals. It's bundler-agnostic and framework-agnostic (it grew up in the Angular ecosystem but isn't tied to it), which makes it lightweight and future-proof. Like Module Federation, it's a transport layer: discovery, registration, and tooling are still yours to assemble.

**Piral** is a complete micro frontend *framework*. It includes the discovery layer (the feed service), a typed registration contract (the Pilet API), local development tooling (the emulator and CLI), and runtime UI composition (extension slots). Crucially, Piral is **not a competitor to the transports** — it can load pilets, Module Federation remotes, *and* Native Federation remotes, so the federation choice becomes an implementation detail underneath Piral.

```
Module Federation / Native Federation  →  the "how" (transport)
Piral                                  →  the "how" + "what" + "when" + tooling
```

## Feature comparison

| Capability | Module Federation | Native Federation | Piral |
|---|---|---|---|
| Transport for remote modules | ✅ bundler runtime | ✅ import maps + ESM | ✅ (+ can reuse the other two) |
| Bundler independence | ✅ since MF 2.0 | ✅ by design | ✅ (pick any bundler plugin) |
| Standards-based (no runtime lib) | ❌ | ✅ | ⚠️ uses a small runtime |
| Dynamic runtime discovery | ❌ DIY | ❌ DIY | ✅ feed service |
| Typed registration contract | ❌ | ❌ | ✅ Pilet API |
| Developer emulator | ❌ | ❌ | ✅ built-in |
| Extension / slot composition | ❌ | ❌ | ✅ built-in |
| Per-user / per-tenant targeting | ❌ | ❌ | ✅ via feed |
| Instant rollback without redeploy | ❌ | ❌ | ✅ via feed |
| End-to-end CLI workflow | ⚠️ partial | ⚠️ partial | ✅ full |

## When a transport alone is enough

Reach for Module Federation or Native Federation **without** Piral when:

- You only need to share code between a small, fixed set of apps you already control.
- You don't need runtime discovery, per-user targeting, or instant rollback.
- You want the absolute minimum runtime — in which case **Native Federation** is the most standards-aligned choice, and **Module Federation** is the natural fit if you're already invested in its ecosystem (e.g. Rspack or Next.js).

## When to choose Piral

- You want discovery, targeting, and rollback handled for you rather than built by hand.
- A stable, typed registration contract between host and modules matters.
- Developer experience — the emulator, CLI, and extension slots — is a priority.
- You have many independently deployed modules and multiple teams.

## Using them together

These are composable, not mutually exclusive. Piral can treat a Module Federation or Native Federation remote as a pilet: the feed describes the remote (a pilet with `spec: "mf"`, or a native-federation remote entry) and Piral loads it like any other pilet — while you keep the feed, emulator, typed API, and extension slots on top.

In other words, you don't have to pick "Piral *or* federation." You pick a federation transport for *how* code is delivered, and Piral for *everything around it*.

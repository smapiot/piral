---
title: Why micro frontends?
description: The real problem micro frontends solve — and when simpler alternatives win.
---

# Why micro frontends?

Before choosing any architecture, you should be honest about what problem you actually have. Micro frontends are best known for solving **frontend development at team scale** — but that's not their only use. They also shine when an application is **inherently dynamic** (composed from pieces at runtime) or when you want **architecture-enforced modularity**. Team scale is the most common driver, so we start there, then come back to the others.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 286" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A monolith routes every team through one shared codebase and one release pipeline; with micro frontends each team owns and ships its own pilet independently.">
  <rect class="d-fill" x="0" y="0" width="760" height="286" rx="14" fill="var(--dg-canvas)"/>
  <text class="d-h d-tc" x="180" y="30" fill="var(--dg-ink)">Monolith</text>
  <text class="d-h d-tc" x="568" y="30" fill="var(--dg-brand)">Micro frontends</text>
  <rect class="d-stroke" x="36" y="46" width="288" height="206" rx="10" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s d-tc" x="180" y="66" fill="var(--dg-ink-soft)">one shared codebase</text>
  <rect class="d-fill" x="56" y="74" width="248" height="26" rx="5" fill="var(--dg-a-bg)"/>
  <text class="d-l d-tc" x="180" y="92" fill="var(--dg-a)">Team A</text>
  <rect class="d-fill" x="56" y="106" width="248" height="26" rx="5" fill="var(--dg-b-bg)"/>
  <text class="d-l d-tc" x="180" y="124" fill="var(--dg-b)">Team B</text>
  <rect class="d-fill" x="56" y="138" width="248" height="26" rx="5" fill="var(--dg-c-bg)"/>
  <text class="d-l d-tc" x="180" y="156" fill="var(--dg-c)">Team C</text>
  <rect class="d-stroke-2" x="56" y="188" width="248" height="48" rx="7" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-l d-tc" x="180" y="208" fill="var(--dg-brand)">one release pipeline</text>
  <text class="d-s d-tc" x="180" y="225" fill="var(--dg-ink-soft)">every change is coordinated</text>
  <path class="d-thin" d="M380 40 V252" stroke="var(--dg-line)"/>
  <rect class="d-stroke" x="412" y="46" width="312" height="26" rx="6" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-l d-tc" x="568" y="64" fill="var(--dg-brand)">App shell</text>
  <rect class="d-stroke" x="412" y="86" width="98" height="86" rx="8" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-l d-tc" x="461" y="124" fill="var(--dg-a)">Team A</text>
  <text class="d-s d-tc" x="461" y="142" fill="var(--dg-ink-soft)">pilet</text>
  <rect class="d-stroke" x="519" y="86" width="98" height="86" rx="8" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-l d-tc" x="568" y="124" fill="var(--dg-b)">Team B</text>
  <text class="d-s d-tc" x="568" y="142" fill="var(--dg-ink-soft)">pilet</text>
  <rect class="d-stroke" x="626" y="86" width="98" height="86" rx="8" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-l d-tc" x="675" y="124" fill="var(--dg-c)">Team C</text>
  <text class="d-s d-tc" x="675" y="142" fill="var(--dg-ink-soft)">pilet</text>
  <text class="d-s d-tc" x="568" y="200" fill="var(--dg-ink-soft)">each ships independently ↓</text>
  <rect class="d-stroke-2" x="412" y="212" width="312" height="34" rx="7" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s d-tc" x="568" y="233" fill="var(--dg-ink-soft)">independent release pipelines</text>
</svg>
</div>
<figcaption>A monolith routes every team through one shared codebase and release; with micro frontends each team owns and ships its slice independently.</figcaption>
</figure>

## The root cause

A frontend monolith breaks down not because of the technology, but because of coordination. When three teams share one codebase, each deploy becomes a negotiation. The payments team's hotfix waits because the catalog team has an unfinished branch on main. Tests fail in the auth module because of changes in the product module that nobody told you about. A styling change from one team resets CSS variables used by another.

This is Conway's Law: your system's architecture mirrors your organization's communication structure. A monolith built by one team is fine. A monolith built by eight teams is a coordination bottleneck disguised as a technical problem.

Micro frontends move the architecture boundary to match the organizational boundary. Each team owns their vertical slice end-to-end — from API calls to rendered pixels — and deploys it independently.

## What actually changes with micro frontends

**Deploys decouple.** The payments team can push a fix at 2pm on a Friday without a deployment window or a conversation with the catalog team. Their work ships when it's ready.

**Failures isolate.** An uncaught error in the recommendations module doesn't bring down the checkout flow. Error boundaries around each pilet contain the blast radius.

**Technology choices are local.** One team can upgrade their React version. Another can experiment with Svelte. Neither affects the other's release.

**Bundles are smaller per user.** A user who never opens the admin dashboard never downloads that code.

**Onboarding accelerates.** New team members work in a smaller, scoped codebase instead of navigating a 200,000-line monolith.

## What doesn't change

Users still see one application. URLs still work. Navigation still works. The visual design still needs deliberate maintenance — that's what your design system is for, regardless of architecture.

And you can't eliminate coordination entirely. You still need agreement on:

- The Pilet API shape (what capabilities the shell exposes)
- Extension slot names and their parameter shapes
- How auth tokens are accessed by pilets
- How to handle cross-pilet navigation

The difference is these are *interface contracts*, not *shared code commitments*. Once agreed, they change rarely. Day-to-day work proceeds without inter-team friction.

## Beyond team scale

Two other situations justify micro frontends even without many teams:

**Dynamic, composed applications.** Some products *are* a composition: a portal whose modules differ per customer, a platform where third parties or other departments plug in features, an app that turns capabilities on and off at runtime. Here the runtime-composition model isn't overhead — it's the core requirement. You need to add, remove, and target modules without redeploying the host, which is exactly what a feed-driven micro frontend gives you.

**Architecture-enforced modularity.** Even a single team can choose micro frontends to make module boundaries *physical* rather than merely conventional. When each feature is an independently built, contract-bound module, "don't reach into another module's internals" stops being a code-review guideline and becomes something the architecture enforces. For long-lived systems where maintainability and clear seams matter, that discipline can be worth the overhead on its own.

## When simpler alternatives win

:::warning Be honest about team size
The added infrastructure — a feed service, published pilet packages, separate CI pipelines — has real cost. Don't pay that cost unless you have the specific problem it solves.
:::

**A shared component library** solves the design consistency problem. If your main frustration is "our button looks different across pages," a design system fixes that without any runtime complexity.

**A monorepo with strict module boundaries** solves the code organization problem. Tools like Turborepo or Nx give you independent build caches, isolated package boundaries, and clean dependency graphs — while keeping a single deploy. The right answer for many mid-sized teams.

**A well-structured single SPA** is viable for teams up to approximately 8–10 engineers. Don't over-engineer until you feel the specific pain that over-engineering fixes.

## The honest summary

Micro frontends are the right answer when you have multiple teams who need to ship independently and have genuinely felt the coordination cost in production. They're the wrong answer when you're adopting them preemptively, when you have one team, or when your real challenge is code quality rather than release independence.

If micro frontends are right for you, the next question is which approach. Read [Why Piral?](/getting-started/why-piral) to see how Piral addresses the common pain points.

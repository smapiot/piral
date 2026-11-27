---
title: Using LLMs with Piral
description: How to get great results from AI assistants when building Piral apps — and how to make your own Piral app LLM-friendly.
---

# Using LLMs with Piral

AI coding assistants — Copilot, Cursor, Claude, and friends — pair unusually well with Piral. A micro frontend is already split into small, self-contained units, so a pilet is a bite-sized, low-blast-radius task a model can reason about from end to end. This guide covers how to get good results, and how to make your own Piral app easy for assistants to work with.

## Why Piral fits LLM-assisted development

- **Small units.** A pilet is one feature behind one `setup(api)` function — small enough to hold in context and reason about completely.
- **A typed contract.** The Pilet API is fully typed. Point the model at the type and it knows exactly which registrations and methods exist, instead of guessing.
- **Isolation.** A wrong suggestion inside one pilet can't break the app shell or another pilet, so it's safe to let a model iterate.
- **Explicit boundaries.** Shared dependencies (importmaps) and extension slot names are written down — concrete facts a model can respect rather than infer.

## Give the model the right context

Context is the single biggest quality lever. Before asking for code, make sure the assistant has:

1. **The docs index.** Point your tool at this site's machine-readable `/llms.txt` — a curated map of every page so the model can pull the right reference on demand.
2. **The `PiletApi` type.** Paste (or reference) the `PiletApi` type from your app shell package — the emulator ships these definitions. This is the highest-value piece of context: it tells the model precisely which methods exist, so it won't invent `api.showNotification` when you haven't installed `piral-notifications`.
3. **The target shell and shared dependencies.** Name the app shell package and list the centrally shared externals (from the shell's importmap), so generated code treats `react` and friends as provided rather than bundling them.
4. **Slot names and config.** The extension slot names and their `params`, plus any feed `config` keys the pilet should read.

A short preamble like this, pasted into the chat or kept in a rules file, dramatically improves output:

```text
We build on Piral (React micro frontends).
Target app shell: my-app-shell  (import types via: import type { PiletApi } from 'my-app-shell').
Installed plugins (only these API methods exist): piral-menu, piral-notifications.
Shared externals (never bundle): react, react-dom, react-router-dom.
Extension slots: cart-extra (params: { cartTotal: number }).
Scaffold with `npm init pilet`; never install piral-cli globally.
```

## Common tasks

Each of these is a natural, well-scoped request for an assistant. The notes call out where models trained on older material tend to slip.

**Scaffold a pilet.** Ask for the current initializer, not the legacy command:

```bash
npm init pilet@latest -- --source my-app-shell --target my-pilet --bundler webpack5
```

If the model suggests `pilet new` or a global `npm i -g piral-cli`, that's stale — correct it (see [CLI reference](/reference/cli)).

**Register a page and a menu item.** A pilet exports exactly one `setup` function:

```tsx
import type { PiletApi } from 'my-app-shell';

export function setup(api: PiletApi) {
  api.registerPage('/orders', OrdersPage);
  api.registerMenu(() => <a href="/orders">Orders</a>);
}
```

**Fill an extension slot.** Remind the model that pilets never import each other — they connect through named slots (see [Extension slots](/concepts/extension-slots)).

**Share a library.** Ask it to add the package to the pilet's `importmap` rather than bundling it (see [Dependency sharing](/concepts/dependency-sharing)).

**Write tests.** "Write Vitest tests for this pilet's `setup` using a mock `PiletApi`" works well, because the registration logic is plain and framework-independent (see [Testing pilets](/guides/testing)).

**Migrate `piral` to `piral-core`.** Point the model at the [Piral packages](/reference/piral-packages) guide — the change is mechanical (swap the dependency, move plugin imports, register plugins explicitly).

## Guardrails to give the model

Models often carry outdated Piral habits from their training data. Stating these rules up front prevents the most common mistakes:

- Scaffold with `npm init piral-instance` / `npm init pilet`; run the CLI via `npx` or npm scripts. Never `npm i -g piral-cli`, never `piral new` / `pilet new`.
- A pilet's only required entry is an exported `setup(api)` function.
- Only call Pilet API methods provided by installed plugins; import `PiletApi` from the shell package for accurate, type-checked autocomplete.
- Treat `react`, `react-dom`, the router, and other shared libraries as externals via the importmap — don't bundle them or import a different version.
- Pilets never import one another: compose UI through extension slots, and share data through events, the shared data store, or a shared library.
- Registrations are cleaned up automatically on unload and hot reload; only call `unregister*` for genuinely dynamic cases.

## A drop-in rules file

Most assistants read a project-level instructions file — `AGENTS.md`, `.cursorrules`, or `.github/copilot-instructions.md`. Dropping one into your repo makes every tool follow your conventions automatically. Use this as a starting point and fill in your shell name, plugins, externals, and slots:

```text
# Piral project rules (for AI assistants)

This repository uses Piral (React micro frontends).

Contract:
- App shell package: my-app-shell. Types: import type { PiletApi } from 'my-app-shell'.
- Installed Pilet API plugins (only these methods exist): piral-menu, piral-notifications, piral-modals.
- Shared externals (never bundle, never import a different version): react, react-dom, react-router-dom.
- Extension slots: cart-extra (params: { cartTotal: number }).

Conventions:
- Scaffold with: npm init pilet@latest -- --source my-app-shell
- Never install piral-cli globally; never use `pilet new` or `piral new`.
- Run the CLI via npm scripts or npx (npx pilet debug | build | publish).
- A pilet's entry is a single exported setup(api: PiletApi) function.
- Only call Pilet API methods provided by the plugins listed above. Do not invent methods.
- Share libraries via the importmap in package.json; the externals above come from the shell.
- Pilets must not import each other. Compose UI via extension slots; share data via events or the shared data store.
- Prefer piral-core for long-lived apps (same API as piral).
- Write tests with Vitest by unit-testing setup() with a mock PiletApi.

Docs: see /llms.txt for a machine-readable map of the framework documentation.
```

## Make your app shell LLM-friendly

If you maintain the app shell, a little effort makes every pilet team's assistant far more accurate:

- **Ship accurate types.** The emulator already exports `PiletApi`; keep it in sync with the plugins you actually install so the model's view matches reality.
- **Document the contract.** List installed plugins, centrally shared dependencies, extension slot names and `params`, and feed `config` keys in one discoverable place.
- **Provide a template rules file.** Include a pre-filled `AGENTS.md` (like the one above) in your pilet scaffolding template so new pilets start LLM-ready.
- **Expose an `llms.txt`.** If you host your own developer portal or docs, add an `llms.txt` index — this site ships one at `/llms.txt` — so assistants can navigate it.

:::tip
The properties that make Piral good for teams make it good for assistants too: small, typed, isolated units with explicit contracts. The clearer your contracts, the better both humans and models perform.
:::

## Ready-made LLM assets

This documentation ships three assets you can point tools at or copy into your project:

- `/llms.txt` — a curated, linked index of every page (the [llms.txt](https://llmstxt.org) convention).
- `/llms-full.txt` — the entire documentation concatenated as plain text, regenerated on every build; ideal for pasting into a model's context or ingesting wholesale.
- `/AGENTS.md` — a ready-to-edit version of the rules file above. Download it, fill in your shell name, plugins, externals, and slots, then drop it into your repo as `AGENTS.md` (or `.cursorrules` / `.github/copilot-instructions.md`).

If you maintain a custom pilet scaffolding template, include a pre-filled `AGENTS.md` so every new pilet starts LLM-ready — a custom template is the natural place to ship conventions like this.

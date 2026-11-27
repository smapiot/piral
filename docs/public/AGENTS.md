# Piral project rules (for AI assistants)

> Drop this file into the root of a pilet or app-shell repository so AI coding
> assistants (Cursor, Copilot, Claude, etc.) follow Piral conventions. Most tools
> read AGENTS.md, .cursorrules, or .github/copilot-instructions.md — copy or
> symlink as needed. Fill in the bracketed values for your application.

This repository uses Piral (React micro frontends).

## Contract (edit these)

- App shell package: `[my-app-shell]`. Import types via: `import type { PiletApi } from '[my-app-shell]'`.
- Installed Pilet API plugins — ONLY these methods exist: `[piral-menu, piral-notifications, piral-modals]`.
- Centrally shared externals — never bundle, never import a different version: `[react, react-dom, react-router-dom]`.
- Extension slots: `[cart-extra (params: { cartTotal: number })]`.

## Conventions

- Scaffold with `npm init piral-instance@latest` (app shell) or `npm init pilet@latest -- --source [my-app-shell]` (pilet).
- Never install `piral-cli` globally; never use `pilet new` or `piral new`. Run the CLI via npm scripts or `npx` (`npx pilet debug | build | publish`).
- A pilet's only entry is a single exported `setup(api: PiletApi)` function. Register pages, menus, and extensions there.
- Only call Pilet API methods provided by the plugins listed above. Do not invent methods.
- Share libraries via the `importmap` in `package.json`; treat the externals above as provided by the shell.
- Pilets must not import each other. Compose UI via extension slots; share data via events or the shared data store.
- Registrations are cleaned up automatically on unload/hot-reload; only call `unregister*` for genuinely dynamic cases.
- Prefer `piral-core` for long-lived apps (same API as `piral`, but you register plugins explicitly).
- Write tests with Vitest by unit-testing `setup()` with a mock `PiletApi`.

## Docs

- Curated index: /llms.txt
- Full documentation (plain text): /llms-full.txt

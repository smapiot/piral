---
title: Monorepo setup
description: Organising an app shell and multiple pilets in one repository.
---

# Monorepo setup

Pilets are built and deployed independently — but during development it's often convenient to keep the app shell and several pilets in one repository. You get shared tooling, atomic cross-cutting refactors, and instant local linking with no publish step. A workspace manager (pnpm, Yarn, or npm workspaces) plus a task runner is all it takes, and it changes nothing about how the pieces *deploy*: each pilet still ships on its own.

## Structure

```
my-portal/
├── packages/
│   ├── app-shell/
│   ├── pilet-checkout/
│   ├── pilet-catalog/
│   └── pilet-account/
├── package.json       ← workspace root
└── pnpm-workspace.yaml
```

## pnpm workspaces

`pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
```

Root `package.json`:

```json
{
  "name": "my-portal-monorepo",
  "private": true,
  "scripts": {
    "dev:shell": "pnpm --filter app-shell dev",
    "build:all": "pnpm -r build",
    "test:all": "pnpm -r test"
  }
}
```

## Pilet references the local app shell

A pilet always targets a shell by name. In a monorepo that target resolves to the **sibling package** instead of a published one, so a pilet develops against the shell in the same repo:

In `packages/pilet-checkout/package.json`:

```json
{
  "name": "pilet-checkout",
  "devDependencies": {
    "app-shell": "workspace:*"
  },
  "piral": { "name": "app-shell" }
}
```

`workspace:*` tells pnpm to use the local version — no npm publish needed during development.

## Turborepo (recommended for large repos)

As the repository grows, a task runner like Turborepo pays off: it caches build outputs and runs tasks only for packages that actually changed — a real time-saver once you have a dozen pilets and a shell to build and test:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["build"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

:::tip
On Turborepo 1.x this top-level key was called `pipeline`; it was renamed to `tasks` in Turborepo 2.0.
:::

```bash
turbo build                    # build everything in order
turbo build --filter=[HEAD^1]  # only changed packages
```

## CI: only build what changed

```yaml
- name: Build affected
  run: turbo build --filter=[HEAD^1]

- name: Test affected
  run: turbo test --filter=[HEAD^1]
```

---
title: CLI reference
description: Scaffolding initializers and every piral / pilet command, the way they're run today.
---

# CLI reference

Piral's tooling lives in the `piral-cli` package. You **don't install it globally**. Instead:

- **Scaffolding** is done with npm initializers (`npm init piral-instance`, `npm init pilet`), which download a throwaway scaffolder on demand.
- The initializers add `piral-cli` (plus a bundler plugin) as a **local dev dependency** of the generated project.
- You then run commands through the generated **npm scripts** (`npm start`, `npm run build`) or directly with **`npx`** (`npx pilet build`).

This keeps each project pinned to its own CLI and bundler versions, with nothing to maintain on your machine globally.

## Scaffolding

### `npm init piral-instance`

Create a new app shell.

```bash
npm init piral-instance@latest -- --target my-portal --bundler webpack5
```

| Option | Default | Description |
|---|---|---|
| `--target` | `.` | Output directory |
| `--bundler` | `webpack5` | `webpack5`, `esbuild`, `rspack`, `vite`, `parcel2` |
| `--npm-client` | `npm` | `npm`, `yarn`, `pnpm` |
| `--no-install` | — | Skip dependency installation |
| `--defaults` | — | Accept all defaults non-interactively |

### `npm init pilet`

Create a new pilet for a given app shell.

```bash
npm init pilet@latest -- --source my-portal --target my-feature-pilet --bundler webpack5
```

| Option | Default | Description |
|---|---|---|
| `--source` | — | App shell package name, or a path to its emulator `.tgz` |
| `--target` | `.` | Output directory |
| `--bundler` | `webpack5` | Bundler plugin to use |
| `--npm-client` | `npm` | `npm`, `yarn`, `pnpm` |

Everything after the `--` is forwarded to the initializer — don't drop it.

## App shell commands

Run these from inside a shell project, via the generated scripts or `npx`.

### `piral debug`

Start the app shell dev server (this is what `npm start` runs).

```bash
npx piral debug
```

| Option | Default | Description |
|---|---|---|
| `--port` | `1234` | Dev server port |
| `--open` | `false` | Open the browser on start |
| `--log-level` | `info` | `error`, `warn`, `info`, `verbose` |

### `piral build`

Build the app shell for production (this is what `npm run build` runs).

```bash
npx piral build
```

| Option | Default | Description |
|---|---|---|
| `--type` | `all` | `all`, `release`, `emulator` |
| `--target` | `./dist` | Output directory |
| `--minify` | `true` | Minify the release output |

The default `all` produces both `dist/release/` (deploy this) and `dist/emulator/` (publish this for pilet developers).

### `piral publish`

Publish the emulator package so pilet teams can install it.

```bash
npx piral publish --type emulator
```

This is equivalent to `npm publish dist/emulator/<shell>-<version>.tgz`. Use `--registry` to target a private registry.

## Pilet commands

Run these from inside a pilet project.

### `pilet debug`

Start the pilet dev server inside the emulated shell (this is what `npm start` runs). The target shell is read from your `package.json`.

```bash
npx pilet debug
npx pilet debug --feed https://feed.example.com/api/v1/pilets   # load extra pilets too
```

### `pilet build`

Build the pilet bundle.

```bash
npx pilet build
```

| Option | Default | Description |
|---|---|---|
| `--target` | `./dist` | Output directory |
| `--minify` | `true` | Minify the bundle |
| `--schema` | `v2` | Pilet spec: `v0`, `v1`, `v2`, `mf` |

### `pilet publish`

Build (if needed) and publish to a feed service. Choose how you authenticate:

```bash
# Locally / with a browser — log in interactively, no secret to handle
npx pilet publish --url https://feed.example.com/api/v1/pilets --interactive

# CI/CD / automation — use an API key from a secret
npx pilet publish --url https://feed.example.com/api/v1/pilets --api-key $FEED_API_KEY
```

| Option | Description |
|---|---|
| `--url` | Feed service publish endpoint (required) |
| `--interactive` | Log in via the browser instead of passing a key — preferred when you have a browser, since no secret is entered in the terminal |
| `--api-key` | API key for the feed — use this for CI/CD and other automation |
| `--from` | `pilet` (build first) or `file` (use an existing `.tgz`) |

:::tip Which auth flow?
Use `--interactive` for day-to-day publishing from a developer machine — you don't need to create or store a secret. Use `--api-key` (from a CI secret) for pipelines and any non-interactive automation.
:::

### `pilet upgrade`

Upgrade the emulator dev dependency to a newer shell version.

```bash
npx pilet upgrade          # latest
npx pilet upgrade 2.0.0    # pin to a version
```

### `pilet validate`

Check the pilet's format and metadata before publishing.

```bash
npx pilet validate
```

:::tip Add commands to your scripts
Generated projects already wire `npm start` and `npm run build` to the right CLI calls. Add the rest (`"publish": "pilet publish"`, `"validate": "pilet validate"`) to `package.json` so your team and CI use one consistent entry point.
:::

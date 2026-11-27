---
title: Quick start
description: Build and run your first Piral app — an app shell and a pilet — in about ten minutes.
---

# Quick start

By the end of this guide you'll have two projects running side by side: an **app shell** (the host) and a **pilet** (a feature module) rendering inside it with hot reload. That pairing is the whole micro frontend pattern in miniature.

## Prerequisites

You need Node.js 22 or newer. Everything else is fetched on demand by npm — there is **no global CLI to install**.

```bash
node --version   # v22 or higher
npm --version    # v10 or higher
```

:::tip No global `piral-cli`
Older guides told you to run `npm install -g piral-cli`. That's no longer recommended. The scaffolders below add `piral-cli` as a local dev dependency, and you run it through your project's npm scripts (`npm start`, `npm run build`) or with `npx`. This keeps every project pinned to its own CLI version.
:::

## 1. Create the app shell

Scaffold a new shell with an npm initializer. The `--bundler` flag picks (and installs) a bundler plugin — `webpack5` is a safe default; `esbuild`, `rspack`, `vite`, and `parcel2` are also available.

```bash
npm init piral-instance@latest -- --target my-app-shell --bundler webpack5
cd my-app-shell
```

Start the development server:

```bash
npm start
```

Open [http://localhost:1234](http://localhost:1234). The shell is running — intentionally empty, because no pilets are loaded yet.

When you're ready to share the shell with pilet developers, build it:

```bash
npm run build
# dist/release/  → the static site you deploy to production
# dist/emulator/ → an npm package pilet developers install to develop locally
```

That second output, the **emulator**, is what makes local pilet development possible without running the whole platform. More on that shortly.

## 2. Create your first pilet

Open a second terminal and keep the shell running. Scaffold a pilet that targets the shell you just built. During development, point `--source` at the freshly built emulator tarball so you don't need a published package yet:

```bash
cd ..
npm init pilet@latest -- \
  --source ./my-app-shell/dist/emulator/my-app-shell-1.0.0.tgz \
  --target my-first-pilet \
  --bundler webpack5
cd my-first-pilet
```

Once the shell is published to a registry, pilets can instead use `--source my-app-shell` to pull the emulator by package name. That registry doesn't have to be public npm — a private/company or local registry works too, and you can skip registries entirely by debugging against an [emulator website](/concepts/emulator#distributing-the-emulator).

Open `src/index.tsx` and register a page:

```tsx
import type { PiletApi } from 'my-app-shell';

export function setup(api: PiletApi) {
  api.registerPage('/hello', () => (
    <div style={{ padding: '2rem' }}>
      <h1>Hello from my pilet!</h1>
      <p>This page was registered at runtime — the shell never knew about it in advance.</p>
    </div>
  ));
}
```

Start the pilet's dev server:

```bash
npm start
```

Visit [http://localhost:1234/hello](http://localhost:1234/hello). Your pilet's page renders inside the real app shell, with hot reload active.

## 3. Add navigation

A page nobody can reach isn't much use. Register a menu item too:

```tsx
import type { PiletApi } from 'my-app-shell';

export function setup(api: PiletApi) {
  api.registerPage('/hello', HelloPage);
  api.registerMenu(() => <a href="/hello">Hello</a>);
}

const HelloPage = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Hello from my pilet!</h1>
    <p>Changed without touching the app shell.</p>
  </div>
);
```

Save the file — the nav link appears immediately, no restart required.

## What just happened

You now have two completely independent projects:

The **app shell** owns layout, authentication, navigation chrome, and the runtime. It has no knowledge of your pilet. The **pilet** registered itself at runtime through the Pilet API. It has no knowledge of how the shell renders it.

These can be deployed independently, owned by different teams, and versioned separately. That separation — one stable host, many independently shipped features — is the entire point of Piral.

:::tip Develop against live pilets too
You can load pilets from a real feed alongside your local one, which is handy for testing cross-pilet interactions:

```bash
npm start -- --feed https://feed.piral.cloud/api/v1/pilets/YOUR_FEED
```
:::

## Next steps

Now that the pieces are moving, a little theory goes a long way:

- See how everything fits together in the [Architecture overview](/concepts/architecture).
- Learn the [project structure](/getting-started/project-structure) conventions for shells and pilets.
- Build a production-grade shell in [Building your app shell](/guides/building-app-shell).

---
title: Multi-framework pilets
description: Write pilets in Angular, Vue, Svelte, Solid and more — using converters from their standalone /convert submodule, with in-pilet setup as the default.
---

# Multi-framework pilets

Piral's converter system lets a pilet be written in a framework other than React. The app shell stays React; a converter wraps the foreign component so it renders transparently inside the shell.

There are two ways to wire this up. **Set the converter up inside the pilet** (the default, covered first), or — only in special cases — register it centrally in the app shell (the [last section](#setting-up-the-converter-in-the-app-shell-advanced)).

## Available converters

| Framework | Package |
|---|---|
| Angular | `piral-ng` |
| Vue 3 | `piral-vue-3` |
| Vue 2 | `piral-vue` |
| Svelte | `piral-svelte` |
| Solid | `piral-solid` |
| Preact | `piral-preact` |
| Blazor | `piral-blazor` ([Piral.Blazor](https://blazor.piral.io)) |

Each one follows the same shape: a `from<Framework>` helper exported from a standalone **`/convert`** submodule, used inside the pilet.

## Use the converter in the pilet (recommended)

Import the converter from its **`/convert` submodule** and wrap your component. Crucially, the import is from the `/convert` submodule — **not** the package root (the package root exports the *plugin*, which belongs in the app shell). Nothing needs to be installed or registered in the app shell: the converter lives in the pilet and produces a plain HTML component the shell already knows how to render.

```bash
npm install --save-dev piral-svelte
```

```tsx
import type { PiletApi } from 'my-app-shell';
import { fromSvelte } from 'piral-svelte/convert'; // ← the /convert submodule, not 'piral-svelte'
import ProductPage from './ProductPage.svelte';

export function setup(api: PiletApi) {
  api.registerPage('/products', fromSvelte(ProductPage));
}
```

```svelte
<!-- ProductPage.svelte -->
<script lang="ts">
  let products: Array<{ id: string; name: string }> = [];
  fetch('/api/products').then((r) => r.json()).then((p) => (products = p));
</script>

<h1>Products</h1>
<ul>{#each products as p (p.id)}<li>{p.name}</li>{/each}</ul>
```

Every converter works this way — e.g. `fromVue3` from `piral-vue-3/convert`. Always import from `<package>/convert` in a pilet; check each converter's README for its exact `from…` name.

**Why this is the default.** Yes, each pilet that uses the framework bundles its own copy of the converter (and shares the framework via the importmap — see below), which is a little overhead. In return you get **reliability and flexibility**: the pilet is self-contained, owns its framework version, and can never be broken by a change in the app shell.

## Bundler support for framework files

Frameworks with their own file types (`.svelte`, `.vue`, …) need the bundler to understand them. Converters ship a bundler helper for exactly this — for example, wire `piral-svelte/extend-webpack` into your pilet's webpack config so `*.svelte` files compile. Check each converter's README for the precise setup for your bundler.

## Sharing framework bundles between pilets

Each pilet carrying its own converter doesn't mean shipping the whole framework many times. Declare the framework in your `importmap` so multiple pilets share one instance:

```json
{
  "importmap": {
    "imports": {
      "@angular/core": "",
      "@angular/common": "",
      "vue": ""
    }
  }
}
```

See [Dependency sharing](/concepts/dependency-sharing) for how this resolves.

## Setting up the converter in the app shell (advanced)

A converter can also be registered centrally, as a **plugin** in the app shell. This is the exception, not the rule — it only makes sense under specific conditions, such as a tightly governed portal where the shell team deliberately owns one framework version for everyone. This is the one case where you import from the package root (the plugin) rather than `/convert`.

```bash
npm install piral-svelte
```

```tsx
import { createSvelteApi } from 'piral-svelte'; // package root = the plugin

const instance = createInstance({
  plugins: [createSvelteApi()],
});
```

With the plugin registered, pilets use `fromSvelte` from the package root (`piral-svelte`), relying on the shell's converter rather than carrying their own.

:::warning Central converters couple framework updates
When the converter and its framework live in the shell, every pilet using that framework is tied to the shell's version. The day the shell upgrades the framework, all of those pilets must be compatible with the new version at once — coordinated, lockstep updates, which is exactly what micro frontends try to avoid. The in-pilet `/convert` approach trades a little bundle overhead for each pilet owning its framework version independently — far more reliable and flexible. Prefer it unless you have a clear, deliberate reason not to. See [Creating a converter](/reference/creating-a-converter).
:::

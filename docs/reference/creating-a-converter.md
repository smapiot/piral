---
title: Creating a converter
description: How framework converters work in Piral, how to build one (using piral-svelte as a blueprint), and why a converter should be used standalone in pilets rather than installed as a shell plugin.
---

# Creating a converter

A **converter** lets a pilet render components written in a framework other than React — Vue, Svelte, Angular, Solid, and so on — inside the React-based app shell. This is an advanced, exotic topic: most teams just *use* the official converters ([Multi-framework pilets](/guides/multi-framework)). This page explains how they work and how to build your own, using [`piral-svelte`](https://github.com/smapiot/piral/tree/main/src/converters/piral-svelte) as the blueprint.

## The core idea: a foreign component lifecycle

Every converter does the same job: it turns a foreign component into a **`ForeignComponent`** — a tiny object with three lifecycle hooks the Piral engine calls as the component enters, updates, and leaves the DOM:

```ts
import type { ForeignComponent, BaseComponentProps } from 'piral-core';

function createConverter() {
  return <TProps extends BaseComponentProps>(
    Component: any,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => ({
    // called once, when the component is placed into the DOM
    mount(el, props, ctx, locals) {
      locals.instance = renderMyFramework(Component, el, { ...captured, ...ctx, ...props });
    },
    // called whenever the props change
    update(el, props, ctx, locals) {
      locals.instance.setProps({ ...props });
    },
    // called once, when the component is removed
    unmount(el, locals) {
      locals.instance.destroy();
      el.innerHTML = '';
    },
  });
}
```

`el` is the host DOM node, `props` are the React props passed in, `ctx` is contextual data, and `locals` is a per-instance scratch object you use to keep a handle on the mounted instance. This mount → update → unmount shape is exactly how Svelte's converter works — compare `createConverter` in [`piral-svelte`'s `converter.ts`](https://github.com/smapiot/piral/blob/main/src/converters/piral-svelte/src/converter.ts).

## Two forms — and which to use

A converter package is classically published with two faces. Understanding the difference is the whole point of this page.

### Standalone converter (recommended)

The recommended form is a **standalone** converter the pilet imports and uses directly. It wraps the foreign component into a plain **`html`** component — a type the `piral-core` runtime already knows how to render — so it needs *nothing* registered in the shell.

Following `piral-svelte`, this lives in a top-level `convert.ts` that's published as a **`/convert` submodule**:

```ts
// convert.ts  →  published as "my-converter/convert"
import { createConverter } from './lib/converter';

const convert = createConverter();

export function fromMyFramework(Component: any, captured?: Record<string, any>) {
  return { type: 'html', component: convert(Component, captured) };
}
```

A pilet then uses it without the shell knowing anything about the framework:

```tsx
import type { PiletApi } from 'my-app-shell';
import { fromMyFramework } from 'my-converter/convert';
import Page from './Page.mf';

export function setup(api: PiletApi) {
  api.registerPage('/page', fromMyFramework(Page));
}
```

### Plugin form (avoid for converters)

The other face is a classic **plugin** that registers a named converter on the shell's engine and exposes a `from…` helper that returns a descriptor tagged with that name:

```ts
import type { PiralPlugin } from 'piral-core';

export function createMyFrameworkApi(): PiralPlugin<MyFrameworkApi> {
  return (context) => {
    const convert = createConverter();
    // registers a converter named "mf" on the engine
    context.converters.mf = ({ Component, captured }) => convert(Component, captured);

    return {
      fromMyFramework: (Component: any, captured?: Record<string, any>) => ({
        type: 'mf', // resolved later by the engine's "mf" converter
        Component,
        captured,
      }),
    };
  };
}
```

This is how `createSvelteApi` works. It's a perfectly valid plugin — but for *converters* it's the form to avoid.

:::warning Don't install converters as shell plugins
A converter registered as a plugin lives in the **app shell**, which means every pilet that uses that framework now depends on the shell having the right converter plugin installed (and at a compatible version). That re-introduces exactly the coupling Piral works to avoid.

Prefer the **standalone `/convert` submodule** instead: the pilet carries its own conversion logic, emits a plain `html` component the core renders unaided, and stays portable across shells. Keep the app shell free of framework-specific converter plugins.
:::

## Packaging your converter

Model the package on `piral-svelte`'s [`package.json`](https://github.com/smapiot/piral/blob/main/src/converters/piral-svelte/package.json):

- Build `src/` (the plugin) to `lib/` **and** build the root `convert.ts` to `convert.js` + `convert.d.ts`.
- Expose both via `exports`:

```json
{
  "exports": {
    ".": "./lib/index.js",
    "./convert": "./convert.js",
    "./extend-webpack": "./extend-webpack.js"
  }
}
```

- If the framework needs build-time handling of a custom file extension (Svelte's `.svelte`, etc.), ship a bundler helper too — `piral-svelte` exposes `piral-svelte/extend-webpack` for exactly this. Pilet authors then wire it into their bundler config so files like `Page.mf` compile.

## Checklist

- Implement `createConverter()` returning a `ForeignComponent` with `mount` / `update` / `unmount`.
- Export a standalone `from…` from a root `convert.ts`, returning `{ type: 'html', component }`, and publish it as the `/convert` submodule. **This is what pilets should import.**
- Optionally provide the plugin (`create…Api`) for completeness, but document the standalone form as the default.
- Provide a bundler extension if your framework uses custom file types.
- Use [`piral-svelte`](https://github.com/smapiot/piral/tree/main/src/converters/piral-svelte) as a working reference to copy from.

---
title: Configuration reference
description: Everything you can configure — the runtime via createInstance, the project files (piral.json / pilet.json), and environment variables.
---

# Configuration reference

This page covers everything you can configure in a Piral project: the **runtime** (via `createInstance`), the **project files** (`piral.json` and `pilet.json`), and the relevant **environment variables**.

## createInstance

`createInstance` creates the central Piral runtime for the app shell. It lives in the shell's entry module.

### Signature

```ts
function createInstance(config: PiralConfig): PiralInstance
```

```ts
createInstance({
  // Required: returns the pilets to load
  requestPilets(): Promise<PiletMetadata[]>,

  // Optional: override shell components and error pages
  state?: {
    components?: Partial<ComponentsState>,
    errorComponents?: Partial<ErrorComponentsState>,
  },

  // Optional: extend the Pilet API
  plugins?: PiralPlugin[],

  // Optional: additional global state actions
  actions?: GlobalStateActions,
})
```

### `requestPilets` (required)

Returns the list of pilets to load. Called once at startup.

```tsx
// From a live feed with auth
async requestPilets() {
  const token = getToken();
  const res = await fetch(FEED_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Feed failed: ${res.status}`);
  return (await res.json()).items;
},

// Static (for tests or demos)
requestPilets() {
  return Promise.resolve([
    { name: 'my-pilet', version: '1.0.0', link: '/pilets/my-pilet.js',
      spec: 'v2', integrity: '', dependencies: {} },
  ]);
},
```

### `state.components`

Override the shell's structural components. All keys are optional:

| Key | Type | Description |
|---|---|---|
| `Layout` | `React.FC<LayoutProps>` | Outer wrapper for all pages |
| `Router` | `React.FC` | Router provider (default: `BrowserRouter`) |
| `RouteSwitch` | `React.FC` | Renders the matched page |
| `LoadingIndicator` | `React.FC` | Shown while pilets load |

```ts
state: {
  components: {
    Layout: MyLayout,
    Router: MyRouter,
    RouteSwitch: MySwitch,
    LoadingIndicator: Spinner,
  },
}
```

### `state.errorComponents`

Override the error UIs. All keys are optional:

| Key | When rendered |
|---|---|
| `not_found` | No registered page matches the URL |
| `unknown` | Unhandled error in a pilet |
| `loading` | A pilet bundle failed to load |
| `page` | A page component threw during render |

### `plugins`

An array of plugin factories that extend the Pilet API (see [Piral Plugins](/api/piral-plugin)). On `piral` the standard plugins are already included; on `piral-core` you list exactly the ones you use:

```ts
plugins: [
  createMenuApi(),
  createNotificationsApi(),
  createModalsApi(),
  createDashboardApi(),
  createMyCustomApi(),
]
```

### `actions` (advanced)

Optional additional global state actions, merged into the store. Most apps don't need this — prefer a plugin for custom capabilities.

### Return value: `PiralInstance`

```ts
interface PiralInstance {
  context: GlobalStateContext;   // direct store access (advanced)
  options: PiralInstanceOptions; // the config passed in
}
```

Pass it to `<Piral instance={instance} />` to render.

### Full example

```tsx
import { createInstance, Piral } from 'piral';
import { createMenuApi } from 'piral-menu';
import { createNotificationsApi } from 'piral-notifications';
import * as React from 'react';
import { render } from 'react-dom';
import { AppLayout } from './layout/AppLayout';
import { NotFoundPage } from './layout/NotFoundPage';

const instance = createInstance({
  state: {
    components: { Layout: AppLayout },
    errorComponents: { not_found: NotFoundPage },
  },
  plugins: [createMenuApi(), createNotificationsApi()],
  async requestPilets() {
    const res = await fetch(FEED_URL);
    return (await res.json()).items;
  },
});

render(<Piral instance={instance} />, document.querySelector('#app'));
```

## piral.json

The app shell's project-level CLI configuration. It tells `piral debug` / `piral build` how to build *this* shell, so you don't have to pass the same flags every time. It's optional — Piral applies sensible defaults — and lives in the shell project root. (`.piralrc` is an accepted alternative filename.)

```json
{
  "entry": "src/index.tsx",
  "bundler": "webpack5",
  "emulatorPort": 1234,
  "publicUrl": "/"
}
```

| Field | Purpose |
|---|---|
| `entry` | The shell's entry module (where `createInstance` + render live) |
| `bundler` | Which installed bundler plugin to use (`webpack5`, `esbuild`, `rspack`, `vite`, `parcel2`) |
| `emulatorPort` | Port for the local debug server |
| `publicUrl` | Base URL the release is served from (affects asset paths) |

CLI flags override `piral.json`, which in turn overrides the built-in defaults.

## pilet.json

The pilet-side counterpart. It records how *this* pilet builds and which shell it targets, so `pilet debug` / `pilet build` / `pilet publish` work without repeated flags. Optional; lives in the pilet project root. (`.piletrc` is an accepted alternative filename.)

```json
{
  "app": "my-portal",
  "bundler": "webpack5",
  "port": 1234,
  "schema": "v2",
  "feed": "https://feed.example.com/api/v1/pilets"
}
```

| Field | Purpose |
|---|---|
| `app` | The target app shell (its package name) — what the emulator/types come from |
| `bundler` | Which installed bundler plugin to use |
| `port` | Port for the local debug server |
| `schema` | Pilet output format (`v0`, `v1`, `v2`, `mf`) |
| `feed` | Default feed URL used by `pilet debug --feed` and `pilet publish` |

Remember the runtime distinction: `app` here is a *development* default for typing and debugging — it doesn't bind the built pilet to that one shell. See [Pilet portability](/advanced/pilet-portability).

## Environment variables

| Variable | Used by | Description |
|---|---|---|
| `NODE_ENV` | Both | `development` or `production` |
| `PORT` | CLI | Dev server port override |
| `PUBLIC_URL` | App shell | Base URL for asset paths |

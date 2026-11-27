---
title: createInstance
description: Full reference for the createInstance factory function.
---

# createInstance

Creates the central Piral runtime object.

## Signature

```ts
function createInstance(config: PiralConfig): PiralInstance
```

## Parameters

### `requestPilets` (required)

Returns the list of pilets to load. Called once at startup.

```ts
requestPilets(): Promise<PiletMetadata[]>
```

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
      spec: 'v2', integrity: '', dependencies: {} }
  ]);
},
```

### `state.components`

Override shell components. All keys are optional:

```ts
state: {
  components: {
    Layout: MyLayout,          // outer wrapper for all pages
    Router: MyRouter,          // router provider (default: BrowserRouter)
    RouteSwitch: MySwitch,     // renders matched page
    LoadingIndicator: Spinner, // shown while pilets load
  }
}
```

### `state.errorComponents`

Override error page components. All keys are optional:

```ts
state: {
  errorComponents: {
    not_found: NotFoundPage,   // no route matched
    unknown: ErrorPage,        // unhandled runtime error
    loading: LoadFailPage,     // pilet bundle failed to load
  }
}
```

### `plugins`

Array of plugin factories that extend the Pilet API:

```ts
plugins: [
  createMenuApi(),
  createNotificationsApi(),
  createModalsApi(),
  createDashboardApi(),
  createMyCustomApi(),
]
```

## Return value: `PiralInstance`

```ts
interface PiralInstance {
  context: GlobalStateContext;   // direct store access (advanced)
  options: PiralInstanceOptions; // the config passed in
}
```

Pass to `<Piral instance={instance} />` to render.

## Full example

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

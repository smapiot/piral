---
title: piral-core
description: The React runtime layer — use directly for a minimal app shell.
---

# piral-core

Use `piral-core` when you want full control over which plugins are included. `piral` uses `piral-core` under the hood.

## Installation

```bash
npm install piral-core
```

## `createInstance`

Same as `piral`'s `createInstance` — returns a `PiralInstance` for use with `<PiralView>`.

## Writing a plugin

```ts
import { createPiralPlugin, PiralPlugin } from 'piral-core';

export interface MyApi {
  greet(name: string): void;
}

export function createMyApi(): PiralPlugin<MyApi> {
  return (context) => (_api, meta) => ({
    greet(name: string) {
      console.log(`Hello ${name} from ${meta.name}`);
    },
  });
}
```

Register it:

```tsx
const instance = createInstance({
  plugins: [createMyApi()],
});
```

Now all pilets have `api.greet('World')` — fully TypeScript-typed.

## Accessing global state

```ts
// Read state in a component
import { useGlobalState } from 'piral-core';
const count = useGlobalState(s => s.counter ?? 0);

// Write state from a plugin
export function createCounterApi(): PiralPlugin {
  return (context) => () => ({
    increment() {
      context.dispatch(state => ({ ...state, counter: (state.counter ?? 0) + 1 }));
    },
  });
}
```

## Test utilities

```ts
import { createTestApi } from 'piral-core/test';

const api = createTestApi();
// api.registerPage, api.registerMenu, etc. are all vi.fn() / jest.fn() mocks
setup(api);
expect(api.registerPage).toHaveBeenCalledWith('/products', expect.any(Function));
```

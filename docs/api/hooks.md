---
title: Hooks
description: The React hooks piral-core provides for reading global state and interacting with the runtime — available in the app shell only.
---

# Hooks

`piral-core` ships a small set of React hooks for reading the runtime's global state and dispatching its actions from inside components. They're the bridge between your shell's React components and the Piral runtime.

:::warning These hooks are for the app shell only
They read the shell's global-state context, so they work only in components rendered by the **app shell** — your layout, error pages, and any custom shell UI. **Pilets do not have access to them.** A pilet interacts with the application through the typed `PiletApi` it receives in `setup`, not through these hooks. (See the [Pilet API](/concepts/pilet-api).)
:::

All of them come from `piral-core` (and are re-exported by `piral`):

```ts
import { useGlobalState, useAction } from 'piral-core';
```

## `useGlobalState`

Reads the whole global state, or — with a selector — just a subset. With a selector the component re-renders only when that subset changes, which is what you usually want.

```tsx
import { useGlobalState } from 'piral-core';

const UserGreeting = () => {
  const user = useGlobalState((s) => s.user);
  return <span>Hello, {user?.name ?? 'Guest'}</span>;
};
```

## `useAction` / `useActions`

Actions are the controlled way to mutate the global state. `useAction` returns one action by name; `useActions` returns all of them. Plugins and the shell add the actions that show up here.

```tsx
import { useAction } from 'piral-core';

const LogoutButton = () => {
  const logout = useAction('logout');
  return <button onClick={logout}>Log out</button>;
};
```

## `useSharedData`

Reads the cross-pilet **shared data store** — the values pilets write with `api.setData`. Pass a selector to subscribe to a single slice.

```tsx
import { useSharedData } from 'piral-core';

const CurrentUser = () => {
  const user = useSharedData((d) => d.currentUser?.value);
  return <span>{user?.name}</span>;
};
```

## `usePiletApi`

Returns the **root** pilet API, letting shell code call Pilet API methods (for example plugin-provided ones) from within the shell itself. Advanced — most shell code won't need it.

```tsx
import { usePiletApi } from 'piral-core';

const SaveButton = () => {
  const api = usePiletApi();
  return <button onClick={() => api.showNotification('Saved!')}>Save</button>;
};
```

## `useMedia`

A small responsive helper: returns a value chosen by which media query currently matches — handy for breakpoint-driven shell layout.

```tsx
import { useMedia } from 'piral-core';

const columns = useMedia(
  ['(min-width: 1024px)', '(min-width: 640px)', '(min-width: 0px)'],
  [3, 2, 1],
  1,
);
```

## `useSetter`

Runs a callback once on mount — a tiny convenience used by some shell components.

```tsx
import { useSetter } from 'piral-core';

useSetter(() => {
  document.title = 'My Portal';
});
```

## `useGlobalStateContext` (advanced)

The escape hatch: returns the full global-state context — the state plus every action. Prefer `useGlobalState` and `useAction` for everyday work; reach for this only when you genuinely need direct, low-level access to the runtime.

```ts
import { useGlobalStateContext } from 'piral-core';

const ctx = useGlobalStateContext();
```

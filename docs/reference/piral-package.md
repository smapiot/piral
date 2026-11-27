---
title: piral
description: The all-in-one entry point package for building Piral app shells.
---

# piral package

The `piral` package is the recommended entry point for building app shells. It re-exports everything from `piral-core` and `piral-base`, plus standard plugins.

## Key exports

### `createInstance(config)`

Creates the Piral runtime. See [createInstance](/api/create-instance) for the full API reference.

### `<Piral instance={...} />`

Root React component. Renders the full application:

```tsx
import { Piral, createInstance } from 'piral';

const instance = createInstance({ ... });
render(<Piral instance={instance} />, document.querySelector('#app'));
```

### `<ExtensionSlot name="..." params={...} />`

Renders all extensions registered for a slot name. See [Extension slots](/concepts/extension-slots).

### `<Menu type="..." />`

Renders all menu items registered for a zone type. Requires `piral-menu` plugin.

### `<Notifications />`

Renders notification toasts. Requires `piral-notifications` plugin. Place once in your layout.

### `<Modals />`

Renders registered modals. Requires `piral-modals` plugin. Place once in your layout.

## Hooks

```ts
import { useGlobalState, useAction, useExtensions, usePilet } from 'piral';

// Read from global state
const user = useGlobalState(s => s.user);

// Dispatch a state action
const logout = useAction('logout');

// Check registered extensions
const extras = useExtensions('cart-extra');

// Access the Pilet API from inside a component (advanced)
const api = usePilet();
```

## TypeScript types

```ts
import type {
  PiletApi,              // full typed API
  PiralPlugin,           // plugin factory type
  PiletMetadata,         // feed response item
  LayoutProps,           // Layout component props
  ComponentsState,       // replaceable shell components
  ErrorComponentsState,  // error page components
} from 'piral';
```

## Package layers

The three packages are concentric: each builds on the one inside it. Pick the outermost layer you need.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 226" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="piral wraps piral-core, which wraps piral-base. piral-base is the framework-agnostic loader, piral-core adds the React runtime, and piral adds the standard plugins.">
  <rect class="d-fill" x="0" y="0" width="760" height="226" rx="14" fill="var(--dg-canvas)"/>
  <rect class="d-stroke-2" x="32" y="24" width="696" height="178" rx="12" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h" x="50" y="46" fill="var(--dg-brand)">piral</text>
  <text class="d-s" x="92" y="46" fill="var(--dg-ink-soft)">— all-in-one: core + standard plugin API</text>
  <rect class="d-stroke" x="64" y="58" width="632" height="128" rx="10" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h" x="82" y="80" fill="var(--dg-a)">piral-core</text>
  <text class="d-s" x="150" y="80" fill="var(--dg-ink-soft)">— React runtime, extension slots, base Pilet API</text>
  <rect class="d-stroke" x="96" y="92" width="568" height="78" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-h" x="114" y="124" fill="var(--dg-ink)">piral-base</text>
  <text class="d-s" x="186" y="124" fill="var(--dg-ink-soft)">— pilet loading &amp; lifecycle runtime, no UI framework</text>
  <text class="d-s" x="114" y="148" fill="var(--dg-ink-soft)">use directly only for a custom non-React runtime</text>
</svg>
</div>
<figcaption>Each layer wraps the previous one. Most apps use <code>piral</code>; reach inward only when you need less.</figcaption>
</figure>

| Package | Contents |
|---|---|
| `piral-base` | Pilet loading runtime, no React |
| `piral-core` | React runtime, extension slots, base API |
| `piral` | Everything in core + standard plugin API |

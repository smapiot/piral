---
title: Pilet API
description: The typed contract between the app shell and every pilet — the core API plus the extended API contributed by plugins.
---

# Pilet API

The Pilet API is the object every pilet receives as the argument to its `setup` function. It is the formal, versioned interface between the app shell and the pilet world — every interaction a pilet has with the rest of the application goes through it.

Its shape has two layers: a **core API** that's always present, and an **extended API** contributed by plugins. TypeScript types reflect precisely what's available for *your* shell — see [TypeScript types](/guides/typescript).

## Core API

The core API is the surface brought in by the two core packages, **`piral-base`** and **`piral-core`**. Every app shell has these methods, no matter which plugins (if any) are installed.

### Registration

```ts
// Register a page at a URL path
api.registerPage(path: string, component: AnyComponent): void
api.unregisterPage(path: string): void

// Contribute to a named extension slot
api.registerExtension(name: string, component: AnyComponent, defaults?: object): void
api.unregisterExtension(name: string, component: AnyComponent): void
```

### Events

```ts
// Emit an event to all listening pilets
api.emit(type: string, args: object): void

// Subscribe / unsubscribe
api.on(type: string, handler: (args: object) => void): void
api.off(type: string, handler: Function): void
```

### Shared data store

```ts
// Write a value (first pilet to write a key owns it)
api.setData(key: string, value: any): boolean

// Read a value
api.getData(key: string): any
```

### Pilet metadata

```ts
api.meta.name        // Package name from package.json
api.meta.version     // Semver version
api.meta.config      // config object from the feed item
api.meta.basePath    // CDN base path for this pilet's static assets
api.meta.link        // Full URL to this pilet's bundle
api.meta.custom      // Any custom fields from the feed item
```

## Extended API

Everything below is added by **plugins**. The methods listed here come from the standard plugins bundled in **`piral-ext`**, which ships as part of the [`piral`](/reference/piral-packages) framework package — so if you scaffolded with `piral`, they're already on the API. They're physically distributed across several packages (`piral-menu`, `piral-notifications`, `piral-modals`, `piral-dashboard`, `piral-feeds`, `piral-translate`).

Plenty of other official plugins extend the API further (search, forms, breadcrumbs, data fetching, auth, …) — those aren't bundled with `piral` and must be installed and registered explicitly. See [Official plugins](/reference/plugins) for the full catalog.

### `piral-menu` → `api.registerMenu`

Menu items render wherever the shell places `<Menu type="...">`:

```tsx
api.registerMenu(() => <a href="/products">Products</a>, { type: 'general' });
```

### `piral-notifications` → `api.showNotification`

```ts
api.showNotification('Order saved!', {
  type: 'success',   // 'info' | 'success' | 'warning' | 'error'
  autoClose: 3000,   // ms, or false to persist
  title: 'Optional title',
});
```

### `piral-modals` → `api.registerModal`, `api.showModal`

```tsx
api.registerModal('confirm-delete', ({ options, onClose }) => (
  <div>
    <p>Delete {options.name}?</p>
    <button onClick={() => { options.onConfirm(); onClose(); }}>Delete</button>
    <button onClick={onClose}>Cancel</button>
  </div>
));

api.showModal('confirm-delete', { name: 'Invoice #123', onConfirm: doDelete });
```

### `piral-dashboard` → `api.registerTile`

```tsx
api.registerTile(
  () => <div><h3>Revenue today</h3><p>€4,219</p></div>,
  { initialColumns: 2, initialRows: 1, resizable: true },
);
```

### `piral-feeds` → `api.createConnector`

```tsx
const connector = api.createConnector({
  initialize: () => fetch('/api/items').then((r) => r.json()),
  connect: (cb) => {
    const id = setInterval(() => fetch('/api/items').then((r) => r.json()).then(cb), 30_000);
    return () => clearInterval(id);
  },
  update: (data, item) => [...data, item],
});

const ItemsPage = connector(({ data, loading }) =>
  loading ? <Spinner /> : <ItemList items={data} />,
);
```

### `piral-translate` → `api.translate`

```ts
api.setTranslations({ en: { welcome: 'Welcome, {{name}}!' } });
api.translate('welcome', { name: 'Alice' }); // "Welcome, Alice!"
```

## Types

A pilet imports its shell's `PiletApi` and gets exactly that shell's API — core plus whatever plugins it installed — fully typed:

```tsx
import type { PiletApi } from 'my-app-shell';

export function setup(api: PiletApi) {
  api.showNotification('Hello!'); // ✅ only if the shell installed piral-notifications
}
```

How those types are generated, and how to extend them for your own events and extension slots, is covered in the [TypeScript types](/guides/typescript) guide.

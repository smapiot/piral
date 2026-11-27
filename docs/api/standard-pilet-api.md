---
title: Pilet API
description: The core Pilet API that ships with piral-base and piral-core — the methods every pilet has before any plugin is added.
---

# Pilet API

The `StandardPiletApi` is the object every pilet receives in its `setup` function. This page documents the **core** API — the methods that come from `piral-base` and `piral-core` and are therefore present in *every* Piral app, before any plugin is added.

Plugins extend this object with additional methods (for example `showNotification` from `piral-notifications`). Those are documented with their plugins — see [Official plugins](/reference/plugins) and [Piral Plugins](/api/piral-plugin) — and are intentionally not listed here, because whether they exist depends on which plugins the app shell installed.

## `api.registerPage(path, component)`

Mount a component at a route. The matching page renders inside the app shell's layout.

```ts
api.registerPage(path: string, component: AnyComponent): void
api.unregisterPage(path: string): void
```

```tsx
api.registerPage('/products', ProductsPage);
api.registerPage('/products/:id', ProductDetailPage);
api.registerPage('/admin/*', AdminSection);
```

## `api.registerExtension(name, component, defaults?)`

Contribute a component into a named extension slot that any pilet (or the shell) can render. See [Extension slots](/concepts/extension-slots).

```ts
api.registerExtension<T>(name: string, component: AnyComponent, defaults?: T): void
api.unregisterExtension<T>(name: string, component: AnyComponent): void
```

```tsx
api.registerExtension('cart-extra', PromoWidget, { theme: 'dark' });
```

## `api.emit(type, args)` / `api.on` / `api.off`

A simple event bus shared across all pilets. See [Sharing state between pilets](/guides/shared-state).

```ts
api.emit(type: string, args: object): void
api.on(type: string, handler: (args: object) => void): void
api.off(type: string, handler: Function): void
```

## `api.setData(key, value)` / `api.getData(key)`

A shared key–value store. The first pilet to write a key owns it; others can read it.

```ts
api.setData(key: string, value: any): boolean
api.getData(key: string): any
```

## `api.meta`

Metadata about the running pilet, taken from its feed item.

```ts
api.meta.name        // "pilet-checkout"
api.meta.version     // "3.1.0"
api.meta.config      // config from the feed item
api.meta.basePath    // CDN base path for static assets
api.meta.link        // full bundle URL
api.meta.custom      // any custom fields from the feed item
```

:::tip Where are showNotification, registerMenu, …?
Methods like `registerMenu`, `showNotification`, `registerModal`, and `registerTile` are **not** part of the core API — they come from plugins (`piral-menu`, `piral-notifications`, `piral-modals`, `piral-dashboard`). They appear on the typed `PiletApi` only when the app shell installs the corresponding plugin. See [Official plugins](/reference/plugins).
:::

---
title: Sharing state between pilets
description: The right mechanism for each cross-pilet communication scenario.
---

# Sharing state between pilets

Pilets are isolated by design. Communication happens through explicit, observable mechanisms — four channels, never direct imports or `window` globals.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four channels connect pilets: events, the shared data store, a shared library, and extension slots.">
  <rect class="d-fill" x="0" y="0" width="760" height="230" rx="14" fill="var(--dg-canvas)"/>
  <rect class="d-stroke" x="30" y="46" width="150" height="138" rx="10" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h d-tc" x="105" y="120" fill="var(--dg-a)">Pilet A</text>
  <rect class="d-stroke" x="580" y="46" width="150" height="138" rx="10" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-h d-tc" x="655" y="120" fill="var(--dg-c)">Pilet B</text>
  <rect class="d-fill" x="196" y="52" width="368" height="26" rx="13" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="380" y="69" fill="var(--dg-ink-soft)">events — emit / on</text>
  <rect class="d-fill" x="196" y="84" width="368" height="26" rx="13" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="380" y="101" fill="var(--dg-ink-soft)">shared data store — setData / getData</text>
  <rect class="d-fill" x="196" y="116" width="368" height="26" rx="13" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="380" y="133" fill="var(--dg-ink-soft)">shared library — importmap side-bundle</text>
  <rect class="d-fill" x="196" y="148" width="368" height="26" rx="13" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="380" y="165" fill="var(--dg-ink-soft)">extension slot — shared UI</text>
</svg>
</div>
<figcaption>Four explicit channels connect pilets — events, the shared data store, shared libraries, and extension slots.</figcaption>
</figure>

## 1. Events: fire-and-forget

```tsx
api.emit('cart:item-added', { productId: 'p1', qty: 2 });

api.on('cart:item-added', ({ productId, qty }) => {
  updateCartBadge(qty);
});
```

Good for: real-time notifications, analytics hooks, loose coupling.
Not for: state a late-loading pilet needs at startup.

## 2. Shared data store: named key-value

```tsx
// Write early in setup — other pilets find it when they load
api.setData('currentUser', { id: 'u1', name: 'Alice', roles: ['admin'] });

// Read from any pilet
const user = api.getData('currentUser');

// Subscribe to changes
api.on('store-data', ({ name, value }) => {
  if (name === 'currentUser') setLocalUser(value);
});
```

First pilet to write a key owns it. Others can read but not overwrite.

## 3. Shared libraries via importmap

Any pilet can share a package as a side-bundle:

```json
{
  "importmap": {
    "imports": { "my-cart-service": "" }
  }
}
```

Other pilets that declare the same name get the same instance:

```tsx
import { cartStore } from 'my-cart-service';
```

For how this resolves (externals vs side-bundles, and where each dependency belongs), see [Dependency sharing](/concepts/dependency-sharing).

## 4. Extension slots: sharing UI

```tsx
<ExtensionSlot name="order-extras" params={{ orderId }} />

api.registerExtension('order-extras', ({ params }) => (
  <ShippingTracker orderId={params.orderId} />
));
```

## Decision guide

| Scenario | Mechanism |
|---|---|
| Notify others of an event | `api.emit` / `api.on` |
| Small value all pilets need | `api.setData` / `api.getData` |
| Shared service instance | importmap side-bundle |
| Shared rendered component | Extension slots |
| Complex reactive global state | Custom plugin |
| State surviving page reload | URL params or localStorage |

:::warning
Never use `window` globals to share state. Untestable, untyped, and a debugging nightmare.
:::

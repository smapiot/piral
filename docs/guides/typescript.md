---
title: TypeScript types
description: Where Piral's types come from, how to extend them for your own events and extension slots, and how to share them across pilets.
---

# TypeScript types

Piral is fully typed around a single type: **`PiletApi`**, the contract a pilet uses to talk to the shell. This guide covers where that type comes from, how to extend it for your own events and extension slots, and how to share types across teams.

## How the types are generated

You don't hand-write the `PiletApi` type. When you build the app shell, Piral **generates** it:

```bash
npx piral build
```

The emulator produced by the build contains a generated TypeScript declaration (an `index.d.ts`) describing *that shell's* `PiletApi` — the [core API](/concepts/pilet-api#core-api) plus the methods of every plugin the shell installed. (The `piral declaration` command produces it; the build runs it for you.)

A pilet installs that emulator and imports the type:

```tsx
import type { PiletApi } from 'my-app-shell';

export function setup(api: PiletApi) {
  api.showNotification('Hi'); // ✅ typed only if the shell installed piral-notifications
}
```

Because the type is generated from the real shell, a pilet's autocomplete matches production exactly: call a method the shell doesn't provide and it's a compile error, not a runtime surprise. For framework-agnostic utilities that should accept any shell's API, import the base type instead:

```tsx
import type { PiletApi } from 'piral-core';
```

## Extending the types

Piral exposes a set of intentionally empty interfaces in `piral-core/lib/types/custom`. You extend the typing by **declaration merging** against them. Put these augmentations in a `.d.ts` file in the **app shell** so they flow into the generated emulator types (or in a shared types package — see below).

### Typing events

Augment `PiralCustomEventMap` so `api.emit` and `api.on` are checked:

```ts
// types.d.ts (in the app shell)
import 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiralCustomEventMap {
    'cart-item-added': { productId: string; quantity: number };
  }
}
```

```ts
api.emit('cart-item-added', { productId: 'p1', quantity: 2 }); // ✅ payload checked
api.on('cart-item-added', ({ productId, quantity }) => {
  // productId: string, quantity: number — fully typed
});
```

### Typing extension slots

Augment `PiralCustomExtensionSlotMap` to map each slot name to the shape of its `params`:

```ts
declare module 'piral-core/lib/types/custom' {
  interface PiralCustomExtensionSlotMap {
    'cart-extra': { cartTotal: number };
  }
}
```

Now both ends of the slot are type-checked:

```tsx
// rendering the slot
<ExtensionSlot name="cart-extra" params={{ cartTotal: 89.9 }} />

// filling the slot
api.registerExtension('cart-extra', ({ params }) => (
  <Promo total={params.cartTotal} /> // params is typed
));
```

### Other extension points

The same module exposes interfaces for more of the surface — for example `PiletCustomApi` to add methods to the Pilet API itself (this is what plugin authors merge into; see [Piral Plugins](/api/piral-plugin)), plus interfaces for shared data, page metadata, and custom errors. Augment whichever one you need; the pattern is always the same.

## Sharing types

Two pilets that emit the same event or fill the same slot need the *same* augmentations. Define the contract once and reuse it:

- **A shared types package.** Extract the `declare module` augmentations into a small package (e.g. `@my-portal/types`) that the shell and every pilet reference. The contract lives in one place.
- **Automatic fusion via Piral Cloud.** The official [Piral Cloud](https://www.piral.cloud) feed service can go a step further: pilets publish their own types, and the feed **automatically fuses the types published from pilets** into the instance's typing. Consumers then get a complete, always-current typed surface — including types contributed by other teams' pilets — without manually wiring up a shared package.

:::tip
Keep event and slot augmentations close to whoever *owns* the contract. If the app shell defines a slot, type it in the shell so the definition travels with the generated emulator types. If a pilet introduces a cross-pilet event, a shared types package (or Piral Cloud's type fusion) keeps every consumer in sync.
:::

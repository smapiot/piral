---
title: Extension slots
description: How pilets contribute UI into each other's pages without coupling.
---

# Extension slots

Extension slots let one pilet declare a named placeholder in its UI that any other pilet can fill — without either pilet knowing anything about the other. The app shell's extension registry connects them at runtime.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 326" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pilet A declares an extension slot in its page; Pilet B registers a component for that slot; the app shell registry connects them at runtime without either pilet knowing the other.">
  <rect class="d-fill" x="0" y="0" width="760" height="326" rx="14" fill="var(--dg-canvas)"/>

  <rect class="d-stroke" x="34" y="28" width="320" height="160" rx="10" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h" x="54" y="54" fill="var(--dg-a)">Pilet A · cart</text>
  <rect class="d-thin" x="54" y="66" width="280" height="104" rx="7" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s" x="70" y="88" fill="var(--dg-ink-soft)">CartPage</text>
  <rect class="d-fill" x="70" y="98" width="248" height="20" rx="4" fill="var(--dg-frame-2)"/>
  <text class="d-s" x="80" y="112" fill="var(--dg-ink-soft)">items · summary</text>
  <rect class="d-dash" x="70" y="124" width="248" height="36" rx="6" stroke="var(--dg-a)"/>
  <text class="d-m d-tc" x="194" y="146" fill="var(--dg-a)">&lt;ExtensionSlot name="cart-extra" /&gt;</text>

  <rect class="d-stroke" x="406" y="28" width="320" height="160" rx="10" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-h" x="426" y="54" fill="var(--dg-b)">Pilet B · promotions</text>
  <rect class="d-thin" x="426" y="66" width="280" height="104" rx="7" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-s" x="442" y="88" fill="var(--dg-ink-soft)">setup(api)</text>
  <rect class="d-fill" x="442" y="98" width="248" height="36" rx="6" fill="var(--dg-b-bg)"/>
  <text class="d-m d-tc" x="566" y="120" fill="var(--dg-b)">registerExtension('cart-extra', Promo)</text>
  <text class="d-s" x="442" y="156" fill="var(--dg-ink-soft)">never imports Pilet A</text>

  <path class="d-dash" d="M566 188 V236" stroke="var(--dg-b)"/>
  <path class="d-fill" d="M559 232 L566 246 L573 232 Z" fill="var(--dg-b)"/>
  <text class="d-s" x="580" y="216" fill="var(--dg-ink-soft)">registers</text>

  <rect class="d-stroke-2" x="230" y="246" width="300" height="60" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="380" y="272" fill="var(--dg-brand)">App Shell · extension registry</text>
  <text class="d-s d-tc" x="380" y="292" fill="var(--dg-ink-soft)">matches slot names to registered components</text>

  <path class="d-dash" d="M230 276 H194 V164" stroke="var(--dg-brand)"/>
  <path class="d-fill" d="M187 168 L194 154 L201 168 Z" fill="var(--dg-brand)"/>
  <text class="d-s d-te" x="224" y="232" fill="var(--dg-ink-soft)">renders into slot</text>
</svg>
</div>
<figcaption>Pilet B fills a slot that Pilet A declared — connected at runtime by the shell, with zero coupling between the two.</figcaption>
</figure>

## Declaring a slot

In any component, render `<ExtensionSlot>` from `piral`:

```tsx
import { ExtensionSlot } from 'piral';

const CartPage = () => (
  <div>
    <CartItemList />
    <CartSummary />

    {/* Any pilet can render content here */}
    <ExtensionSlot name="cart-extra" />
  </div>
);
```

If no pilet has registered for this name, nothing renders. You can provide fallback content for the empty state:

```tsx
<ExtensionSlot name="cart-extra">
  <p>No additional information.</p>
</ExtensionSlot>
```

## Filling a slot

From any pilet's `setup` function:

```tsx
export function setup(api: PiletApi) {
  api.registerExtension('cart-extra', PromoWidget);
}
```

Multiple pilets can register for the same slot — all contributions render in feed-response order.

## Passing parameters

The slot can pass contextual data to all registered components:

```tsx
<ExtensionSlot
  name="cart-extra"
  params={{ cartTotal: 89.99, itemCount: 3 }}
/>
```

Extension components receive `params` as a prop:

```tsx
const PromoWidget: React.FC<{ params: { cartTotal: number } }> = ({ params }) => {
  if (params.cartTotal < 50) return null;
  return <div className="promo">You qualify for free shipping!</div>;
};
```

## Conditionally wrapping a slot

There's no `useExtensions` hook — the `ExtensionSlot` decides what to render. To wrap a slot in a section *only when something is registered*, use its `render` prop. It receives the already-rendered extensions and lets you return your own markup around them (or nothing at all):

```tsx
const CartPage = () => (
  <div>
    <CartSummary />
    <ExtensionSlot
      name="cart-extra"
      params={{ cartTotal: total }}
      render={(nodes) =>
        nodes.length ? (
          <section className="cart-extras">
            <h3>Special offers</h3>
            {nodes}
          </section>
        ) : null
      }
    />
  </div>
);
```

This works anywhere a slot does, including inside a pilet — it's just props on the component, not a shell-only hook.

For the simpler "show a fallback when the slot is empty" case, pass `empty` (and `emptySkipsRender` to render nothing instead) rather than checking yourself — see [Declaring a slot](#declaring-a-slot).

:::tip Reading the registry directly (advanced)
If you genuinely need the raw registrations, a *shell* component can read them from global state: `useGlobalState((s) => s.registry.extensions['cart-extra'] ?? [])`. This is shell-only (pilets can't use it) and couples you to internal state shape — prefer the `render` prop above.
:::

## Limiting extension count

```tsx
{/* Render at most one extension */}
<ExtensionSlot name="featured-promo" limit={1} />
```

## Extension slots in the app shell layout

Well-designed app shells use extension slots in their layout components. This lets pilets contribute navigation items, header actions, and sidebar widgets without the shell explicitly listing any pilet:

```tsx
const AppHeader = () => (
  <header>
    <Logo />
    <nav>
      <ExtensionSlot name="nav-primary" />
    </nav>
    <div className="header-actions">
      <ExtensionSlot name="header-actions" />
      <UserMenu />
    </div>
  </header>
);
```

## Slot naming conventions

Slot names are the coordination surface between pilets. They are effectively public API — treat them as such.

- **Kebab-case**: `cart-extra`, not `CartExtra`
- **Namespace with context**: `checkout-cart-extra` to avoid conflicts with other pilets' slots
- **Describe purpose, not location**: `product-quick-actions` rather than `product-page-right-col`
- **Document your slots**: pilet developers need to know what slots exist, what `params` shape they receive, and how many extensions render

Changing a slot name or its `params` shape is a breaking change for every pilet that fills it. Version accordingly.

## Unregistering

You rarely need to do this manually. Everything a pilet registers is **automatically torn down** when the pilet is hot-reloaded during development, updated to a new version, or removed from the feed — so you don't have to clean up on the pilet's behalf.

Calling `unregisterExtension` yourself only makes sense in genuinely *dynamic* scenarios: an extension that should be available for a short time window, or only while some complex runtime condition holds. To unregister, keep a reference to the exact same component you registered:

```tsx
// Hold a reference to the same function to unregister later
const component = () => <PromoWidget />;
api.registerExtension('cart-extra', component);

// Later, when the condition no longer applies:
api.unregisterExtension('cart-extra', component);
```

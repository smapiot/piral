---
title: Architecture overview
description: How Piral's three-layer model works — from browser load to rendered page.
---

# Architecture overview

Every Piral application has the same three-layer structure. Understanding it makes every other part of the documentation easier to follow.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 482" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Piral architecture: the browser runs the app shell, which loads pilets discovered from the feed service">
  <rect class="d-fill" x="0" y="0" width="760" height="482" rx="14" fill="var(--dg-canvas)"/>

  <rect class="d-stroke" x="18" y="14" width="724" height="304" rx="12" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <path class="d-thin" d="M18 50 H742" stroke="var(--dg-line)"/>
  <circle class="d-fill" cx="40" cy="32" r="5" fill="#FC5F57"/>
  <circle class="d-fill" cx="58" cy="32" r="5" fill="#FEBC2E"/>
  <circle class="d-fill" cx="76" cy="32" r="5" fill="#28C840"/>
  <rect class="d-thin" x="104" y="23" width="320" height="18" rx="9" fill="var(--dg-frame-2)" stroke="var(--dg-line)"/>
  <text class="d-m d-tc" x="264" y="35" fill="var(--dg-mono)">https://app.example.com</text>
  <text class="d-s d-te" x="726" y="36" fill="var(--dg-ink-soft)">Browser</text>

  <rect class="d-stroke" x="36" y="62" width="688" height="244" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-t" x="54" y="86" fill="var(--dg-brand)">App Shell</text>
  <text class="d-s" x="54" y="103" fill="var(--dg-ink-soft)">layout · auth · routing · shared runtime · extension registry</text>

  <g>
    <rect class="d-stroke" x="54" y="116" width="206" height="178" rx="8" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
    <text class="d-h d-tc" x="157" y="140" fill="var(--dg-a)">Pilet A</text>
    <text class="d-s d-tc" x="157" y="156" fill="var(--dg-ink-soft)">Checkout team</text>
    <path class="d-thin" d="M72 166 H242" stroke="var(--dg-line)"/>
    <rect class="d-fill" x="70" y="174" width="174" height="20" rx="4" fill="var(--dg-a-bg)"/>
    <text class="d-m d-tc" x="157" y="188" fill="var(--dg-a)">registerPage('/checkout')</text>
    <rect class="d-fill" x="70" y="200" width="174" height="20" rx="4" fill="var(--dg-a-bg)"/>
    <text class="d-m d-tc" x="157" y="214" fill="var(--dg-a)">registerExtension(…)</text>
    <text class="d-s d-tc" x="157" y="278" fill="var(--dg-ink-soft)">↑ deploys independently</text>
  </g>

  <g>
    <rect class="d-stroke" x="277" y="116" width="206" height="178" rx="8" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
    <text class="d-h d-tc" x="380" y="140" fill="var(--dg-b)">Pilet B</text>
    <text class="d-s d-tc" x="380" y="156" fill="var(--dg-ink-soft)">Catalog team</text>
    <path class="d-thin" d="M295 166 H465" stroke="var(--dg-line)"/>
    <rect class="d-fill" x="293" y="174" width="174" height="20" rx="4" fill="var(--dg-b-bg)"/>
    <text class="d-m d-tc" x="380" y="188" fill="var(--dg-b)">registerPage('/products')</text>
    <rect class="d-fill" x="293" y="200" width="174" height="20" rx="4" fill="var(--dg-b-bg)"/>
    <text class="d-m d-tc" x="380" y="214" fill="var(--dg-b)">registerMenu(…)</text>
    <text class="d-s d-tc" x="380" y="278" fill="var(--dg-ink-soft)">↑ deploys independently</text>
  </g>

  <g>
    <rect class="d-stroke" x="500" y="116" width="206" height="178" rx="8" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
    <text class="d-h d-tc" x="603" y="140" fill="var(--dg-c)">Pilet C</text>
    <text class="d-s d-tc" x="603" y="156" fill="var(--dg-ink-soft)">Account team</text>
    <path class="d-thin" d="M518 166 H688" stroke="var(--dg-line)"/>
    <rect class="d-fill" x="516" y="174" width="174" height="20" rx="4" fill="var(--dg-c-bg)"/>
    <text class="d-m d-tc" x="603" y="188" fill="var(--dg-c)">registerPage('/account')</text>
    <rect class="d-fill" x="516" y="200" width="174" height="20" rx="4" fill="var(--dg-c-bg)"/>
    <text class="d-m d-tc" x="603" y="214" fill="var(--dg-c)">registerTile(…)</text>
    <text class="d-s d-tc" x="603" y="278" fill="var(--dg-ink-soft)">↑ deploys independently</text>
  </g>

  <path class="d-dash" d="M380 318 V392" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M373 388 L380 402 L387 388 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s" x="396" y="352" fill="var(--dg-ink-soft)">GET /api/v1/pilets · on startup</text>

  <rect class="d-stroke" x="230" y="404" width="300" height="62" rx="10" fill="var(--dg-ok-bg)" stroke="var(--dg-ok)"/>
  <text class="d-h d-tc" x="380" y="430" fill="var(--dg-ok)">Feed Service</text>
  <text class="d-m d-tc" x="380" y="450" fill="var(--dg-ink-soft)">{ items: [ pilet metadata + CDN urls ] }</text>
</svg>
</div>
<figcaption>One stable app shell hosts independently deployed pilets, discovered at runtime from the feed.</figcaption>
</figure>

## The three layers

### 1. The app shell

The app shell is the only thing users download directly from your URL. It is a small, stable, static bundle — typically under 100 KB gzipped — that:

1. Bootstraps the React application and global layout
2. Calls the feed service to discover which pilets should load for this user
3. Fetches and evaluates each pilet's JavaScript bundle
4. Calls each pilet's `setup(api)` function and hands it the Pilet API
5. Renders the current route using whatever pages the pilets registered

The app shell knows nothing about individual features. It provides the **stage** — navigation chrome, authentication context, shared dependencies — and pilets perform on it.

The app shell should change as infrequently as possible. Every app shell deploy potentially affects every user and every pilet team.

### 2. Pilets

Pilets are the feature modules. Each is a self-contained JavaScript bundle — developed, versioned, and deployed independently by a single team. A pilet has one public interface: its `setup` function.

```tsx
import type { PiletApi } from 'my-app-shell';

export function setup(api: PiletApi) {
  api.registerPage('/checkout', CheckoutPage);
  api.registerMenu(() => <a href="/checkout">Checkout</a>);
  api.registerExtension('order-extras', ShippingInfo);
}
```

Pilets do not communicate directly. All interaction — registering UI, sharing data, emitting events — goes through the Pilet API.

### 3. The feed service

The feed service is a simple HTTP endpoint. The app shell calls it once at startup and receives a JSON array of pilet metadata:

```json
{
  "items": [
    {
      "name": "pilet-checkout",
      "version": "3.1.0",
      "link": "https://cdn.example.com/checkout@3.1.0/index.js",
      "spec": "v2",
      "integrity": "sha384-...",
      "dependencies": {},
      "config": { "checkoutApiUrl": "https://api.example.com/v2" }
    }
  ]
}
```

The feed can apply any logic: serve this pilet only to authenticated users, only to this tenant, only to users in the beta group, only in certain regions. The app shell doesn't care about any of that — it just fetches the URL and loads whatever comes back.

## The startup sequence

1. **Browser loads the app shell** — a small, cacheable static bundle
2. **Shell initialises** — React mounts, global layout renders, router starts
3. **Feed request** — `GET /api/v1/pilets` with the user's auth token
4. **Bundle loading** — each pilet's JS is fetched in parallel from CDN URLs
5. **`setup()` calls** — each pilet registers pages, menus, extensions
6. **Render** — router matches the current URL, renders the correct pilet page

Steps 1–5 complete before the user sees any pilet content. This is why pilet bundle count and initial size matter for perceived performance.

:::tip Lazy pilets
Pilets can be marked as lazy in the feed response. Lazy pilets skip steps 4–5 at startup — their bundles are fetched only when the user first navigates to one of their routes. This is the primary performance lever for applications with many pilets.
:::

## Shared dependencies

The app shell declares centrally shared packages in its `importmap`. Pilets treat these as externals and never bundle them.

But any pilet can also share dependencies with other pilets via its own `importmap`. When a pilet loads a side-bundled package, that package becomes available to all subsequently loaded pilets that declare the same name. The first pilet to resolve a dependency wins; others reuse it.

This **distributed sharing model** means teams don't need to coordinate with the app shell team to share a domain library. The team that introduces the library owns the sharing declaration.

## The development loop

The emulator closes the gap between local development and the full platform:

```
App Shell builds → dist/emulator/my-shell-1.0.tgz
                           ↓ published to npm
Pilet installs: npm install --save-dev my-shell
                           ↓
pilet debug     → loads shell from node_modules
                → hot reload on file save
                → TypeScript types from real shell
```

See [Emulator](/concepts/emulator) for the complete story.

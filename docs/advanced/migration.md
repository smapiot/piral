---
title: Migrating from a monolith
description: An incremental strategy for adopting Piral in an existing application.
---

# Migrating from a monolith

The strangler fig pattern: introduce Piral alongside your existing app, gradually expand it until the monolith can be retired.

## The migration stages

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 268" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Strangler-fig migration: the legacy app starts as one big pilet under the shell, then shrinks as features are extracted into their own pilets, until it is retired.">
  <rect class="d-fill" x="0" y="0" width="760" height="268" rx="14" fill="var(--dg-canvas)"/>
  <text class="d-h d-tc" x="132" y="30" fill="var(--dg-ink)">Stage 1</text>
  <rect class="d-stroke" x="36" y="42" width="192" height="26" rx="6" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-s d-tc" x="132" y="59" fill="var(--dg-brand)">App shell</text>
  <rect class="d-stroke" x="36" y="76" width="192" height="158" rx="7" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-l d-tc" x="132" y="150" fill="var(--dg-b)">Legacy app</text>
  <text class="d-s d-tc" x="132" y="168" fill="var(--dg-ink-soft)">one big pilet</text>
  <path class="d-dash" d="M232 138 H268" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M264 131 L278 138 L264 145 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-h d-tc" x="380" y="30" fill="var(--dg-ink)">Stage 2…</text>
  <rect class="d-stroke" x="284" y="42" width="192" height="26" rx="6" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-s d-tc" x="380" y="59" fill="var(--dg-brand)">App shell</text>
  <rect class="d-stroke" x="284" y="76" width="192" height="96" rx="7" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-l d-tc" x="380" y="120" fill="var(--dg-b)">Legacy</text>
  <text class="d-s d-tc" x="380" y="138" fill="var(--dg-ink-soft)">shrinking</text>
  <rect class="d-stroke" x="284" y="180" width="192" height="54" rx="7" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-s d-tc" x="380" y="212" fill="var(--dg-a)">Checkout pilet</text>
  <path class="d-dash" d="M480 138 H516" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M512 131 L526 138 L512 145 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-h d-tc" x="628" y="30" fill="var(--dg-ink)">Stage N</text>
  <rect class="d-stroke" x="532" y="42" width="192" height="26" rx="6" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-s d-tc" x="628" y="59" fill="var(--dg-brand)">App shell</text>
  <rect class="d-stroke" x="532" y="76" width="192" height="48" rx="7" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-s d-tc" x="628" y="105" fill="var(--dg-a)">Checkout</text>
  <rect class="d-stroke" x="532" y="129" width="192" height="48" rx="7" fill="var(--dg-b-bg)" stroke="var(--dg-b)"/>
  <text class="d-s d-tc" x="628" y="158" fill="var(--dg-b)">Catalog</text>
  <rect class="d-stroke" x="532" y="182" width="192" height="48" rx="7" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-s d-tc" x="628" y="211" fill="var(--dg-c)">Account · legacy retired</text>
</svg>
</div>
<figcaption>The legacy app enters as a single pilet and is strangled feature-by-feature until only independent pilets remain.</figcaption>
</figure>

## Step 1: Create a thin app shell

```bash
npm init piral-instance@latest -- --target my-portal --bundler webpack5
```

Add your existing global layout and auth mechanism. Leave the feed empty for now.

## Step 2: Wrap the existing app as a pilet

```tsx
// pilet-legacy/src/index.tsx
import type { PiletApi } from 'my-portal';

// Import your existing React app root component
// Remove the top-level <BrowserRouter> — Piral provides it
import { LegacyApp } from '../existing-app/src/LegacyApp';

export function setup(api: PiletApi) {
  // Catch-all: the legacy app handles all routes internally
  api.registerPage('/*', LegacyApp);
}
```

Remove the top-level `<BrowserRouter>` from `LegacyApp` — Piral's shell provides routing. Keep any internal `<Routes>` for nested navigation.

## Step 3: Validate

Build and publish the legacy pilet. Verify the full existing application works through the new shell. Fix CSS scoping issues if global styles conflict.

## Step 4: Extract features team by team

1. Create a new pilet for a feature (`pilet-checkout`)
2. Move the feature's components into it
3. Register the feature's routes in the new pilet
4. Remove those routes from the legacy pilet
5. Both teams now deploy independently

Repeat for each feature at each team's own pace.

## Step 5: Retire the legacy pilet

Once all features are extracted, disable the legacy pilet in the feed.

## Handling CSS

Scope all legacy global styles to avoid conflicts:

```tsx
const LegacyApp = () => (
  <div className="legacy-app-scope">
    <ActualLegacyApp />
  </div>
);
```

```css
.legacy-app-scope .button { /* scoped legacy styles */ }
```

## Timeline expectations

| App size | Teams | Duration |
|---|---|---|
| Small (< 20 routes) | 1–2 | 4–8 weeks |
| Medium (20–80 routes) | 3–6 | 3–6 months |
| Large (80+ routes) | 7+ | 9–18 months |

The upfront investment (stages 1–3) typically takes 1–3 weeks regardless of app size.

---
title: Piral Plugins
description: How to type and build a plugin that extends the Pilet API.
---

# Piral Plugins

A `PiralPlugin` is a factory function that adds methods to the Pilet API for all pilets. It is the primary extension mechanism for app shell authors.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The app shell constructs the Pilet API from core methods plus plugins; every pilet receives that same API in setup and uses it as the glue to interact with the shell and the wider application.">
  <rect class="d-fill" x="0" y="0" width="760" height="300" rx="14" fill="var(--dg-canvas)"/>

  <rect class="d-stroke" x="34" y="58" width="216" height="150" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="142" y="86" fill="var(--dg-brand)">App Shell</text>
  <text class="d-m d-tc" x="142" y="106" fill="var(--dg-ink-soft)">createInstance({ plugins })</text>
  <rect class="d-fill" x="52" y="120" width="180" height="22" rx="5" fill="var(--dg-frame)"/>
  <text class="d-s d-tc" x="142" y="135" fill="var(--dg-ink-soft)">core API + plugins</text>
  <text class="d-s d-tc" x="142" y="172" fill="var(--dg-ink-soft)">builds &amp; extends the API</text>

  <path class="d-dash" d="M250 150 H312" stroke="var(--dg-brand)"/>
  <path class="d-fill" d="M309 144 L320 150 L309 156 Z" fill="var(--dg-brand)"/>
  <text class="d-s d-tc" x="285" y="140" fill="var(--dg-brand)">constructs</text>

  <rect class="d-stroke-2" x="322" y="64" width="132" height="172" rx="10" fill="var(--dg-frame)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="388" y="90" fill="var(--dg-brand)">Pilet API</text>
  <text class="d-s d-tc" x="388" y="106" fill="var(--dg-ink-soft)">the glue</text>
  <rect class="d-fill" x="334" y="114" width="108" height="20" rx="4" fill="var(--dg-brand-bg)"/>
  <text class="d-m d-tc" x="388" y="128" fill="var(--dg-brand)">registerPage</text>
  <rect class="d-fill" x="334" y="138" width="108" height="20" rx="4" fill="var(--dg-brand-bg)"/>
  <text class="d-m d-tc" x="388" y="152" fill="var(--dg-brand)">showNotification</text>
  <rect class="d-fill" x="334" y="162" width="108" height="20" rx="4" fill="var(--dg-brand-bg)"/>
  <text class="d-m d-tc" x="388" y="176" fill="var(--dg-brand)">emit · on</text>
  <rect class="d-fill" x="334" y="186" width="108" height="20" rx="4" fill="var(--dg-brand-bg)"/>
  <text class="d-m d-tc" x="388" y="200" fill="var(--dg-brand)">setData · …</text>
  <text class="d-s d-tc" x="388" y="222" fill="var(--dg-ink-soft)">typed contract</text>

  <rect class="d-stroke" x="522" y="62" width="200" height="70" rx="9" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h" x="540" y="90" fill="var(--dg-a)">Pilet A</text>
  <text class="d-m" x="540" y="112" fill="var(--dg-ink-soft)">setup(api)</text>
  <rect class="d-stroke" x="522" y="160" width="200" height="70" rx="9" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-h" x="540" y="188" fill="var(--dg-c)">Pilet B</text>
  <text class="d-m" x="540" y="210" fill="var(--dg-ink-soft)">setup(api)</text>

  <path class="d-dash" d="M522 100 L460 138" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M466 130 L454 142 L470 142 Z" fill="var(--dg-ink-soft)"/>
  <path class="d-dash" d="M522 192 L460 166" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M468 160 L454 166 L466 174 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="500" y="112" fill="var(--dg-ink-soft)">uses</text>
  <text class="d-s d-tc" x="500" y="188" fill="var(--dg-ink-soft)">uses</text>
</svg>
</div>
<figcaption>The app shell builds the Pilet API (core methods plus plugins). Every pilet receives that same API in <code>setup</code> and uses it as the glue — all interaction with the shell and the wider application flows through it.</figcaption>
</figure>

## What plugins are for

Plugins live **only in the app shell** — a pilet never installs or references one. A plugin has exactly one job: to **extend the Pilet API**. That is the entire reason any plugin exists. When the app shell registers a plugin, the methods it returns are merged into the `api` object every pilet receives in `setup`.

This is worth stressing, because it is a common misconception: a plugin is *not* what makes a feature work. The underlying capability — fetching data, authenticating, talking to a backend — works with or without a plugin. The plugin merely exposes a convenient, typed entry point for that capability on the Pilet API.

`piral-oidc` is a good example. It exists to surface OIDC concerns — access tokens, the current user, sign-in and sign-out — to pilets through the API (for instance `api.getAccessToken()`). You do **not** need it to use OIDC, or to have authentication at all: the app shell can authenticate however it likes and never install the plugin. You add `piral-oidc` only when you want pilets to *consume* those tokens through the Pilet API. The same is true of every official plugin — each one is purely a typed extension of the API surface.

## Type signature

```ts
type PiralPlugin<TApi = {}> =
  (context: GlobalStateContext) =>
    (api: PiletApi, meta: PiletMetadata) => TApi;
```

Three layers:

1. **Outer function** — receives the global state context (for reading/writing app state)
2. **Inner function** — called once per pilet at load time, receives the base API and pilet metadata
3. **Return value** — the methods merged into the pilet's `api` object

## Typed plugin example

```ts
import { PiralPlugin } from 'piral-core';

// 1. Define the API extension interface
export interface AnalyticsApi {
  trackEvent(name: string, props?: Record<string, unknown>): void;
  trackPageView(path: string): void;
}

// 2. Augment the global PiletApi type
declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends AnalyticsApi {}
}

// 3. Implement
export function createAnalyticsApi(): PiralPlugin<AnalyticsApi> {
  return (_context) => (_api, meta) => ({
    trackEvent(name, props) {
      analytics.track(name, { ...props, pilet: meta.name, version: meta.version });
    },
    trackPageView(path) {
      analytics.page(path, { pilet: meta.name });
    },
  });
}
```

Register in the shell:

```tsx
const instance = createInstance({
  plugins: [createAnalyticsApi()],
});
```

All pilets now have `api.trackEvent('button-click')` — typed.

## Accessing global state

```ts
export function createThemeApi(): PiralPlugin {
  return (context) => () => ({
    setTheme(theme: 'light' | 'dark') {
      context.dispatch(state => ({ ...state, theme }));
    },
    getTheme() {
      return context.readState(s => (s as any).theme ?? 'light');
    },
  });
}
```

## Async plugin initialisation

```ts
export function createRemoteConfigApi(configUrl: string): PiralPlugin {
  let config: Record<string, string> = {};
  const ready = fetch(configUrl).then(r => r.json()).then(c => { config = c; });

  return () => () => ({
    async getConfig(key: string) {
      await ready;
      return config[key];
    },
  });
}
```

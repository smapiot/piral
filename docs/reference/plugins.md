---
title: Official plugins
description: The official Piral plugins — the standard set bundled with the piral package, plus the additional plugins and framework converters developed in the Piral monorepo.
---

# Official plugins

A plugin's only job is to **extend the Pilet API**, and plugins live **only in the app shell** — see [PiralPlugin](/api/piral-plugin) for what that means. Each plugin below adds typed methods to the `api` object every pilet receives; none of them is required to *have* a capability, they just expose it to pilets.

There are two tiers of official plugins:

- **Standard plugins** — bundled in the `piral-ext` package, which ships as part of the all-in-one [`piral`](/reference/piral-packages) package. If you scaffolded with `piral`, these are already available.
- **Additional official plugins** — developed and published from the [Piral monorepo](https://github.com/smapiot/piral) but installed individually. Add them when you need them (and register them explicitly on `piral-core`).

Install a plugin in the app shell and add its factory to `createInstance({ plugins: [...] })`. Each plugin then surfaces its methods on `PiletApi`, fully typed.

## Standard plugins

These ship in `piral-ext` and are included with the `piral` package. On `piral-core`, install and register the ones you want.

| Package | Adds to the Pilet API | Purpose |
|---|---|---|
| `piral-menu` | `registerMenu` | Navigation entries rendered into named menu zones (`<Menu type="…" />`). |
| `piral-notifications` | `showNotification` | Toast notifications (`<Notifications />`). |
| `piral-modals` | `registerModal`, `showModal` | Named modal dialogs (`<Modals />`). |
| `piral-dashboard` | `registerTile` | Tiles on a dashboard page. |
| `piral-feeds` | `createConnector` | Reactive data connectors with loading/refresh handling. |
| `piral-translate` | `translate`, `setTranslations` | Localization / i18n for pilets. |

## Additional official plugins

All of these are official (developed in the Piral monorepo); install and register them as needed.

### App & UX features

| Package | Purpose |
|---|---|
| `piral-forms` | Managed form state for pilet forms. |
| `piral-search` | Global search providers contributed by pilets. |
| `piral-breadcrumbs` | Breadcrumb entries contributed by pilets. |
| `piral-update` | Notify users when pilets have updates available. |
| `piral-page-layouts` | Named page layouts that pilets can opt into. |
| `piral-containers` | Per-pilet state containers. |
| `piral-tracking` | User activity / interaction tracking hooks. |

### Data access

| Package | Purpose |
|---|---|
| `piral-fetch` | A small typed `fetch` wrapper on the API. |
| `piral-axios` | A shared Axios instance on the API. |
| `piral-urql` | GraphQL access via [urql](https://formidable.com/open-source/urql/). |

### Authentication

| Package | Purpose |
|---|---|
| `piral-auth` | Generic token-based user/session info. |
| `piral-oidc` | OpenID Connect tokens and flows. |
| `piral-oauth2` | OAuth 2 tokens and flows. |
| `piral-adal` | Microsoft Entra ID / Azure AD tokens. |

:::tip Auth plugins only surface tokens
As described in [PiralPlugin](/api/piral-plugin), these plugins exist purely to bring tokens (and related helpers) to the Pilet API. You do **not** need any of them to implement authentication — the app shell can authenticate on its own. Add one only when pilets should consume tokens through the API. See [Authentication](/guides/authentication).
:::

### State & performance

| Package | Purpose |
|---|---|
| `piral-redux` | Redux store integration. |
| `piral-lazy` | Lazily load pilets and resources. |
| `piral-million` | [Million.js](https://million.dev) integration for faster React rendering. |

## Framework converters

Converters let a pilet be written in a framework other than React. A converter is **not** installed as a shell plugin — the pilet imports it from the converter's standalone `/convert` submodule (e.g. `piral-svelte/convert`) and wraps its components with the matching `from…` helper. See [Multi-framework pilets](/guides/multi-framework) and [Creating a converter](/reference/creating-a-converter).

| Package | Framework |
|---|---|
| `piral-ng` | Angular |
| `piral-ngjs` | AngularJS (1.x) |
| `piral-vue` | Vue 2 |
| `piral-vue-3` | Vue 3 |
| `piral-react` | React (isolated/secondary React version) |
| `piral-react-15` | React 15 |
| `piral-preact` | Preact |
| `piral-solid` | Solid |
| `piral-svelte` | Svelte |
| `piral-litel` | Lit / LitElement |
| `piral-mithril` | Mithril |
| `piral-hyperapp` | Hyperapp |
| `piral-aurelia` | Aurelia |
| `piral-inferno` | Inferno |
| `piral-riot` | Riot |
| `piral-cycle` | Cycle.js |
| `piral-elm` | Elm |
| `piral-ember` | Ember |
| `piral-blazor` | Blazor / .NET ([Piral.Blazor](https://blazor.piral.io)) |

Plain **web components** need no converter — a custom element is already a DOM element, so it can be used directly.

## Tooling packages (not Pilet API plugins)

Some official `piral-*` packages are *not* Pilet API plugins and don't belong in `createInstance`:

- **Bundler & CLI plugins** — `piral-cli-webpack5`, `piral-cli-esbuild`, `piral-cli-rspack`, `piral-cli-vite`, `piral-cli-parcel2`, `piral-cli-xbuild`, plus helpers like `piral-cli-local-feed` and `piral-cli-dotenv`. These extend the CLI; see the [CLI reference](/reference/cli).
- **Utility libraries** — e.g. `piral-ssr-utils`, `piral-hooks-utils`, `piral-systemjs-utils`. These are plain helper libraries you import where needed.

## Finding the complete, current list

New plugins are added over time. The authoritative, always-up-to-date list is the [`src/plugins`](https://github.com/smapiot/piral/tree/main/src/plugins) and [`src/converters`](https://github.com/smapiot/piral/tree/main/src/converters) folders in the Piral monorepo, and the `piral-*` packages published on [npm](https://www.npmjs.com/search?q=piral-).

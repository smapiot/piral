---
title: Project structure
description: Conventions for app shell and pilet projects.
---

# Project structure

## App shell

```
my-app-shell/
├── public/
│   └── index.html          ← HTML entry point
├── src/
│   ├── index.tsx           ← createInstance() + render
│   └── layout/
│       ├── DefaultLayout.tsx
│       ├── NotFoundPage.tsx
│       └── ErrorPage.tsx
├── piral.json              ← app shell build/tooling config
├── package.json            ← deps + importmap (central sharing)
└── tsconfig.json
```

`piral.json` configures the CLI for this shell — the entry file, bundler, dev port, and public URL. It's optional (sensible defaults apply) but it's where you tune how the shell builds and debugs. See the [configuration reference](/reference/configuration#piraljson).

### `src/index.tsx`

The entry point creates the Piral instance and renders it:

```tsx
import { createInstance, Piral } from 'piral';
import { createMenuApi } from 'piral-menu';
import { createNotificationsApi } from 'piral-notifications';
import * as React from 'react';
import { render } from 'react-dom';
import { DefaultLayout } from './layout/DefaultLayout';
import { NotFoundPage } from './layout/NotFoundPage';

const instance = createInstance({
  state: {
    components: { Layout: DefaultLayout },
    errorComponents: { not_found: NotFoundPage },
  },
  plugins: [createMenuApi(), createNotificationsApi()],
  async requestPilets() {
    const res = await fetch('https://feed.example.com/api/v1/pilets', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return (await res.json()).items;
  },
});

render(<Piral instance={instance} />, document.querySelector('#app'));
```

### `package.json` — importmap for central sharing

Declare centrally shared dependencies here so all pilets receive them as externals:

```json
{
  "name": "my-app-shell",
  "importmap": {
    "imports": {
      "react": "",
      "react-dom": "",
      "react-router-dom": "",
      "my-design-system": ""
    }
  }
}
```

## Pilet

```
my-pilet/
├── src/
│   ├── index.tsx           ← setup(api) export
│   ├── pages/
│   │   └── FeaturePage.tsx
│   └── components/
│       └── FeatureCard.tsx
├── pilet.json              ← pilet build/tooling config
├── package.json            ← target shell + importmap (side-bundles)
└── tsconfig.json
```

`pilet.json` is the pilet-side counterpart to `piral.json`: it records which app shell this pilet targets, the bundler, dev port, pilet schema, and an optional feed URL for `pilet publish`. See the [configuration reference](/reference/configuration#piletjson).

### `src/index.tsx`

Every pilet exports `setup`:

```tsx
import type { PiletApi } from 'my-app-shell';
import { FeaturePage } from './pages/FeaturePage';

export function setup(api: PiletApi) {
  api.registerPage('/my-feature', FeaturePage);
  api.registerMenu(() => <a href="/my-feature">My Feature</a>);
}
```

### `package.json` — pilet fields

```json
{
  "name": "pilet-my-feature",
  "version": "1.0.0",
  "peerDependencies": {
    "my-app-shell": "*"
  },
  "devDependencies": {
    "my-app-shell": "^1.0.0"
  },
  "piral": {
    "name": "my-app-shell"
  },
  "importmap": {
    "inherit": ["my-app-shell"],
    "imports": {
      "date-fns": "",
      "my-charting-lib": ""
    }
  }
}
```

Key fields:

| Field | Purpose |
|---|---|
| `peerDependencies["my-app-shell"]` | Declares which shell this pilet targets |
| `devDependencies["my-app-shell"]` | Installs the emulator locally |
| `piral.name` | Associates the pilet with a specific shell package |
| `importmap.inherit` | Inherits the app shell's centrally shared dependencies |
| `importmap.imports` | Declares pilet-level shared dependencies (side-bundles) |

:::warning Don't forget `inherit`
`"inherit": ["my-app-shell"]` is what tells the pilet to **reuse the dependencies the app shell already shares** (React, the router, your design system) instead of bundling its own copies. It's technically optional, but without it a pilet will bundle packages like React itself — bloating the bundle and risking duplicate React instances on the page. Scaffolded pilets include it by default; keep it.
:::

## Monorepo layout

For teams managing multiple pilets:

```
my-portal/
├── packages/
│   ├── app-shell/
│   ├── pilet-checkout/
│   ├── pilet-catalog/
│   └── pilet-account/
├── package.json           ← workspace root
└── pnpm-workspace.yaml
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
```

In each pilet's `package.json`, reference the local app shell directly:

```json
{
  "devDependencies": {
    "app-shell": "workspace:*"
  }
}
```

`workspace:*` tells pnpm to use the local workspace copy — no npm publish needed during development. See [Monorepo setup](/advanced/monorepo) for a complete configuration.

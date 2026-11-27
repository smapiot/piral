---
title: App shell
description: What the app shell owns, how to configure it, and what to keep out of it.
---

# App shell

The app shell is the host application — the only thing end users download directly. It provides the stage that all pilets perform on.

## The golden rule

> The app shell should contain only things that are genuinely universal. Feature logic belongs in pilets.

Every change to the app shell is a full deploy that affects all users and requires pilet teams to eventually update their emulators. Keep it thin, stable, and focused on infrastructure.

## What the app shell owns

| Concern | Notes |
|---|---|
| **Global layout** | Navigation chrome, header, footer, page containers |
| **Authentication** | Login flow, token management, session lifecycle |
| **Router** | The top-level React Router instance — pilets register routes into it |
| **Central shared deps** | React, ReactDOM, React Router — provided to all pilets as externals |
| **Plugin runtime** | Notifications, modals, dashboard tiles — via installed plugins |
| **Extension registry** | The system that connects extension slots to registered components |
| **Error boundaries** | Isolating pilet failures from the rest of the app |
| **Feed configuration** | Which URL to call, how to pass auth headers |

## Creating an instance

```tsx
import { createInstance, Piral } from 'piral';
import { createMenuApi } from 'piral-menu';
import { createNotificationsApi } from 'piral-notifications';
import { createModalsApi } from 'piral-modals';
import * as React from 'react';
import { render } from 'react-dom';
import { AppLayout } from './layout/AppLayout';
import { NotFoundPage } from './layout/NotFoundPage';

const instance = createInstance({
  state: {
    components: {
      Layout: AppLayout,
    },
    errorComponents: {
      not_found: NotFoundPage,
      unknown: ({ error }) => <div>Something went wrong: {error.message}</div>,
    },
  },
  plugins: [
    createMenuApi(),
    createNotificationsApi(),
    createModalsApi(),
  ],
  async requestPilets() {
    const token = getToken(); // your auth mechanism
    const res = await fetch(FEED_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return (await res.json()).items;
  },
});

render(<Piral instance={instance} />, document.querySelector('#app'));
```

## Layout components

Override these in `state.components`:

**`Layout`** — The outermost wrapper. Everything visible on every page. The `children` prop is where pilet pages render.

```tsx
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="app">
    <AppHeader />
    <main>{children}</main>
    <AppFooter />
  </div>
);
```

**`Router`** — Provides a React Router context. Defaults to `BrowserRouter`.

**`RouteSwitch`** — Renders the page component matching the current URL. Wrap with `Suspense` here to handle lazy-loaded pilet pages gracefully.

**Error components** — Provide fallback UIs for each error type: `not_found`, `unknown`, `loading`, `page`.

## Centrally shared dependencies

Declare packages that all pilets receive as externals in the app shell's `package.json`:

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

These are pure externals — pilets never bundle them. The shell provides the running instance at runtime.

:::info Pilets can also share dependencies
This central importmap is for packages that *all* pilets need. For domain-specific packages, pilets can declare their own `importmap` entries and share them with each other without involving the app shell. See [Pilets — sharing dependencies](/concepts/pilets#sharing-dependencies).
:::

## Plugins

Plugins extend the Pilet API. Install them as packages and add to `createInstance`:

```bash
npm install piral-menu piral-notifications piral-modals piral-dashboard piral-feeds
```

These are ordinary npm packages added to the app shell — pilet developers never install them directly. They surface in pilets automatically through the typed `PiletApi`.

```tsx
import { createDashboardApi } from 'piral-dashboard';
import { createFeedsApi } from 'piral-feeds';

const instance = createInstance({
  plugins: [
    createMenuApi(),
    createNotificationsApi(),
    createModalsApi(),
    createDashboardApi(),
    createFeedsApi(),
  ],
});
```

Each plugin adds typed methods to `PiletApi`. After adding `piral-notifications`, pilets get `api.showNotification(...)`. TypeScript types update automatically.

## Building

```bash
npm start          # development server
npm run build      # production build
```

The build produces:

- `dist/release/` — Static files ready to deploy to a CDN or static host
- `dist/emulator/my-app-shell-x.y.z.tgz` — The emulator package to publish to npm

Publish the emulator so pilet teams can develop locally:

```bash
npm publish dist/emulator/my-app-shell-1.0.0.tgz
# or
npx piral publish --type emulator
```

## Common mistakes to avoid

**Don't put feature components in the app shell.** If it's specific to one team's domain, it should be a pilet.

**Don't hardcode pilet lists.** That's the feed service's job. The app shell should only know the feed URL.

**Don't define routes in the app shell.** Pilets register their own routes.

**Don't version-lock the shell to specific pilets.** The whole point is they evolve independently.

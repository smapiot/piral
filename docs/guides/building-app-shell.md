---
title: Building your app shell
description: A production-ready app shell from scratch.
---

# Building your app shell

The app shell is the host every user loads first. It owns the layout, navigation, authentication, the shared runtime, and the logic that discovers and mounts pilets — but no feature logic of its own. This guide takes a shell from an empty scaffold to a publishable emulator. The guiding principle throughout: keep it thin, because every change here affects all users and all pilet teams.

## Scaffold

```bash
npm init piral-instance@latest -- --target my-portal --bundler webpack5
cd my-portal
npm start   # opens http://localhost:1234
```

No global install required — the initializer adds `piral-cli` and the bundler plugin as local dev dependencies, and wires up `npm start` / `npm run build` for you.

## Configure the feed

`createInstance` is the heart of the shell. You hand it three things: which structural components to use (`state`), which plugins extend the Pilet API, and a `requestPilets` function that returns the pilets to load. Here `requestPilets` fetches the list from a feed and forwards the user's token, so the feed can decide which pilets that user may see:

`src/index.tsx`:

```tsx
import { createInstance, Piral } from 'piral';
import { createMenuApi } from 'piral-menu';
import { createNotificationsApi } from 'piral-notifications';
import * as React from 'react';
import { render } from 'react-dom';
import { AppLayout } from './layout/AppLayout';
import { NotFoundPage } from './layout/NotFoundPage';

const FEED_URL = process.env.NODE_ENV === 'production'
  ? 'https://feed.example.com/api/v1/pilets'
  : 'https://feed-dev.example.com/api/v1/pilets';

const instance = createInstance({
  state: {
    components: { Layout: AppLayout },
    errorComponents: { not_found: NotFoundPage },
  },
  plugins: [createMenuApi(), createNotificationsApi()],
  async requestPilets() {
    const token = sessionStorage.getItem('auth_token');
    const res = await fetch(FEED_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return (await res.json()).items;
  },
});

render(<Piral instance={instance} />, document.querySelector('#app'));
```

## Layout component

The `Layout` is the frame rendered around every page — header, navigation, footer. Its `children` are where the current pilet's page appears, and it's the natural home for shell-wide plugin outlets like `<Menu>` (navigation zones pilets register into) and `<Notifications>` (where toasts surface):

```tsx
import * as React from 'react';
import { Menu, Notifications } from 'piral';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="app">
    <header>
      <a href="/">My Portal</a>
      <nav><Menu type="general" /></nav>
      <div><Menu type="user" /></div>
    </header>
    <main>{children}</main>
    <Notifications />
  </div>
);
```

## Central shared dependencies

Anything listed in the shell's `importmap` is provided to every pilet as an external: pilets compile against these packages but never bundle them, so React, the router, and your design system exist exactly once on the page. Put the truly universal, singleton-sensitive packages here.

In `package.json`:

```json
{
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

## Build and publish the emulator

```bash
npm run build
# dist/release/  → deploy to production
# dist/emulator/ → share with pilet developers

npm publish dist/emulator/my-portal-1.0.0.tgz
```

The emulator is a normal npm package, so any registry works — public npm, a private/company registry, or a local one (pass `--registry` to `npx piral publish`). If you'd rather not run a registry at all, build an emulator website (`npx piral build --type emulator-website`) and let pilets debug against its URL. See [Distributing the emulator](/concepts/emulator#distributing-the-emulator).

:::warning SPA routing
Configure your host to serve `index.html` for all non-asset routes:
- Nginx: `try_files $uri /index.html;`
- Netlify `_redirects`: `/* /index.html 200`
:::

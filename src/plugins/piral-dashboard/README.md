[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Dashboard](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-dashboard.svg?style=flat)](https://www.npmjs.com/package/piral-dashboard) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is plugin that only has a peer dependency to `piral-core`. What `piral-dashboard` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

## Why and When

Many portal and tool applications come with a dashboard view that easily allows getting an overview over the most interesting pieces of functionality and information. This plugin allows creating dashboard pages that contain components registered as "tiles". The layout and behavior of these can be fully configured. The standard options include variable rows, columns, and resize properties.

Alternatives: Use extensions to define this generically without the need for a plugin. Place each dashboard in its own extension slot registering components dynamically for these.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/ycZLPRaoLAQ)

## Documentation

The following functions are brought to the Pilet API.

### `registerTile()`

Adds the definition of a tile to the app shell. Optionally specifies display characteristics like the initial rows, initial columns, or if the tile can be resized by the user.

If the first argument is a string a named tile is registered. A named tile can also be removed.

### `unregisterTile()`

Removes a tile from the app shell. This requires a named tile.

## Usage

::: summary: For pilet authors

You can use the `registerTile` function from the Pilet API to add a new tile in the app shell.

**Note**: When the first argument is a string we call it a *named* tile.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyTile } from './MyTile';

export function setup(piral: PiletApi) {
  piral.registerTile(MyTile);
}
```

You can use the `unregisterTile` function from the Pilet API to remove a previously added tile from the app shell.

**Note**: You'll need to have added a *named* tile in order to be able to remove it.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyTile } from './MyTile';

export function setup(piral: PiletApi) {
  // register with a name
  piral.registerTile('first', MyTile);
  // and unregister; maybe some time later?
  piral.unregisterTile('first');
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createDashboardApi` from the `piral-dashboard` package.

```ts
import { createDashboardApi } from 'piral-dashboard';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createDashboardApi()],
  // ...
});
```

Via the options the `defaultPreferences` and the global/initially available `tiles` can be defined.

Consider for example:

```ts
const instance = createInstance({
  // important part
  plugins: [createDashboardApi({
    defaultPreferences: {
      initialColumns: 2,
      initialRows: 2,
      resizable: true,
    },
    tiles: [
      {
        component: MyTeaserTile,
        preferences: {
          initialColumns: 2,
          initialRows: 4,
        },
      },
    ],
  })],
  // ...
});
```

By default, the dashboard is located at the homepage (`/`). You can change this via the `routes` setting:

```ts
const instance = createInstance({
  // important part
  plugins: [createDashboardApi({
    routes: ['/dashboard'],
  })],
  // ...
});
```

Or alternatively, don't use any route for it and just reference the `Dashboard` component on any page or within the layout.

```ts
// for the instance
const instance = createInstance({
  // important part
  plugins: [createDashboardApi({
    routes: [],
  })],
  // ...
});


// in some component, maybe even in the layout
import { Dashboard } from 'piral-dashboard';

// then use: <Dashboard />
```

### Customizing

You can customize the available tiles and their options.

```ts
import type {} from 'piral-dashboard';

declare module 'piral-dashboard/lib/types' {
  interface PiralCustomTilePreferences {
    category?: string;
  }
}

// now registerTile(() => null, { category: 'general' }) is strongly typed in pilets
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

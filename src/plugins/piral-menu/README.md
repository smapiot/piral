[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Menu](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-menu.svg?style=flat)](https://www.npmjs.com/package/piral-menu) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-menu` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` to bring a simplified menu integration from your pilets to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `registerMenu()`

Adds the definition of a menu item to the app shell. Optionally specifies the type of menu where the item should be shown.

If the first argument is a string a named menu item is registered. A named menu item can also be removed.

### `unregisterMenu()`

Removes a menu item from the app shell. This requires a named menu item.

## Usage

> For authors of pilets

You can use the `registerMenu` function from the Pilet API to add a new menu item in the app shell.

**Note**: When the first argument is a string we call it a *named* menu item.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyTile } from './MyTile';

export function setup(piral: PiletApi) {
  piral.registerMenu(MyTile);
}
```

You can use the `unregisterMenu` function from the Pilet API to remove a previously added menu item from the app shell.

**Note**: You'll need to have added a *named* menu item in order to be able to remove it.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyTile } from './MyTile';

export function setup(piral: PiletApi) {
  // register with a name
  piral.registerMenu('first', MyTile);
  // and unregister; maybe some time later?
  piral.unregisterMenu('first');
}
```

## Setup and Bootstrapping

> For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createMenuApi` from the `piral-menu` package.

```ts
import { createMenuApi } from 'piral-menu';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createMenuApi()],
  // ...
});
```

Via the options the `defaultSettings` and the global / initially available menu `items` can be defined.

For example:

```ts
const instance = createInstance({
  // important part
  extendApi: [createMenuApi({
    defaultSettings: {
      type: 'admin',
    },
    items: [
      {
        component: HomeMenuItem,
      },
    ],
  })],
  // ...
});
```

### Customizing

You can customize the available dialogs and their options.

```ts
import 'piral-menu';

declare module 'piral-menu/lib/types' {
  interface PiralCustomMenuSettings {
    category?: string;
  }
}

// now registerMenu(() => null, { category: 'general' }) is strongly typed in pilets
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

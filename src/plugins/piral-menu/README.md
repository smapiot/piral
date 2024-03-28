[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Menu](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-menu.svg?style=flat)](https://www.npmjs.com/package/piral-menu) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-menu` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` to bring a simplified menu integration from your pilets to your Piral instance.

## Why and When

If you are using one or many global menu(s) on your page, `piral-menu` allows you to register menu item components for those global menus from your pilets. Menu items are registered in the application's global state and can be rendered by an app shell via a `Menu` component. `piral-menu` supports multiple menu types via a `type` attribute, for example for a `general` menu or a `user` menu. Using this plugin only makes sense if your page uses a global menu.

Alternative: You could simply use dedicated extension slots for each navigation items. The downside of this approach is the discoverability and the type safety.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/9biswaIhX7Y)

## Documentation

The following functions are brought to the Pilet API.

### `registerMenu()`

Adds the definition of a menu item to the app shell. Optionally specifies the type of menu where the item should be shown.

If the first argument is a string, a named menu item is registered. A named menu item can also be removed.

### `unregisterMenu()`

Removes a menu item from the app shell. This requires a named menu item.

## Usage

::: summary: For pilet authors

You can use the `registerMenu` function from the Pilet API to add a new menu item in the app shell.

**Note**: If the first argument is a string, we call it a *named* menu item.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyMenuItem } from './MyMenuItem';

export function setup(piral: PiletApi) {
  // Register the `MyMenuItem` component for the default menu:
  piral.registerMenu(MyMenuItem);

  // Register the `MyMenuItem` component for the special 'user' menu:
  piral.registerMenu(MyMenuItem, { type: 'user' });
}
```

You can use the `unregisterMenu` function from the Pilet API to remove a previously added menu item from the app shell.

**Note**: You'll need to have added a *named* menu item in order to be able to remove it.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyTile } from './MyMenuItem';

export function setup(piral: PiletApi) {
  // Register the menu item with a unique name:
  piral.registerMenu('first', MyMenuItem);

  // And, at some later time, unregister it via that name:
  piral.unregisterMenu('first');
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself, you'll need to import `createMenuApi` from the `piral-menu` package.

```ts
import { createMenuApi } from 'piral-menu';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createMenuApi()],
  // ...
});
```

Via the options, `defaultSettings` and the global/initially available menu `items` can be defined.

For example:

```ts
const instance = createInstance({
  // important part
  plugins: [createMenuApi({
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

You can customize the available menu settings.

```ts
import type {} from 'piral-menu';

declare module 'piral-menu/lib/types' {
  interface PiralCustomMenuSettings {
    category?: string;
  }
}

// now registerMenu(() => null, { category: 'general' }) is strongly typed in pilets
```

You can also add new menu types to the `type` selection.

```ts
import 'piral-menu';

declare module 'piral-menu/lib/types' {
  interface PiralCustomMenuTypes {
    'left-footer': {};
  }
}

// now registerMenu(() => null, { type: 'left-footer' }) is strongly typed in pilets
```

This also allows you to add further settings, which you'll find nice to have:

```ts
import 'piral-menu';

declare module 'piral-menu/lib/types' {
  interface PiralCustomMenuTypes {
    'left-footer': {
      caption: string;
    };
  }
}

// now registerMenu(() => null, { type: 'left-footer', caption: 'Foo' }) is strongly typed in pilets
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

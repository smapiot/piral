[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Tracker](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-tracker.svg?style=flat)](https://www.npmjs.com/package/piral-tracker) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is plugin that only has a peer dependency to `piral-core`. What `piral-tracker` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

## Why and When

Sometimes you want to register components that should always be active, e.g., for reporting purposes, to show up periodically, or to make certain validations. Either way, out of the box you could do that via some extension, but a more convenient way to integrate such a component could be via a dedicated API.

This plugin gives you such an API and a ready-to-use component that you can integrate on all pages (or maybe even in your layout) where these registered trackers should be active.

## Documentation

The following functions are brought to the Pilet API.

### `registerTracker()`

Adds the definition of a tracker to the app shell.

If the first argument is a string a named tracker is registered. A named tracker can also be removed.

### `unregisterTracker()`

Removes a tracker from the app shell. This requires a named tracker.

## Usage

::: summary: For pilet authors

You can use the `registerTracker` function from the Pilet API to add a new tracker in the app shell.

**Note**: When the first argument is a string we call it a *named* tracker.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

const MyTracker = () => {
  return null;
};

export function setup(piral: PiletApi) {
  // 👇 Registers a named tracker called "my-tracker"
  piral.registerTracker('my-tracker', MyTracker);

  // 👇 Registers an anonymous tracker
  piral.registerTracker(MyTracker);
}
```

You can use the `unregisterTracker` function from the Pilet API to remove a previously added tracker from the app shell.

**Note**: You'll need to have added a *named* tracker in order to be able to remove it.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyTracker } from './MyTracker';

export function setup(piral: PiletApi) {
  // register with a name
  piral.registerTracker('first', MyTracker);
  // and unregister; maybe some time later?
  piral.unregisterTracker('first');
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createTrackerApi` from the `piral-tracker` package.

```ts
import { createTrackerApi } from 'piral-tracker';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createTrackerApi()],
  // ...
});
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Debug Utils](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-debug-utils.svg?style=flat)](https://www.npmjs.com/package/piral-debug-utils) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a utility library that can be used for debugging Piral instances.

What `piral-debug-utils` offers are utilities to provide reach debugging tools for the browser. This forms the basis for UI tooling such as the [Piral Inspector](https://github.com/smapiot/piral-inspector).

## Installation

This should only be installed as a dependency (`dependencies`), but usually guarded to be active (or included in the bundle) only for development/emulation purposes (i.e., when developing pilets).

If you'd love to use yarn:

```sh
yarn add piral-debug-utils
```

Alternatively, npm works reliably, too:

```sh
npm i --save piral-debug-utils
```

## Usage

The utilities should be used as follows.

We can use the `installPiralDebug` function to install the debug helper object globally on `window`. It is called `dbg:piral`.

Usually, we'd guard it to make it only accessible under development conditions.

```js
// if we build the debug version of piral (debug and emulator build)
if (process.env.DEBUG_PIRAL) {
  const { installPiralDebug } = require('piral-debug-utils');

  installPiralDebug({
    getDependencies,
    fireEvent,
    getGlobalState,
    getPilets,
    getExtensions,
    getRoutes,
    integrate,
    addPilet,
    removePilet,
    updatePilet,
    navigate,
  });
}
```

We can use the `installPiletEmulator` function to modify (or not) the provided `PiletRequester`, which will be handed over later to the `createInstance` options or `piral-base` directly.

Usually, we'd guard it to make it only accessible under emulator conditions.

```js
// if we want to change `requestPilets` (for an emulator) of the LoadPiletsOptions
if (process.env.DEBUG_PILET) {
  const { installPiletEmulator } = require('piral-debug-utils');

  installPiletEmulator(requestPilets, {
    addPilet,
    removePilet,
    integrate,
  });
}
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

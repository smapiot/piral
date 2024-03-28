[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Base](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-base.svg?style=flat)](https://www.npmjs.com/package/piral-base) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is the base library that is required for any Piral instance. It is independent of React, a state container, or anything else. It only brings functionality for loading and evaluating pilets.

## Documentation

For details on the provided API check out the [documentation at the Piral website](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/main/docs).

## Getting Started

Creating your own Piral app based on `piral-base` is in general **not recommended**.

The only exception is when a Piral-fork that is based on another technology than React should be created. In any other case please look at `piral-core` library or the full `piral` framework.

More information can be found in our [documentation at the Piral website](https://docs.piral.io).

## Available Options

By default, the loading of pilets assumes standard metadata. In general, however, the `loadPilet` option allows to bring in other ways.

### Full Loader Override

One example of using `loadPilet` to extend Piral beyond its initial capabilities is to use SystemJS for loading the pilets.

```js
startLoadingPilets({
  // ...
  loadPilet(meta) {
    return System.import(meta.name)
      .catch((err) => {
        // error
        return {};
      })
      .then((moduleContent) => ({
        ...meta,
        ...moduleContent,
      }))
      .then((pilet: Pilet) => {
        if (typeof pilet.setup !== 'function') {
          pilet.setup = () => {};
        }

        return pilet;
      });
  },
});
```

Another example is to define loader overrides using the `spec` identifier.

### Spec-Specific Loader Overrides

The `loaders` option can be passed in an object where the spec to override is provided as key:

```js
startLoadingPilets({
  // ...
  loaders: {
    'esm': (meta) => {
      // ...
      return pilet;
    },
    'systemjs': (meta) => {
      // ...
      return pilet;
    }
  },
});
```

The spec key is defined by the API response via the `spec` field. This is mostly used with custom specified pilet formats indicated via the `v:x` version marker. A version marker such as `//@pilet v:x(esm)` would lead to use the `esm` override given as an example above.

The two options, `loadPilet` and `loaders` are not exclusive. The `loadPilet` option defines the default, while `loaders` define spec-dependent overrides.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

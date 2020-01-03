[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Lazy](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-lazy.svg?style=flat)](https://www.npmjs.com/package/piral-lazy) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-lazy` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a `fromLazy` shortcut.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance. We recommend integrating `piral-lazy` when you think about an opt-in for *any* third-party framework (e.g., `piral-vue`, `piral-ng`, ...).

## Documentation

The following functions are brought to the Pilet API.

### `fromLazy()`

Transforms the result of a promise derived from a callback (i.e., lazy loading) to a proper component. This is thought for non-React lazy loading. For React you'll need to use the known way of applying `React.lazy` to your component initialization.

## Setup and Bootstrapping

Using lazy loading with Piral is as simple as installing `piral-lazy`.

```ts
import { createLazyApi } from 'piral-lazy';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createLazyApi()],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

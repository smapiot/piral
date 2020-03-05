[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Redux](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-redux.svg?style=flat)](https://www.npmjs.com/package/piral-redux) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-redux` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` for including a state container managed by Redux.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `?()`

...

## Usage

> For authors of pilets

...

## Setup and Bootstrapping

> For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createReduxApi` from the `piral-redux` package.

```ts
import { createReduxApi } from 'piral-redux';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createReduxApi()],
  // ...
});
```

There are no options available.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

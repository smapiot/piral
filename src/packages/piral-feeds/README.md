[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Feeds](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-feeds.svg?style=flat)](https://www.npmjs.com/package/piral-feeds) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-feeds` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `createConnector`

Creates a new feed connector, which is an abstraction over a state container driven by the typical lifecycle of a data feed connection.

Returns a higher-order component for providing a `data` prop that reflects the current feed data.

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createFeedsApi` from the `piral-feeds` package.

```tsx
import { createFeedsApi } from 'piral-feeds';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createFeedsApi()],
  // ...
});
```

There are no options available.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

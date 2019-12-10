[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Axios](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-axios.svg?style=flat)](https://www.npmjs.com/package/piral-axios) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-axios` brings to the table is a single Pilet API extension called `axios` that is used by `piral`. Axios is a library for making HTTP requests.

## Documentation

The following functions are brought to the Pilet API.

### `axios`

Represents an Axios instance already configured for use in the app shell.

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createAxiosApi` from the `piral-axios` package.

```ts
import { createAxiosApi } from 'piral-axios';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createAxiosApi()],
  // ...
});
```

Via the options the default settings such as the `baseURL` can be defined. These options are taken directly from `axios`.

For example:

```ts
const instance = createInstance({
  // important part
  extendApi: [createAxiosApi({
    baseURL: 'https://example.com/api/v1',
    headers: {
      authorization: 'Bearer ...',
    },
  })],
  // ...
});
```

**Note**: `piral-axios` plays nicely together with authentication providers such as `piral-adal`. As such authentication tokens are automatically inserted on requests to the base URL.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

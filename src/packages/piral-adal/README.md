[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral ADAL](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-adal.svg?style=flat)](https://www.npmjs.com/package/piral-adal) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-adal` brings to the table is a direct integration with Azure Active Directory on basis of the MSAL library that can be used with `piral` or `piral-core`.

By default, these extensions are not integrated in `piral`, so you'd need to add them to your Piral instance. The set includes the `getAccessToken` API to retrieve the current user's access token.

## Documentation

The following functions are brought to the Pilet API.

### `getAccessToken()`

Gets the currently authenticated user's token or `undefined` if no user is authenticated.

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createAdalApi` from the `piral-adal` package.

```tsx
import { createAdalApi } from 'piral-adal';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createAdalApi({ clientId })],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

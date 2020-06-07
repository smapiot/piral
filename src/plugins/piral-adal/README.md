[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral ADAL](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-adal.svg?style=flat)](https://www.npmjs.com/package/piral-adal) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-adal` brings to the table is a direct integration with Azure Active Directory on basis of the MSAL library that can be used with `piral` or `piral-core`.

The set includes the `getAccessToken` API to retrieve the current user's access token.

By default, these Pilet API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `getAccessToken()`

Gets the currently authenticated user's token or `undefined` if no user is authenticated.

## Usage

> For authors of pilets

You can use the `getAccessToken` function from the Pilet API. This returns a promise.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export async function setup(piral: PiletApi) {
  const userToken = await piral.getAccessToken();
  // do something with userToken
}
```

Note that this value may change if the Piral instance supports an "on the fly" login (i.e., a login without redirect / reloading of the page).

## Setup and Bootstrapping

> For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createAdalApi` from the `piral-adal` package.

```ts
import { createAdalApi } from 'piral-adal';
```

The integration looks like:

```ts
import { createAdalApi, setupAdalClient } from 'piral-adal';

const client = setupAdalClient({ clientId, ... });

const instance = createInstance({
  // important part
  extendApi: [createAdalApi(client)],
  // ...
});
```

The separation into `setupAdalClient` and `createAdalApi` was done to simplify the standard usage.

Normally, you would want to have different modules here. As an example consider the following code:

```ts
// module adal.ts
import { setupAdalClient } from 'piral-adal';

export const client = setupAdalClient({ ... });

// app.ts
import { createAdalApi } from 'piral-adal';
import { client } from './adal';

export function render() {
  renderInstance({
    // ...
    extendApi: [createAdalApi(client)],
  });
}

// index.ts
import { client } from './adal';

if (location.pathname !== '/auth') {
  if (client.account()) {
    import('./app').then(({ render }) => render());
  } else {
    client.login();
  }
}
```

This way we evaluate the current path and act accordingly. Note that the actually used path may be different for your application.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

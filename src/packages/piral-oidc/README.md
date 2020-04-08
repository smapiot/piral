[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral OIDC](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-oidc.svg?style=flat)](https://www.npmjs.com/package/piral-oidc) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-oidc` brings to the table is a direct integration with OpenID Connect identity providers on basis of the oidc-client library that can be used with `piral` or `piral-core`.

The set includes the `getAccessToken` API to retrieve the current user's access token.

By default, these Pilet API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `getAccessToken()`

Gets the currently authenticated user's token or `undefined` if no user is authenticated.

## Usage

> For authors of pilets

You can use the `getAccessToken` function from the Pilet API.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const userToken = piral.getAccessToken();
  // do something with userToken
}
```

Note that this value may change if the Piral instance supports an "on the fly" login (i.e., a login without redirect / reloading of the page).

## Setup and Bootstrapping

> For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createOidcApi` from the `piral-oidc` package.

```ts
import { createOidcApi } from 'piral-oidc';
```

The integration looks like:

```ts
import { createOidcApi, setupOidcClient } from 'piral-oidc';

const client = setupOidcClient({ clientId, ... });

const instance = createInstance({
  // important part
  extendApi: [createOidcApi(client)],
  // ...
});
```

The separation into `setupOidcClient` and `createOidcApi` was done to simplify the standard usage.

Normally, you would want to have different modules here. As an example consider the following code:

```ts
// module oidc.ts
import { setupOidcClient } from 'piral-oidc';

export const client = setupOidcClient({ ... });

// app.ts
import { createOidcApi } from 'piral-oidc';
import { client } from './oidc';

export function render() {
  renderInstance({
    // ...
    extendApi: [createOidcApi(client)],
  });
}

// index.ts
import { client } from './oidc';

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

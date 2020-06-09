[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral OAuth 2.0](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-oauth2.svg?style=flat)](https://www.npmjs.com/package/piral-oauth2) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-oauth2` brings to the table is a direct integration with OAuth 2.0 identity providers on basis of the client-oauth2 library that can be used with `piral` or `piral-core`.

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

For the setup of the library itself you'll need to import `createOAuth2Api` from the `piral-oauth2` package.

```ts
import { createOAuth2Api } from 'piral-oauth2';
```

The integration looks like:

```ts
import { createOAuth2Api, setupOAuth2Client } from 'piral-oauth2';

const client = setupOAuth2Client({ clientId, ... });

const instance = createInstance({
  // important part
  extendApi: [createOAuth2Api(client)],
  // ...
});
```

The separation into `setupOAuth2Client` and `createOAuth2Api` was done to simplify the standard usage.

Normally, you would want to have different modules here. As an example consider the following code:

```ts
// module oauth2.ts
import { setupOAuth2Client } from 'piral-oauth2';

export const client = setupOAuth2Client({ ... });

// app.ts
import { createOAuth2Api } from 'piral-oauth2';
import { client } from './oauth2';

export function render() {
  renderInstance({
    // ...
    extendApi: [createOAuth2Api(client)],
  });
}

// index.ts
import { client } from './oauth2';

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

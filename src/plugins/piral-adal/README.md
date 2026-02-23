[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral ADAL](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-adal.svg?style=flat)](https://www.npmjs.com/package/piral-adal) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-adal` brings to the table is a direct integration with Azure Active Directory on basis of the MSAL library that can be used with `piral` or `piral-core`.

The set includes the `getAccessToken` API to retrieve the current user's access token.

By default, these Pilet API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Why and When

If you are using authorization with an Microsoft Account or an Active Directory then `piral-adal` might be a useful plugin. It uses the `msal` library under the hood and exposes token functionality in common HTTP mechanisms (e.g., using `fetch` or a library such as `axios`). Pilets can get the currently available token via the pilet API.

Alternatives: Use a plugin that is specific to your method of authentication (e.g., `piral-auth` for generic user management, `piral-oidc` for generic OpenID Connect, `piral-oauth2` for generic OAuth 2, etc.) or just a library.

## Documentation

The following functions are brought to the Pilet API.

### `getAccessToken()`

Gets the currently authenticated user's token or `undefined` if no user is authenticated.

## Usage

::: summary: For pilet authors

You can use the `getAccessToken` function from the Pilet API. This returns a promise.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export async function setup(piral: PiletApi) {
  const userToken = await piral.getAccessToken();
  // do something with userToken
}
```

Note that this value may change if the Piral instance supports an "on the fly" login (i.e., a login without redirect/reloading of the page).

:::

::: summary: For Piral instance developers

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
  plugins: [createAdalApi(client)],
  // ...
});
```

The separation into `setupAdalClient` and `createAdalApi` was done to simplify the standard usage.

Normally, you would want to have different modules here. As an example consider the following code:

```jsx
// module adal.ts
import { setupAdalClient } from 'piral-adal';

export const client = setupAdalClient({ ... });

// app.tsx
import * as React from 'react';
import { createAdalApi } from 'piral-adal';
import { createInstance } from 'piral-core';
import { client } from './adal';
import { render } from 'react-dom';

export function render() {
  const instance = createInstance({
    // ...
    plugins: [createAdalApi(client)],
  });
  render(<Piral instance={instance} />, document.querySelector('#app'));
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

By default, the `redirectUri` is chosen to be `{location.origin}/auth`, i.e., if your site is running on `https://example.com` then the redirect would go against `https://example.com/auth`. You can set the `redirectUri` (as well as `postLogoutRedirectUri` for the logout case) in the client setup:

```ts
// module adal.ts
import { setupAdalClient } from 'piral-adal';

export const client = setupAdalClient({
  clientId: '...',
  redirectUri: 'https://example.com/logged-in',
  postLogoutRedirectUri: 'https://example.com/logged-out',
});
```

All auth options from the MSAL library are supported. For an overview, [see the MSAL wiki page](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL.js-1.0.0-api-release#configuration-options).

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

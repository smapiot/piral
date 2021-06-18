[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Authentication](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-auth.svg?style=flat)](https://www.npmjs.com/package/piral-auth) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-auth` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes the `getUser` API to retrieve the user, login / logout functionality and user state management incl. features and permissions.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Why and When

Authentication is a basic need of almost every application. This plugin just stores given user information in the central store and makes this information available to all pilets via the pilet API. How to get this user information and where specific authorization (e.g., in form of a token) is stored is up to the application owner. Thus this plugin should only be used in combination with other mechanisms.

Alternatives: Use a plugin that is specific to your method of authentication (e.g., `piral-adal` for Microsoft, `piral-oauth2` for generic OAuth 2, `piral-oidc` for generic OpenID Connect etc.) or just a library.

## Documentation

The following functions are brought to the Pilet API.

### `getUser()`

Gets the currently authenticated user or `undefined` if no user is authenticated.

## Usage

::: summary: For pilet authors

You can use the `getUser` function from the Pilet API to obtain information about the currently logged in user.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const currentUser = piral.geUser();
}
```

Note that the retrieved user data may change if the Piral instance supports an "on the fly" login (i.e., a login without redirect / reloading of the page).

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createAuthApi` from the `piral-auth` package.

```ts
import { createAuthApi } from 'piral-auth';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createAuthApi()],
  // ...
});
```

The options include defining an existing user (e.g., obtained by a redirect).

```ts
const instance = createInstance({
  // important part
  plugins: [createAuthApi({
    user: {
      firstName: 'Hans',
      lastName: 'Zimmermann',
      // ...
    },
  })],
  // ...
});
```

:::

## Events

The extension gives the core a set of new events to be listened to:

- `change-user`

The events are fully typed.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Axios](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-axios.svg?style=flat)](https://www.npmjs.com/package/piral-axios) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-axios` brings to the table is a single Pilet API extension called `axios` that is used by `piral`. Axios is a library for making HTTP requests.

## Why and When

Making HTTP requests is one of the most important aspects of a modern SPA. While standard mechanisms like `fetch` can be used without any library (excluding polyfills for older browsers) they lack convenience. Among the most popular libraries for HTTP requests is `axios`. It works in Node.js and the browser.

This library brings axios in as a shared library with a pre-configured instance being available on the pilet API.

Alternatives: Just share `axios` or any HTTP library of your choice as a shared dependency. Communicate tokens or other basic information via events or the shared data store or require use of another pilet API to retrieve it (e.g., `getUser` from `piral-auth`).

## Documentation

The following functions are brought to the Pilet API.

### `axios`

Represents an Axios instance already configured for use in the app shell.

## Usage

::: summary: For pilet authors

You can use the `axios` object from the Pilet API to communicate with your backend. This instance has advantages over creating a fresh instance from Axios.

For instance, it is already wired up with the authentication system and communicating to the right backend. As such relative URLs can be used when doing requests.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const promise = piral.axios.get('/foo');
}
```

For details on using Axios, see the [Axios documentation](https://github.com/axios/axios#axios-api).

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createAxiosApi` from the `piral-axios` package.

```ts
import { createAxiosApi } from 'piral-axios';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createAxiosApi()],
  // ...
});
```

Via the options the default settings such as the `baseURL` can be defined. These options are taken directly from `axios`.

For example:

```ts
const instance = createInstance({
  // important part
  plugins: [createAxiosApi({
    baseURL: 'https://example.com/api/v1',
    headers: {
      authorization: 'Bearer ...',
    },
  })],
  // ...
});
```

**Note**: `piral-axios` plays nicely together with authentication providers such as `piral-adal`. As such authentication tokens are automatically inserted on requests to the base URL.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

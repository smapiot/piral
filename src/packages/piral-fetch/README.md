[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Fetch](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-fetch.svg?style=flat)](https://www.npmjs.com/package/piral-fetch) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-fetch` brings to the table is a single Pilet API extension called `fetch` that is used by `piral`.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fetch()`

This is a simpler version of the standard `fetch` from the browser.

## Usage

> For authors of pilets

You can use the `fetch` function from the Pilet API to communicate with your backend. This instance has advantages over using the plain `fetch` function.

For instance, it is already wired up with the authentication system and communicating to the right backend. As such relative URLs can be used when doing requests.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const promise = piral.fetch('/foo');
}
```

## Setup and Bootstrapping

> For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createFetchApi` from the `piral-fetch` package.

```ts
import { createFetchApi } from 'piral-fetch';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createFetchApi()],
  // ...
});
```

Via the options the `default` settings and the `base` URL can be defined.

For example:

```ts
const instance = createInstance({
  // important part
  extendApi: [createFetchApi({
    base: 'https://example.com/api/v1',
    default: {
      headers: {
        authorization: 'Bearer ...',
      },
    },
  })],
  // ...
});
```

**Note**: `piral-fetch` plays nicely together with authentication providers such as `piral-adal`. As such authentication tokens are automatically inserted on requests to the base URL.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

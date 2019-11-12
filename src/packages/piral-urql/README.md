[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral URQL](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-urql.svg?style=flat)](https://www.npmjs.com/package/piral-urql) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-urql` brings to the table is a set of API extensions that is used by `piral`. The set represents a powerful GraphQL integration using the open-source library URQL.

## Documentation

The following functions are brought to the Pilet API.

(tbd)

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createGqlApi` from the `piral-urql` package.

```tsx
import { createGqlApi } from 'piral-urql';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createGqlApi()],
  // ...
});
```

Via the options the correct client can be set up. Setting the `subscriptionUrl` to `false` will prevent using a subscription.

For example:

```tsx
const client = setupGqlClient({
  url: 'https://example.com/graphql',
  subscriptionUrl: false,
  lazy: true,
});

const instance = createInstance({
  // important part
  extendApi: [createGqlApi(client)],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

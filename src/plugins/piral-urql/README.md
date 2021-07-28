[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral URQL](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-urql.svg?style=flat)](https://www.npmjs.com/package/piral-urql) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-urql` brings to the table is a set of Pilet API extensions that is used by `piral`.

The set represents a powerful GraphQL integration using the open-source library URQL.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Why and When

If you use GraphQL in your application and want to provide a lightweight way of accessing the GraphQL API then this library may be for you. The reason for not just making `urql` a shared dependency (which you can do always) is that the authorization / token sharing just works. Additionally, this gives users of your pilets additional discoverability regarding the shared lib and its capabilities.

Alternatively, expose a GraphQL library such as `urql` or `apollo` as a shared library.

## Documentation

The following functions are brought to the Pilet API.

### `query()`

Executes a GraphQL query against the server specified in the app shell.

### `mutate()`

Runs a GraphQL mutation against the server specified in the app shell.

### `subscribe()`

Establishes a GraphQL subscription via the subscription host defined in the app shell.

## Usage

::: summary: For pilet authors

You can use the `query` function from the Pilet API to execute a GraphQL query against the defined GraphQL server.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const gql = `query {
    myResource(id: "example") {
      name
      age
      whatever
    }
  }`;
  const promise = piral.query(gql).then(({ name, age, whatever }) => {});
}
```

You can use the `mutate` function from the Pilet API to run a GraphQL mutation against the defined GraphQL server.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const gql = `mutation {
    changeMyResource(id: "example", name: "foo") {
      name
      age
      whatever
    }
  }`;
  const promise = piral.mutate(gql).then(({ name, age, whatever }) => {});
}
```

You can use the `subscribe` function from the Pilet API to create a GraphQL subscription to the defined GraphQL server.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const gql = `subscription {
    onMyResourceChange(id: "example") {
      name
      age
      whatever
    }
  }`;
  const unsubscribe = piral.subscribe(gql, ({ name, age, whatever }) => {});
}
```

:::

::: summary: For Piral instance developers

> For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createGqlApi` from the `piral-urql` package.

```ts
import { createGqlApi } from 'piral-urql';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createGqlApi()],
  // ...
});
```

Via the options the correct client can be set up. Setting the `subscriptionUrl` to `false` will prevent using a subscription.

For example:

```ts
const client = setupGqlClient({
  url: 'https://example.com/graphql',
  subscriptionUrl: false,
  lazy: true,
});

const instance = createInstance({
  // important part
  plugins: [createGqlApi(client)],
  // ...
});
```

**Note**: `piral-urql` plays nicely together with authentication providers such as `piral-adal`. As such authentication tokens are automatically inserted on queries, mutations, and when establishing subscriptions.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

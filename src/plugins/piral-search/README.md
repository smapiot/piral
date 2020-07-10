[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Search](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-search.svg?style=flat)](https://www.npmjs.com/package/piral-search) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-search` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` to bring enhanced search capabilities to pilets via your Piral instance.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `registerSearchProvider`

Adds a search provider to be used in the app shell. The search provider will always be invoked when the global search is triggered.

If the first argument is a string a named search provider is registered. A named search provider can also be removed.

### `unregisterSearchProvider`

Removes a search provider from the app shell. This requires a named search provider.

## Usage

::: summary: For pilet authors

You can use the `registerSearchProvider` function from the Pilet API to add a new search provider in the app shell.

**Note**: When the first argument is a string we call it a *named* search provider.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyTile } from './MyTile';

export function setup(piral: PiletApi) {
  piral.registerSearchProvider(MyTile);
}
```

You can use the `unregisterSearchProvider` function from the Pilet API to remove a previously added search provider from the app shell.

**Note**: You'll need to have added a *named* search provider in order to be able to remove it.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyTile } from './MyTile';

export function setup(piral: PiletApi) {
  // register with a name
  piral.registerSearchProvider('first', MyTile);
  // and unregister; maybe some time later?
  piral.unregisterSearchProvider('first');
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createSearchApi` from the `piral-search` package.

```ts
import { createSearchApi } from 'piral-search';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createSearchApi()],
  // ...
});
```

Via the options the initially displayed `results` can be defined. The current `query` can also be set.

For example:

```jsx
const instance = createInstance({
  // important part
  extendApi: [createSearchApi({
    query: '!help',
    results: [
      <div>
        Help was found!
      </div>,
    ],
  })],
  // ...
});
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

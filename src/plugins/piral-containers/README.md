[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Containers](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-containers.svg?style=flat)](https://www.npmjs.com/package/piral-containers) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-containers` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `createState()`

Creates a new pilet global state container. The state container will essentially couple to the app shell global state container. It is, however, only available for use inside the pilet.

## Usage

::: summary: For pilet authors

You can use the `createState` function from the Pilet API to create your own sub states in the global state container of the Piral instance.

Example use:

```jsx
import { PiletApi } from '<name-of-piral-instance>';
import { MyPage } from './MyPage';

export function setup(piral: PiletApi) {
  const connect = piral.createState({
    state: {
      count: 0,
    },
    actions: {
      increment(dispatch) {
        dispatch(state => ({
          count: state.count + 1,
        }));
      },
      decrement(dispatch) {
        dispatch(state => ({
          count: state.count - 1,
        }));
      },
    },
  });
  piral.registerPage(
    '/sample',
    connect(({ state, actions }) => <MyPage count={state.count} {...actions} />),
  );
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createContainersApi` from the `piral-containers` package.

```ts
import { createContainersApi } from 'piral-containers';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createContainersApi()],
  // ...
});
```

There are no options available.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

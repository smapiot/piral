[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Redux](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-redux.svg?style=flat)](https://www.npmjs.com/package/piral-redux) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-redux` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` for including a state container managed by Redux.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `createReduxStore()`

Creates a new Redux store for the pilet. The store is tighly coupled to the lifetime of the pilet.

This function returns the `connect` function known from React Redux - just applied to the pilet store.

## Usage

> For authors of pilets

Use the function `createReduxStore` to obtain a store connector. The store connector is a higher-order component that wraps an existing component and removes the `state` and `dispatch` props. Instead, `state` will be "connected" to the created pilet store and `dispatch` allows modifying the state by calling the reducer with the provided action.

Let's see a full example.

```ts
export function setup(api: PiletApi) {
  const connect = api.createReduxStore(myReducer);
  // ...
}
```

The reducer could be defined such as:

```ts
const initialState = {
  count: 0
};

function myReducer(state = initialState, action) {
  switch (action.type) {
    case "increment":
      return {
        count: state.count + 1
      };
    case "decrement":
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
}
```

Using this construct is straight forward and follows other `create...` Pilet APIs.

```jsx
root.registerPage(
  "/sample",
  connect(({ state, dispatch }) => (
    <div>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      {state.count}
    </div>
  ))
);
```

## Setup and Bootstrapping

> For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createReduxApi` from the `piral-redux` package.

```ts
import { createReduxApi } from 'piral-redux';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createReduxApi()],
  // ...
});
```

There are two options available. The `reducer` option allows us to define reducers that also access and manipulate the global state. The `enhancer` option allows us to pass in a custom store enhancer. For more details on enhancers please look at the [Redux documentation](https://read.reduxbook.com/markdown/part1/05-middleware-and-enhancers.html).

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

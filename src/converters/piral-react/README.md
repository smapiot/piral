[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral React](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-react.svg?style=flat)](https://www.npmjs.com/package/piral-react) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `react@>=16` and `react-dom@>=16`. What `piral-react` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

::: warning: Experimental release
Right now this package is released as an experimental converter. While it does automatically switch between the existing React tree and a new React tree (depending on the version of React being used) it does not include any handling geared towards the `react-router`. Therefore, problems with shared or non-shared React Router instances are expected.

Our recommendation for the moment is to only use this package if you know that you are using a different version of React + React Router (i.e., have both bundled / using your own version and not the one provided by the Piral instance), i.e., using your own context providers, too.
:::

The set includes a React 16+ converter for any component registration, as well as a `fromReact` shortcut and a `ReactExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromReact()`

Transforms a standard React 16+ component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `ReactExtension`

The extension slot component to be used in React 16+ components.

## Usage

::: summary: For pilet authors

You can use the `fromReact` function from the Pilet API to convert your React 16+ components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { ReactPage } from './ReactPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromReact(ReactPage));
}
```

Within React 16+ components the Piral React 16+ extension component can be used by referring to `ReactExtension`, e.g.,

```jsx
<ReactExtension name="name-of-extension" />
```

Alternatively, if `piral-react` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromReact } from 'piral-react/convert';
import { ReactPage } from './ReactPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromReact(ReactPage));
}
```

:::

::: summary: For Piral instance developers

Using React 16+ with Piral is as simple as installing `piral-react` and `react`. For `react` add the following two packages to your project's dependencies:

```json
{
  "dependencies": {
    "react`": "^18",
    "react-dom": "^18"
  }
}
```

Now you are ready to use the `piral-react` converter:

```ts
import { createReactApi } from 'piral-react';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createReactApi()],
  // ...
});
```

The `react` package (or whatever alias you've chosen) should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "react": ""
    }
  }
}
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral React 15](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-react-15.svg?style=flat)](https://www.npmjs.com/package/piral-react-15) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-react-15` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a React 15.x converter for any component registration, as well as a `fromReact15` shortcut and a `React15Extension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromReact15()`

Transforms a standard React 15.x component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `React15Extension`

The extension slot component to be used in React 15.x components.

## Usage

::: summary: For pilet authors

You can use the `fromReact15` function from the Pilet API to convert your React v15 components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { React15Page } from './React15Page';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromReact15(React15Page));
}
```

Within React v15 components the Piral React v15 extension component can be used by referring to `React15Extension`, e.g.,

```jsx
<React15Extension name="name-of-extension" />
```

Alternatively, if `piral-react-15` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromReact15 } from 'piral-react-15';
import { React15Page } from './React15Page';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromReact15(React15Page));
}
```

:::

::: summary: For Piral instance developers

Using React v15 with Piral is as simple as installing `piral-react-15` and `react-15`.

```ts
import 'react-15';
import { createReact15Api } from 'piral-react-15';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createReact15Api()],
  // ...
});
```

The `react-15` package (or whatever alias you've chosen) should be shared with the pilets via the *package.json*:

```json
{
  "pilets": {
    "externals": [
      "react-15"
    ]
  }
}
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

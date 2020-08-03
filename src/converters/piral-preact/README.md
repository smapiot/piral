[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Preact](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-preact.svg?style=flat)](https://www.npmjs.com/package/piral-preact) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-preact` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Preact converter for any component registration, as well as a `fromPreact` shortcut and a `PreactExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromPreact()`

Transforms a standard Preact component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `PreactExtension`

The extension slot component to be used in Preact component.

## Usage

::: summary: For pilet authors

You can use the `fromPreact` function from the Pilet API to convert your Preact components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { PreactPage } from './PreactPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromPreact(PreactPage));
}
```

Within Preact components the Piral Preact extension component can be used by referring to `PreactExtension`, e.g.,

```jsx
<PreactExtension name="name-of-extension" />
```

:::

::: summary: For Piral instance developers

Using Preact with Piral is as simple as installing `piral-preact` and `preact`.

```ts
import 'preact';
import { createPreactApi } from 'piral-preact';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createPreactApi()],
  // ...
});
```

The `preact` package should be shared with the pilets via the *package.json*:

```json
{
  "pilets": {
    "externals": [
      "preact"
    ]
  }
}
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

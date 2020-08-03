[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Hyperapp](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-hyperapp.svg?style=flat)](https://www.npmjs.com/package/piral-hyperapp) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-hyperapp` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Hyperapp converter for any component registration, as well as a `fromHyperapp` shortcut and a `HyperappExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromHyperapp()`

Transforms a standard Hyperapp app into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `HyperappExtension`

The extension slot component to be used in Hyperapp apps.

## Usage

::: summary: For pilet authors

You can use the `fromHyperapp` function from the Pilet API to convert your Hyperapp components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { HyperappPage } from './HyperappPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromHyperapp(HyperappPage));
}
```

Within Hyperapp components the Piral Hyperapp extension component can be used by referring to `HyperappExtension`, e.g.,

```jsx
<HyperappExtension name="name-of-extension" />
```

:::

::: summary: For Piral instance developers

Using Hyperapp with Piral is as simple as installing `piral-hyperapp` and `hyperapp`.

```ts
import 'hyperapp';
import { createHyperappApi } from 'piral-hyperapp';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createHyperappApi()],
  // ...
});
```

The `hyperapp` package should be shared with the pilets via the *package.json*:

```json
{
  "pilets": {
    "externals": [
      "hyperapp"
    ]
  }
}
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

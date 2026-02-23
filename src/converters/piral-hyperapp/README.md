[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Hyperapp](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-hyperapp.svg?style=flat)](https://www.npmjs.com/package/piral-hyperapp) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `hyperapp`. What `piral-hyperapp` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Hyperapp converter for any component registration, as well as a `fromHyperapp` shortcut and a `HyperappExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromHyperapp()`

Transforms a standard Hyperapp app into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `HyperappExtension`

The extension slot component to be used in Hyperapp apps.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-hyperapp` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromHyperapp } from 'piral-hyperapp/convert';
import { HyperappPage } from './HyperappPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromHyperapp(HyperappPage));
}
```

Within Hyperapp components the Piral Hyperapp extension component can be used by referring to `HyperappExtension`, e.g.,

```jsx
<HyperappExtension name="name-of-extension" />
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-hyperapp` in your Piral instance.

Using Hyperapp with Piral is as simple as installing `piral-hyperapp` and `hyperapp@^1`.

```ts
import { createHyperappApi } from 'piral-hyperapp';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createHyperappApi()],
  // ...
});
```

The `hyperapp` package should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "hyperapp": ""
    }
  }
}
```
:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Solid](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-solid.svg?style=flat)](https://www.npmjs.com/package/piral-solid) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `solid-js`. What `piral-solid` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Solid converter for any component registration, as well as a `fromSolid` shortcut and a `SolidExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromSolid()`

Transforms a standard Solid component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `SolidExtension`

The extension slot component to be used in Solid components.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-solid` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromSolid } from 'piral-solid/convert';
import { SolidPage } from './SolidPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromSolid(SolidPage));
}
```

Within Solid components the Piral Solid extension component can be used by referring to `SolidExtension`, e.g.,

```jsx
<SolidExtension name="name-of-extension" />
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-solid` in your Piral instance.

Using Solid with Piral is as simple as installing `piral-solid` and `solid-js@^1`.

```ts
import { createSolidApi } from 'piral-solid';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createSolidApi()],
  // ...
});
```

The `solid-js` and `solid-js/web` packages should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "solid-js": "",
      "solid-js/web": ""
    }
  }
}
```
:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Gea](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-gea.svg?style=flat)](https://www.npmjs.com/package/piral-gea) [![tested with vitest](https://img.shields.io/badge/tested_with-vitest-99424f.svg)](https://vitest.dev/) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a dependency to `@geajs/core`. What `piral-gea` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Gea converter for any component registration, as well as a `fromGea` shortcut and a `GeaExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromGea()`

Transforms a standard Gea component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `GeaExtension`

The extension slot component to be used in Gea components.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-gea` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromGea } from 'piral-gea/convert';
import { GeaPage } from './GeaPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromGea(GeaPage));
}
```

Within Gea components the Piral Gea extension component can be used by referring to `GeaExtension`, e.g.,

```jsx
<GeaExtension name="name-of-extension" />
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-gea` in your Piral instance.

Using Gea with Piral is as simple as installing `piral-gea` and the Gea package:

- `@geajs/core`

```ts
import { createGeaApi } from 'piral-gea';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createGeaApi()],
  // ...
});
```

The `@geajs/core` package should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "@geajs/core": ""
    }
  }
}
```
:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
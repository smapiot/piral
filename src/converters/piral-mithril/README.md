[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Mithril](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-mithril.svg?style=flat)](https://www.npmjs.com/package/piral-mithril) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `mithril`. What `piral-mithril` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Mithril.js converter for any component registration, as well as a `fromMithril` shortcut and a `MithrilExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromMithril()`

Transforms a standard Mithril.js component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `MithrilExtension`

The extension slot component to be used in Mithril.js component.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-mithril` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromMithril } from 'piral-mithril/convert';
import { MithrilPage } from './MithrilPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromMithril(MithrilPage));
}
```

Within Mithril.js components the Piral Mithril.js extension component can be used by referring to `MithrilExtension`, e.g.,

```jsx
<MithrilExtension name="name-of-extension" />
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-mithril` in your Piral instance.

Using Mithril.js with Piral is as simple as installing `piral-mithril` and `mithril@^2`.

```ts
import { createMithrilApi } from 'piral-mithril';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createMithrilApi()],
  // ...
});
```

The `mithril` package should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "mithril": ""
    }
  }
}
```
:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Inferno](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-inferno.svg?style=flat)](https://www.npmjs.com/package/piral-inferno) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `inferno`. What `piral-inferno` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Inferno converter for any component registration, as well as a `fromInferno` shortcut and a `InfernoExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromInferno()`

Transforms a standard Inferno component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `InfernoExtension`

The extension slot component to be used in Inferno components.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-inferno` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromInferno } from 'piral-inferno/convert';
import { InfernoPage } from './InfernoPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromInferno(InfernoPage));
}
```

Within Inferno components the Piral Inferno extension component can be used by referring to `InfernoExtension`, e.g.,

```jsx
<InfernoExtension name="name-of-extension" />
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-inferno` in your Piral instance.

Using Inferno with Piral is as simple as installing `piral-inferno` and the Inferno packages:

- `inferno`
- `inferno-create-element`

```ts
import { createInfernoApi } from 'piral-inferno';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createInfernoApi()],
  // ...
});
```

The `inferno` and `inferno-create-element` package should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "inferno": "",
      "inferno-create-element": ""
    }
  }
}
```
:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Inferno](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-inferno.svg?style=flat)](https://www.npmjs.com/package/piral-inferno) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-inferno` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Inferno converter for any component registration, as well as a `fromInferno` shortcut and a `InfernoExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromInferno()`

Transforms a standard Inferno component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `InfernoExtension`

The extension slot component to be used in Inferno components.

## Usage

> For authors of pilets

You can use the `fromInferno` function from the Pilet API to convert your Inferno components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { InfernoPage } from './InfernoPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromInferno(InfernoPage));
}
```

Within Inferno components the Piral Inferno extension component can be used by referring to `InfernoExtension`, e.g.,

```jsx
<InfernoExtension name="name-of-extension" />
```

## Setup and Bootstrapping

> For Piral instance developers

Using Inferno with Piral is as simple as installing `piral-inferno` and `inferno`.

```ts
import 'inferno';
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
  "pilets": {
    "externals": [
      "inferno",
      "inferno-create-element"
    ]
  }
}
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Inferno](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-inferno.svg?style=flat)](https://www.npmjs.com/package/piral-inferno) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-inferno` brings to the table is a set of API extensions that can be used with `piral` or `piral-core`.

By default, these extensions are not integrated in `piral`, so you'd need to add them to your Piral instance. The set includes an Inferno converter for any component registration, as well as a `fromInferno` shortcut and a `InfernoExtension` component.

## Documentation

The following functions are brought to the Pilet API.

(tbd)

## Setup and Bootstrapping

Using Inferno with Piral is as simple as installing `piral-inferno` and `inferno`.

```tsx
import 'inferno';
import { createInfernoApi } from 'piral-inferno';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createInfernoApi()],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral PWA](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-pwa.svg?style=flat)](https://www.npmjs.com/package/piral-pwa) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-pwa` brings to the table is a simple way to expose your application as a PWA with the capability to use offline storage for pilets, too.

## Documentation

The following functions are brought to the Pilet API.

(tbd)

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createPwaApi` from the `piral-pwa` package.

```tsx
import { createPwaApi } from 'piral-pwa';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createPwaApi()],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

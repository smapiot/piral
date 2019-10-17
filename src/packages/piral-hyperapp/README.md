[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Hyperapp](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-hyperapp.svg?style=flat)](https://www.npmjs.com/package/piral-hyperapp) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-hyperapp` brings to the table is a set of API extensions that can be used with `piral` or `piral-core`. By default, these extensions are not integrated in `piral`, so you'd need to add them to your Piral instance. The set includes an `register...Hyperapp` method for each `register...X` method of the standard API surface.

## Documentation

For details on the provided API check out the [documentation at the Piral website](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/master/docs).

## Setup and Bootstrapping

Using hyperapp with Piral is as simple as installing `piral-hyperapp` and `hyperapp`.

```tsx
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

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

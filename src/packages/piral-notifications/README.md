[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Notifications](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-notifications.svg?style=flat)](https://www.npmjs.com/package/piral-notifications) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-notifications` brings to the table is a set of API extensions that can be used with `piral` or `piral-core` to show notifications triggered by pilets in your Piral instance.

## Documentation

For details on the provided API check out the [documentation at the Piral website](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/master/docs).

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createNotificationsApi` from the `piral-notifications` package.

```tsx
import { createNotificationsApi } from 'piral-notifications';
```

The integration looks like:

```tsx
renderInstance({
  // important part
  extendApi: extendApis([createNotificationsApi]),
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

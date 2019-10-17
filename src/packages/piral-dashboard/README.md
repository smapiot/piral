[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Dashboard](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-dashboard.svg?style=flat)](https://www.npmjs.com/package/piral-dashboard) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-dashboard` brings to the table is a set of API extensions that can be used with `piral` or `piral-core`. By default, these extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

For details on the provided API check out the [documentation at the Piral website](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/master/docs).

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createDashboardApi` from the `piral-dashboard` package.

```tsx
import { createDashboardApi } from 'piral-dashboard';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createDashboardApi()],
  // ...
});
```

Via the options the `defaultPreferences` and the global / initially available `tiles` can be defined.

Consider for example:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createDashboardApi({
    defaultPreferences: {
      initialColumns: 2,
      initialRows: 2,
      resizable: true,
    },
    tiles: [
      {
        component: MyTeaserTile,
        preferences: {
          initialColumns: 2,
          initialRows: 4,
        },
      },
    ],
  })],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

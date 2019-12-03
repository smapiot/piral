[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Modals](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-modals.svg?style=flat)](https://www.npmjs.com/package/piral-modals) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-modals` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` to easily trigger the display of modal dialogs from pilets.

## Documentation

The following functions are brought to the Pilet API.

(tbd)

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createModalsApi` from the `piral-modals` package.

```tsx
import { createModalsApi } from 'piral-modals';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createModalsApi()],
  // ...
});
```

Via the options the globally available `dialogs` can be defined.

For example:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createModalsApi({
    dialogs: [
      {
        name: 'userinfo',
        component: UserInfoModal,
      },
    ],
  })],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Vue](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-vue.svg?style=flat)](https://www.npmjs.com/package/piral-vue) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-vue` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance. The set includes a Vue converter for any component registration, as well as a `fromVue` shortcut and a `VueExtension` component.

## Documentation

The following functions are brought to the Pilet API.

### `fromVue(root)`

Prepares a Vue root component to be used as a component in Piral. Simply wraps the component in an object with a `type` property set to `vue`.

### `VueExtension`

Represents a Vue component that allows using extensions from Piral.

## Setup and Bootstrapping

Using Vue with Piral is as simple as installing `piral-vue` and `vue`.

```tsx
import 'vue';
import { createVueApi } from 'piral-vue';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createVueApi()],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

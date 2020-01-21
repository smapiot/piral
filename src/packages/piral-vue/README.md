[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Vue](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-vue.svg?style=flat)](https://www.npmjs.com/package/piral-vue) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-vue` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Vue converter for any component registration, as well as a `fromVue` shortcut and a `VueExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromVue()`

Transforms a standard Vue component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `VueExtension`

The extension slot component to be used in Vue components. This is not really needed, as it is made available automatically via a Vue custom element named `extension-component`.

## Usage

> For authors of pilets

You can use the `fromVue` function from the Pilet API to convert your Vue components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
}
```

## Setup and Bootstrapping

> For Piral instance developers

Using Vue with Piral is as simple as installing `piral-vue` and `vue`.

```ts
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

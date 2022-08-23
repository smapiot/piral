[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Vue 3](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-vue-3.svg?style=flat)](https://www.npmjs.com/package/piral-vue-3) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `vue`. What `piral-vue-3` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Vue@3 converter for any component registration, as well as a `fromVue3` shortcut and a `Vue3Extension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromVue3()`

Transforms a standard Vue@3 component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `Vue3Extension`

The extension slot component to be used in Vue@3 components. This is not really needed, as it is made available automatically via a Vue@3 custom element named `extension-component`.

## Usage

::: summary: For pilet authors

You can use the `fromVue3` function from the Pilet API to convert your Vue@3 components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import VuePage from './Page.vue';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromVue3(VuePage));
}
```

Within Vue@3 components the Piral Vue@3 extension component can be used by referring to `extension-component`, e.g.,

```html
<extension-component name="name-of-extension"></extension-component>
```

Alternatively, if `piral-vue-3` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromVue3 } from 'piral-vue-3/convert';
import VuePage from './Page.vue';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromVue3(VuePage));
}
```

:::

::: summary: For Piral instance developers

Using Vue with Piral is as simple as installing `piral-vue-3` and `vue@3`.

```ts
import { createVue3Api } from 'piral-vue-3';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createVue3Api()],
  // ...
});
```

The `vue` package should be shared with the pilets via the *package.json*:

```json
{
  "pilets": {
    "externals": [
      "vue"
    ]
  }
}
```

For your bundler additional packages may be necessary. For instance, for Webpack the following setup is required:

First, install the additional dev dependencies

```sh
npm i vue-loader@next @vue-compiler-sfc --save-dev
```

then add a *webpack.config.js* to use them

```js
const { VueLoaderPlugin } = require('vue-loader');

module.exports = function (config) {
  config.module.rules.push({
    test: /\.vue$/,
    use: 'vue-loader'
  });
  config.plugins.push(new VueLoaderPlugin());
  return config;
};
```

Now, *.vue* files are correctly picked up and handled.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

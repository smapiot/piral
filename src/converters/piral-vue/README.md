[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Vue](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-vue.svg?style=flat)](https://www.npmjs.com/package/piral-vue) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `vue`. What `piral-vue` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Vue@2 converter for any component registration, as well as a `fromVue` shortcut and a `VueExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromVue()`

Transforms a standard Vue@2 component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `VueExtension`

The extension slot component to be used in Vue@2 components. This is not really needed, as it is made available automatically via a Vue@2 custom element named `extension-component`.

## Usage

::: summary: For pilet authors

You can use the `fromVue` function from the Pilet API to convert your Vue@2 components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import VuePage from './Page.vue';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromVue(VuePage));
}
```

Within Vue@2 components the Piral Vue@2 extension component can be used by referring to `extension-component`, e.g.,

```html
<extension-component name="name-of-extension"></extension-component>
```

Alternatively, if `piral-vue` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromVue } from 'piral-vue/convert';
import VuePage from './Page.vue';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromVue(VuePage));
}
```

:::

::: summary: For Piral instance developers

Using Vue with Piral is as simple as installing `piral-vue` and `vue`.

```ts
import { createVueApi } from 'piral-vue';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createVueApi()],
  // ...
});
```

The `vue` package should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "vue": ""
    }
  }
}
```

:::

## Development Setup

For your bundler additional packages may be necessary. For instance, for Webpack the following setup is required:

First, install the additional dev dependencies

```sh
npm i vue-loader@^15 @vue/compiler-sfc@^2 --save-dev
```

then add a *webpack.config.js* to use them

```js
const { VueLoaderPlugin } = require('vue-loader');

module.exports = function (config) {
  config.module.rules.unshift({
    test: /\.vue$/,
    use: 'vue-loader'
  });
  config.plugins.push(new VueLoaderPlugin());
  return config;
};
```

Now, *.vue* files are correctly picked up and handled.

Alternatively, the Webpack configuration can be rather simplistic. In many cases you can use the convenience `extend-webpack` module.

This is how your *webpack.config.js* can look like with the convenience module:

```js
const extendWebpack = require('piral-vue/extend-webpack');

module.exports = extendWebpack({});
```

For using `piral-vue/extend-webpack` you must have installed:

- `vue-loader` (at version 15)
- `@vue/compiler-sfc^2`
- `webpack`, e.g., via `piral-cli-webpack5`

You can do that via:

```sh
npm i vue-loader@^15 @vue/compiler-sfc^2 piral-cli-webpack5 --save-dev
```

The available options for `piral-vue/extend-webpack` are the same as for the options of the `vue-loader`, e.g.:

```js
const extendWebpack = require('piral-vue/extend-webpack');

module.exports = extendWebpack({
  customElement: /\.ce\.vue$/,
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

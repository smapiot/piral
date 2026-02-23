[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Vue 3](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-vue-3.svg?style=flat)](https://www.npmjs.com/package/piral-vue-3) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `vue`. What `piral-vue-3` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Vue@3 converter for any component registration, as well as a `fromVue3` shortcut and a `Vue3Extension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromVue3()`

Transforms a standard Vue@3 component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `Vue3Extension`

The extension slot component to be used in Vue@3 components. This is not really needed, as it is made available automatically via a Vue@3 custom element named `extension-component`.

### `defineVue3Middleware`

This function is used to declare additional middleware such as plugins when setting up Vue3.

Example in a standalone pilet:

```ts
import { fromVue3, defineVue3Middleware } from 'piral-vue-3/convert';
import Page from './Page.vue';
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import type { PiletApi } from 'sample-piral';

i18next.init({
  lng: 'de',
  interpolation: {
    escapeValue: false
  },
  fallbackLng: false,
  resources: {
		en: {
			translation: {
				greeter: "Welcome",
			},
		},
		de: {
			translation: {
				greeter: "Willkommen",
			},
		},
  }
});

export function setup(app: PiletApi) {
  defineVue3Middleware(vue => {
    vue.use(I18NextVue, { i18next });
  });
  app.registerPage('/sample', fromVue3(Page));
}
```

Here we integrate the `i18next` plugin using the `i18next-vue` package. By defining the middleware using the `defineVue3Middleware` and the provided callback, we can integrate the plugin without requiring any access to the original `app` instance of Vue.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-vue-3` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromVue3 } from 'piral-vue-3/convert';
import VuePage from './Page.vue';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromVue3(VuePage));
}
```

Within Vue@3 components the Piral Vue@3 extension component can be used by referring to `extension-component`, e.g.,

```html
<extension-component name="name-of-extension"></extension-component>
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-vue-3` in your Piral instance.

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
npm i vue-loader @vue/compiler-sfc@^3 --save-dev
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
const extendWebpack = require('piral-vue-3/extend-webpack');

module.exports = extendWebpack({});
```

For using `piral-vue-3/extend-webpack` you must have installed:

- `vue-loader` (at least version 16)
- `@vue/compiler-sfc^3`
- `webpack`, e.g., via `piral-cli-webpack5`

You can do that via:

```sh
npm i vue-loader @vue/compiler-sfc^3 piral-cli-webpack5 --save-dev
```

The available options for `piral-vue-3/extend-webpack` are the same as for the options of the `vue-loader`, e.g.:

```js
const extendWebpack = require('piral-vue-3/extend-webpack');

module.exports = extendWebpack({
  enableTsInTemplate: true,
  customElement: /\.ce\.vue$/,
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
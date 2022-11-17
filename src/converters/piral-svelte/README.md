[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Svelte](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-svelte.svg?style=flat)](https://www.npmjs.com/package/piral-svelte) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that has no peer dependencies. What `piral-svelte` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Svelte converter for any component registration, as well as a `fromSvelte` shortcut together with a `svelte-extension` web component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromSvelte()`

Transforms a standard Svelte component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

## Usage

::: summary: For pilet authors

You can use the `fromSvelte` function from the Pilet API to convert your Svelte components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import SveltePage from './Page.svelte';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromSvelte(SveltePage));
}
```

Within Svelte components the Piral Svelte extension component can be used by referring to `svelte-extension`, e.g.,

```html
<svelte-extension name="name-of-extension"></svelte-extension>
```

Alternatively, if `piral-svelte` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromSvelte } from 'piral-svelte/convert';
import SveltePage from './Page.svelte';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromSvelte(SveltePage));
}
```

How you built your Svelte-pilet is up to you. If you use Webpack then the bundler options such as `piral-cli-webpack` or `piral-cli-webpack5` can be leveraged. In these cases you'd need to install the `svelte-loader` package and create a custom *webpack.config.js*:

```sh
npm i svelte-loader --save-dev
```

The Webpack configuration can be rather simplistic, as shown on the [svelte-loader readme](https://github.com/sveltejs/svelte-loader). In many cases you can use the convenience `extend-webpack` module.

This is how your *webpack.config.js* can look like with the convenience module:

```js
const extendWebpack = require('piral-svelte/extend-webpack');

module.exports = extendWebpack({});
```

For using `piral-svelte/extend-webpack` you must have installed:

- `svelte-loader`
- `webpack`, e.g., via `piral-cli-webpack5`

You can do that via:

```sh
npm i svelte-loader piral-cli-webpack5 --save-dev
```

The available options for `piral-svelte/extend-webpack` are the same as for the options of the `svelte-loader`, e.g.:

```js
const extendWebpack = require('piral-svelte/extend-webpack');

module.exports = extendWebpack({
  emitCss: false,
  compilerOptions: {
    css: false,
  },
});
```

You can also customize the options even more:

```js
const extendWebpack = require('piral-svelte/extend-webpack');

const applySvelte = extendWebpack({
  emitCss: false,
  compilerOptions: {
    css: false,
  },
});

module.exports = config => {
  config = applySvelte(config);

  // your changes to config

  return config;
};
```

:::

::: summary: For Piral instance developers

Using Svelte with Piral is as simple as installing `piral-svelte`. In the pilets using Svelte, `svelte` and `parcel-plugin-svelte` should be installed, too.

```ts
import { createSvelteApi } from 'piral-svelte';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createSvelteApi()],
  // ...
});
```

:::

## Pilet Usage

The essential registration can be simplified like (e.g., for a tile):

```ts
import { PiletApi } from 'sample-piral';
import Tile from './Tile.svelte';

export function setup(app: PiletApi) {
  app.registerTile(app.fromSvelte(Tile), {
    initialColumns: 2,
    initialRows: 2
  });
}
```

For the associated Svelte code the following (standard) form applies:

```svelte
<script>
  // use from props
  export let columns;
  export let rows;
</script>

<style>
  h1 {
    text-align: center;
  }
</style>

<h1>Hello {columns} x {rows}!</h1>
```

For Svelte to work the Svelte compiler and the associated Parcel plugin need to be installed.

```sh
npm i svelte parcel-plugin-svelte --save-dev
```

Furthermore, since Svelte distributes its source code as ES6 we need to change the `browserslist` setting in the *package.json* of the pilet:

```json
{
  // ...
  "browserslist": [
    "last 1 chrome versions"
  ],
}
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

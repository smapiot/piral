[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Svelte](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-svelte.svg?style=flat)](https://www.npmjs.com/package/piral-svelte) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-svelte` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

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
  extendApi: [createSvelteApi()],
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

Furthermore, since Svelte distributes its source code as ES6 we need to change the browserlist setting in the *package.json* of the pilet:

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

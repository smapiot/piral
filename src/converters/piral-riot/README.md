[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Riot](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-riot.svg?style=flat)](https://www.npmjs.com/package/piral-riot) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `riot`. What `piral-riot` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Riot.js converter for any component registration, as well as a `fromRiot` shortcut and a `RiotExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromRiot()`

Transforms a standard Riot.js component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `RiotExtension`

The extension slot component to be used in Riot.js component.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-riot` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromRiot, createRiotExtension } from 'piral-riot/convert';
import { createRiotPage } from './page';

export function setup(piral: PiletApi) {
  const Extension = createRiotExtension(piral);
  const RiotPage = createRiotPage(Extension);
  piral.registerPage('/sample', fromRiot(RiotPage));
}
```

Within Riot components the Piral Riot extension component can be used by referring to `RiotExtension`, e.g.,

```html
<riot-extension name="name-of-extension"></riot-extension>
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-riot` in your Piral instance.

Using Riot.js with Piral is as simple as installing `piral-riot` and `riot@^4`.

```ts
import { createRiotApi } from 'piral-riot';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createRiotApi()],
  // ...
});
```

The `riot` package should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "riot": ""
    }
  }
}
```
:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
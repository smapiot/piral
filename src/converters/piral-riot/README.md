[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Riot](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-riot.svg?style=flat)](https://www.npmjs.com/package/piral-riot) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

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

::: summary: For pilet authors

You can use the `fromRiot` function from the Pilet API to convert your Riot.js components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { createRiotPage } from './page';

export function setup(piral: PiletApi) {
  const RiotPage = createRiotPage(piral.RiotExtension);
  piral.registerPage('/sample', piral.fromRiot(RiotPage));
}
```

Within Riot components the Piral Riot extension component can be used by referring to `RiotExtension`, e.g.,

```html
<riot-extension name="name-of-extension"></riot-extension>
```

Alternatively, if `piral-riot` has not been added to the Piral instance you can install and use the package also from a pilet directly.

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

:::

::: summary: For Piral instance developers

Using Riot.js with Piral is as simple as installing `piral-riot` and `riot`.

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
  "pilets": {
    "externals": [
      "riot"
    ]
  }
}
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

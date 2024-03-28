[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Ember](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ember.svg?style=flat)](https://www.npmjs.com/package/piral-ember) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `ember-source`. What `piral-ember` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Ember.js converter for any component registration, as well as a `fromEmber` shortcut and a `EmberExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromEmber()`

Transforms a standard Ember.js component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

## Usage

::: summary: For pilet authors

You can use the `fromEmber` function from the Pilet API to convert your Ember.js components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { Page } from './Page';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromEmber(Page));
}
```

Within Ember.js components the Piral Ember.js extension component can be used by referring to `EmberExtension`, e.g.,

```html
<ember-extension name="name-of-extension"></ember-extension>
```

Alternatively, if `piral-ember` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromEmber } from 'piral-ember/convert';
import { Page } from './Page';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromEmber(Page));
}
```

:::

::: summary: For Piral instance developers

Using Ember.js with Piral is as simple as installing `piral-ember` and `ember-source@^3`.

```ts
import { createEmberApi } from 'piral-ember';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createEmberApi()],
  // ...
});
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

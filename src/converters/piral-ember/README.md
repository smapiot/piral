[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Ember](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ember.svg?style=flat)](https://www.npmjs.com/package/piral-ember) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-ember` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Ember.js converter for any component registration, as well as a `fromEmber` shortcut and a `EmberExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromEmber()`

Transforms a standard Ember.js component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `EmberExtension`

(tbd)

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

:::

::: summary: For Piral instance developers

Using Ember.js with Piral is as simple as installing `piral-ember` and `ember-source`.

```ts
import { createEmberApi } from 'piral-ember';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createEmberApi()],
  // ...
});
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

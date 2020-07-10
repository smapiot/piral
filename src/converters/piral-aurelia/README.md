[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Aurelia](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-aurelia.svg?style=flat)](https://www.npmjs.com/package/piral-aurelia) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-aurelia` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Aurelia converter for any component registration, as well as a `fromAurelia` shortcut and a `AureliaExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromAurelia()`

Transforms a standard Aurelia component (View Model) into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `AureliaExtension`

The extension slot component to be used in Aurelia component. This is not really needed, as it is made available automatically via an Aurelia custom element named `extension-component`.

## Usage

> For authors of pilets

You can use the `fromAurelia` function from the Pilet API to convert your Aurelia components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { AureliaPage } from './AureliaPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromAurelia(AureliaPage));
}
```

Within Aurelia components the Piral Aurelia extension component can be used by referring to `extension-component`, e.g.,

```html
<extension-component name="name-of-extension"></extension-component>
```

## Setup and Bootstrapping

> For Piral instance developers

Using Aurelia with Piral is as simple as installing `piral-aurelia` and `aurelia-framework`.

```ts
import 'aurelia-framework';
import { createAureliaApi } from 'piral-aurelia';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createAureliaApi()],
  // ...
});
```

The `aurelia` related packages should be shared with the pilets via the *package.json*:

```json
{
  "pilets": {
    "externals": [
      "aurelia-framework",
      "aurelia-templating-binding",
      "aurelia-templating-resources",
      "aurelia-pal-browser",
      "aurelia-event-aggregator",
      "aurelia-history-browser"
    ]
  }
}
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Aurelia](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-aurelia.svg?style=flat)](https://www.npmjs.com/package/piral-aurelia) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `aurelia-framework` and related packages. What `piral-aurelia` brings to the table is a converter for pilets using Aurelia.

The converter includes an Aurelia converter for any component registration, as well as a `fromAurelia` shortcut and a `AureliaExtension` component.

## Documentation

This package provides a converter that can be used to render Aurelia components in Piral.

### `fromAurelia()`

Transforms a standard Aurelia component (View Model) into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `AureliaExtension`

The extension slot component to be used in Aurelia component. This is not really needed, as it is made available automatically via an Aurelia custom element named `extension-component`.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-aurelia` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromAurelia } from 'piral-aurelia/convert';
import { AureliaPage } from './AureliaPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromAurelia(AureliaPage));
}
```

Within Aurelia components the Piral Aurelia extension component can be used by referring to `extension-component`, e.g.,

```html
<extension-component name="name-of-extension"></extension-component>
```

:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-aurelia` in your Piral instance. In this case, the `fromAurelia` function is automatically exposed on the Pilet API.

The integration looks like:

```ts
import { createAureliaApi } from 'piral-aurelia';

const instance = createInstance({
  // important part
  plugins: [createAureliaApi()],
  // ...
});
```

Now, in your pilets you can use the `fromAurelia` function from the Pilet API to convert your Aurelia components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { AureliaPage } from './AureliaPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromAurelia(AureliaPage));
}
```

The `aurelia` related packages should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "aurelia-framework": "",
      "aurelia-templating-binding": "",
      "aurelia-templating-resources": "",
      "aurelia-pal-browser": "",
      "aurelia-event-aggregator": "",
      "aurelia-history-browser": ""
    }
  }
}
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

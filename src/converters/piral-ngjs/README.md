[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral NgJS](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ngjs.svg?style=flat)](https://www.npmjs.com/package/piral-ngjs) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `angular`. What `piral-ngjs` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Angular.js converter for any component registration, as well as a `fromNgjs` shortcut and a `NgjsExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromNgjs()`

Transforms a standard Angular.js module with a named component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `NgjsExtension`

The extension slot module to be referenced in Angular.js module definitions. Allows using an Angular.js custom element named `extension-component`.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-ngjs` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromNgjs, createNgjsExtension } from 'piral-ngjs/convert';
import { createAngularJsPage } from './AngularJsPage';

export function setup(piral: PiletApi) {
  const Extension = createNgjsExtension();
  const AngularJsPage = createAngularJsPage(Extension.name);
  piral.registerPage('/sample', fromNgjs(AngularJsPage));
}
```

Within Angular.js components the Piral Angular.js extension component can be used by referring to `NgjsExtension`, e.g.,

```html
<extension-component name="name-of-extension"></extension-component>
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-ngjs` in your Piral instance.

The provided library only brings API extensions for pilets to a Piral instance. The Piral instance still needs to be configured properly to support Angular.js 1.x. For this you'll need to install the `angular@^1.7` package.

For the setup itself you'll need to import `createNgjsApi` from the `piral-ngjs` package.

```ts
import { createNgjsApi } from 'piral-ngjs';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createNgjsApi()],
  // ...
});
```

The `angular` package should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "angular": ""
    }
  }
}
```
:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral LitEl](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-litel.svg?style=flat)](https://www.npmjs.com/package/piral-litel) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `lit-element`. What `piral-litel` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a LitElement converter for any component registration, as well as a `fromLitEl` shortcut and a `LitElExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromLitEl()`

Transforms a standard LitElement component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `LitElExtension`

The name of the extension slot component to be used in LitElement components. This is usually not needed, as it is made available via a custom element named `litel-extension`. For safety measure `LitElExtension.name` could be used to find the name of the custom element.

## Usage

::: summary: For pilet authors

You can use the `fromLitEl` function from the Pilet API to convert your LitElement components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import './LitElPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromLitel('my-page'));
}
```

Within LitElement components the Piral LitElement extension component can be used by referring to `litel-extension`, e.g.,

```html
<litel-extension name="name-of-extension"></litel-extension>
```

Alternatively, if `piral-litel` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromLitel } from 'piral-litel/convert';
import './LitElPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromLitel('my-page'));
}
```

:::

::: summary: For Piral instance developers

Using LitElement with Piral is as simple as installing `piral-litel` and `lit-element`.

```ts
import { createLitElApi } from 'piral-litel';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createLitElApi()],
  // ...
});
```

The `lit-element` and `@webcomponents/webcomponentsjs` packages should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "@webcomponents/webcomponentsjs": "",
      "lit-element": ""
    }
  }
}
```

:::

## Preparing Pilets

Unfortunately, LitElement is quite sensitive regarding how its transpiled. Right now the only way to be sure that classes are indeed transpiled as they should (from perspective of LitElement) is to place the following snippet in the *package.json* of each pilet using `piral-litel`:

```json
{
  // ...
  "browserslist": [
    "last 1 chrome versions"
  ],
  // ...
}
```

This will make sure that ES6 classes are used, which is required for web components to work properly.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

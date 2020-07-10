[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Ng](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ng.svg?style=flat)](https://www.npmjs.com/package/piral-ng) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-ng` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Angular converter for any component registration, as well as a `fromNg` shortcut and a `NgExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromNg()`

Transforms a standard Angular component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `NgExtension`

The extension slot module to be used in Angular components. This is not really needed, as it is made available automatically via an Angular custom element named `extension-component`.

## Usage

::: summary: For pilet authors

You can use the `fromNg` function from the Pilet API to convert your Angular components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { AngularPage } from './AngularPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromNg(AngularPage));
}
```

Within Angular components the Piral Angular extension component can be used by referring to `extension-component`, e.g.,

```html
<extension-component name="name-of-extension"></extension-component>
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance. The Piral instance still needs to be configured properly to support Angular 2+.

The following polyfills / vendor libs should be imported *before* any other package.

```ts
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@core-js/es7/reflect';
import 'zone.js/dist/zone';
```

Furthermore, switching on the production mode may be useful.

```ts
import { enableProdMode } from '@angular/core';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}
```

For the setup itself you'll need to import `createNgApi` from the `piral-ng` package.

```ts
import { createNgApi } from 'piral-ng';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createNgApi()],
  // ...
});
```

The related packages should be shared with the pilets via the *package.json*:

```json
{
  "pilets": {
    "externals": [
      "@angular/common",
      "@angular/compiler",
      "@angular/core",
      "@angular/platform-browser",
      "@angular/platform-browser-dynamic",
      "rxjs",
      "zone.js"
    ]
  }
}
```

Depending on your Angular needs you'd want to share more packages.

:::

## Injected Services

Depending on the mounted component different services are injected. the following table lists the names of the injected services per component type.

| Component | Props            | Piral   | Context   |
|-----------|------------------|---------|-----------|
| Tile      | `TileProps`      | `Piral` | `Context` |
| Page      | `PageProps`      | `Piral` | `Context` |
| Modal     | `ModalProps`     | `Piral` | `Context` |
| Extension | `ExtensionProps` | `Piral` | `Context` |
| Menu      | `MenuProps`      | `Piral` | `Context` |

To use such a service the `@Inject` decorator should be used with the explicit name.

The following code snippet illustrates the injection of the `TileProps` service into a sample tile component.

```ts
@Component({
  template: `
    <div class="tile">
      <p>{{ props.rows }} rows and {{ props.columns }} columns</p>
    </div>
  `,
})
export class SampleTileComponent {
  constructor(@Inject('TileProps') public props: TileComponentProps<any>) {}
}
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

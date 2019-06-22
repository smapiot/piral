[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Ng](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ng.svg?style=flat)](https://www.npmjs.com/package/piral-ng) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-ng` brings to the table is a set of API extensions that can be used with `piral` or `piral-core`. By default, these extensions are not integrated in `piral`, so you'd need to add them to your Piral instance. The set includes an `register...Ng` method for each `register...X` method of the standard API surface.

## Documentation

For details on the provided API check out the [documentation at the Piral website](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/master/docs).

## Setup and Bootstrapping

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
import { enableProdMod } from '@angular/core';

if (process.env.NODE_ENV === 'production') {
  enableProdMod();
}
```

For the setup itself you'll need to import `createNgApi` from the `piral-ng` package.

```tsx
import { createNgApi } from 'piral-ng';
```

For the integration this depends on the Piral instance.

For `piral-core`-based instances this boils down to:

```ts
const PiralInstance = createInstance({
  // important part
  extendApi(api) {
    return {
      ...createNgApi(api),
      ...api,
    };
  },
  // ...
});
```

For `piral`-based instances the integration looks like:

```tsx
renderInstance({
  // important part
  extensions: {
    api: [createNgApi],
  },
  // ...
});
```

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

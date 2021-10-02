[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Ng](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ng.svg?style=flat)](https://www.npmjs.com/package/piral-ng) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

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

Angular Options:

You can optionally provide Options to `fromNg`, which are identical to those given to `bootstrapModule` during the Angular boot process. See https://angular.io/api/core/PlatformRef#bootstrapModule for possible values.

This is mainly used to allow an Angular Pilet to run without `zone.js` as described [here](https://angular.io/guide/zone#noopzone).

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { AngularPage } from './AngularPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromNg(AngularPage, { ngZone: 'noop' }));
}
```

Within Angular components the Piral Angular extension component can be used by referring to `extension-component`, e.g.,

```html
<extension-component name="name-of-extension"></extension-component>
```

For specifying `params` you may use data binding. Example:

```html
<extension-component name="foo" [params]="{ foo: 2, bar: 'hello' }"></extension-component>
```

Alternatively, if `piral-ng` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromNg } from 'piral-ng/convert';
import { AngularPage } from './AngularPage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromNg(AngularPage));
}
```
:::

For components, such as the `AngularPage` a `template` should be specified.

```ts
import { Component } from '@angular/core';

@Component({
  template: `
    <div class="page">
      <h3>Angular Page: {{ counter }}</h3>
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
    </div>
  `,
})
export class AngularPage {
  public counter = 0;

  constructor() {}

  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }
}
```

::: warning: Prefer not to use `templateUrl`
In many Angular projects you still find `templateUrl`, which would be transformed to a `template` by the Angular CLI during build. If you want to achieve the same using, e.g., Webpack, then use a custom loader such as [angularjs-template-loader](https://www.npmjs.com/package/angularjs-template-loader).

The same issue applies to `styleUrls`, which should be replaced by `styles`.

If you still need to use `templateUrl` then take a look below at the Webpack config file.
:::

If you don't want to inline the `template` then just `require` the contents, e.g.,

```js
// ...
@Component({
  template: require('./AngularPage.html'),
})
export class AngularPage { /* ... */ }
```

where you may need to tell your bundler how to treat these HTML files (i.e., transform these references to strings directly in the bundle).

As an alternative, consider using Webpack with the `@ngtools/webpack` library. This allows you have a *webpack.config.js* like:

```js
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const CopyPlugin = require("copy-webpack-plugin");
const { resolve } = require("path");

module.exports = (config) => {
  config.module.rules.filter(m => m.test.toString() === /\.css$/i.toString()).forEach(m => {
    m.exclude = /\.component.css$/i;
  });

  config.module.rules.filter(m => m.test.toString() === /\.s[ac]ss$/i.toString()).forEach(m => {
    m.exclude = /\.component.s[ac]ss$/i;
  });

  const ruleIndex = config.module.rules.findIndex(m => m.test.toString() === /\.tsx?$/i.toString());

  config.module.rules.splice(ruleIndex, 1,
    {
      test: /\.[jt]sx?$/,
      loader: '@ngtools/webpack',
    },
    {
      test: /\.component.css$/i,
      use: ["to-string-loader", "css-loader?esModule=false"],
    },
    {
      test: /\.component.s[ac]ss$/i,
      use: ["to-string-loader", "css-loader?esModule=false", "sass-loader"],
    });

  config.plugins.push(
    new AngularWebpackPlugin({
      tsconfig: 'tsconfig.json',
      jitMode: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: resolve(__dirname, "src/assets") },
      ],
    }),
  )


  return config;
};
```

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance. The Piral instance still needs to be configured properly to support Angular 2+.

The following polyfills / vendor libs should be imported *before* any other package.

```ts
import 'core-js/es/reflect';
import 'core-js/stable/reflect';
import 'core-js/features/reflect';
import 'zone.js';
```

For the setup itself you'll need to import `createNgApi` from the `piral-ng` package.

```ts
import { createNgApi } from 'piral-ng';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createNgApi()],
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

| Component | Props   | Piral   | Context   |
|-----------|---------|---------|-----------|
| Tile      | `Props` | `piral` | `Context` |
| Page      | `Props` | `piral` | `Context` |
| Modal     | `Props` | `piral` | `Context` |
| Extension | `Props` | `piral` | `Context` |
| Menu      | `Props` | `piral` | `Context` |

To use such a service the `@Inject` decorator should be used with the explicit name.

The following code snippet illustrates the injection of the `Props` service from an `TileProps` interface into a sample tile component.

```ts
@Component({
  template: `
    <div class="tile">
      <p>{{ props.rows }} rows and {{ props.columns }} columns</p>
    </div>
  `,
})
export class SampleTileComponent {
  constructor(@Inject('Props') public props: TileComponentProps<any>) {}
}
```

## Angular Versions

This plugin works with all versions of Angular (right now 2 - 12). Support for Angular.js (also known as Angular 1) is given via `piral-ngjs`.

### Angular 2

Angular 2 works with some configuration (see below) even though the usage of annotations (internally) is slightly different in `piral-ng`.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^2",
  "@angular/compiler": "^2",
  "@angular/core": "^2",
  "@angular/platform-browser": "^2",
  "@angular/platform-browser-dynamic": "^2",
  "core-js": "^3.15.2",
  "rxjs": "^5.0",
  "zone.js": "~0.9"
}
```

### Angular 3

Was never released. Not covered.

### Angular 4

Angular 4 works even though the usage of annotations (internally) is slightly different in `piral-ng`.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^4",
  "@angular/compiler": "^4",
  "@angular/core": "^4",
  "@angular/platform-browser": "^4",
  "@angular/platform-browser-dynamic": "^4",
  "core-js": "^3.15.2",
  "rxjs": "^5.0.0",
  "zone.js": "~0.9"
}
```

### Angular 5

In general, Angular 5 seems to work.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^4",
  "@angular/compiler": "^4",
  "@angular/core": "^4",
  "@angular/platform-browser": "^4",
  "@angular/platform-browser-dynamic": "^4",
  "core-js": "^3.15.2",
  "rxjs": "^5.0.0",
  "zone.js": "~0.9"
}
```

### Angular 6

In general, Angular 6 seems to work.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^6",
  "@angular/compiler": "^6",
  "@angular/core": "^6",
  "@angular/platform-browser": "^6",
  "@angular/platform-browser-dynamic": "^6",
  "core-js": "^3.15.2",
  "rxjs": "^6.0.0",
  "zone.js": "~0.9"
}
```

### Angular 7

In general, Angular 7 seems to work.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^6",
  "@angular/compiler": "^6",
  "@angular/core": "^6",
  "@angular/platform-browser": "^6",
  "@angular/platform-browser-dynamic": "^6",
  "core-js": "^3.15.2",
  "rxjs": "^6.0.0",
  "zone.js": "~0.9"
}
```

### Angular 8

In general, Angular 8 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^8",
  "@angular/compiler": "^8",
  "@angular/core": "^8",
  "@angular/platform-browser": "^8",
  "@angular/platform-browser-dynamic": "^8",
  "core-js": "^3.15.2",
  "rxjs": "^6.0.0",
  "zone.js": "~0.9"
}
```

### Angular 9

In general, Angular 9 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^9",
  "@angular/compiler": "^9",
  "@angular/core": "^9",
  "@angular/platform-browser": "^9",
  "@angular/platform-browser-dynamic": "^9",
  "core-js": "^3.15.2",
  "rxjs": "~6.4",
  "zone.js": "~0.9"
}
```

### Angular 10

In general, Angular 10 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^10",
  "@angular/compiler": "^10",
  "@angular/core": "^10",
  "@angular/platform-browser": "^10",
  "@angular/platform-browser-dynamic": "^10",
  "core-js": "^3.15.2",
  "rxjs": "~6.4",
  "zone.js": "~0.9"
}
```

### Angular 11

In general, Angular 11 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^11",
  "@angular/compiler": "^11",
  "@angular/core": "^11",
  "@angular/platform-browser": "^11",
  "@angular/platform-browser-dynamic": "^11",
  "core-js": "^3.15.2",
  "rxjs": "~6.4",
  "zone.js": "~0.9"
}
```

### Angular 12

In general, Angular 12 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^12",
  "@angular/compiler": "^12",
  "@angular/core": "^12",
  "@angular/platform-browser": "^12",
  "@angular/platform-browser-dynamic": "^12",
  "core-js": "^3.15.2",
  "rxjs": "~6.4",
  "zone.js": "~0.9"
}
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

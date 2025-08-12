[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Ng](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ng.svg?style=flat)](https://www.npmjs.com/package/piral-ng) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `rxjs`, `@angular/core` and related packages. What `piral-ng` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Angular converter for any component registration, as well as a `fromNg` shortcut, a `defineNgModule` function, and a `NgExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `defineNgModule()`

Communicates the usage of a pre-defined Angular module to Piral. Components declared/exported in the module will be bootstrapped within this module.

### `fromNg()`

Transforms a standard Angular component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `NgExtension`

The extension slot module to be used in Angular components. This is not really needed, as it is made available automatically via an Angular custom element named `extension-component`.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-ng` from your pilets. In this case, no registration in the Piral instance is required.

### Example Usage

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromNg, defineNgModule } from 'piral-ng/convert';
import { AngularPage } from './AngularPage';
import { AngularModule } from './AngularModule';

export function setup(piral: PiletApi) {
  defineNgModule(AngularModule);

  piral.registerPage('/sample', fromNg(AngularPage));
}
```

We recommend that you still put these components into modules as you would normally do. In order for Piral to use that module you need to define it first. This also allows you to use special Piral declarations such as the `NgExtension` or the `ResourceUrlPipe`. All these declarations come with the `SharedModule` available via import from `piral-ng-common`.

Example (app) module:

```ts
import { NgModule } from '@angular/core';
import { SharedModule } from 'piral-ng-common';
import { AngularPage } from './AngularPage';

@NgModule({
  imports: [SharedModule],
  declarations: [AngularPage],
  exports: [AngularPage]
})
export class AppModule {}
```

### Lazy Loading

Even better, you can also lazy load the respective Angular module and components using the callback-based overload of `defineNgModule`:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { defineNgModule } from 'piral-ng/convert';

export function setup(piral: PiletApi) {
  // this "teaches" Piral about the given module, which is lazy loaded
  // important; in this case `./AppModule.ts` has a `default` export
  const loadComponent = defineNgModule(() => import('./AppModule'));

  // to fully lazy load we cannot reference the class anymore;
  // instead we reference the selector of the component
  piral.registerPage('/sample', loadComponent('angular-page'));
}
```

In the example above, the `AngularPage` would have been defined to look like

```js
// ...
@Component({
  // ...
  selector: 'angular-page',
})
export class AngularPage { /* ... */ }
```

which defines the selector (`angular-page`) matching the specified selector in the `setup` function.

### Standalone Components

The `piral-ng` plugin also supports Angular standalone components as rendering source. For this we have two modes:

#### Legacy Standalone Mode

This mode works with `piral-ng` itself, i.e., integrated in the app shell. It also works in a mix with modules.

Standalone components can also be used with lazy loading.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromNg } from 'piral-ng/convert';

export function setup(piral: PiletApi) {
  // Just make sure that `AngularPage` exports the component as `default` export
  piral.registerPage('/sample', fromNg(() => import('./AngularPage')));
}
```

#### Isolated Standalone Mode

This mode works only with `piral-ng/standalone`, which has to be used in a pilet directly (as a replacement for `piral-ng/convert`). It does not mix with modules - as components need to be proper standalone entry points.

```ts
import "core-js/proposals/reflect-metadata";
import "zone.js";
import { createConverter } from 'piral-ng/standalone';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { PiletApi } from '<name-of-piral-instance>';
import { AngularPage } from './AngularPage';

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      {
        path: "sample",
        component: AngularPage,
      },
    ]),
  ],
};

export function setup(piral: PiletApi) {
  const fromNg = createConverter(appConfig);
  
  piral.registerPage('/sample', fromNg(AngularPage));
}
```

Lazy loading is still possible, e.g., over the `loadComponent` from the routes definition or by supplying a callback to the `fromNg` function, e.g.:

```ts
import "core-js/proposals/reflect-metadata";
import "zone.js";
import { createConverter } from "piral-ng/standalone";
import { ApplicationConfig } from "@angular/core";
import type { PiletApi } from "sample-piral";

const appConfig: ApplicationConfig = {
  providers: [],
};

export function setup(app: PiletApi) {
  const fromNg = createConverter(appConfig);

  app.registerExtension('foo', fromNg(() => import('./app/extension.component')));
}

```

### Angular Options

You can optionally provide Options to `defineNgModule`, which are identical to those given to `bootstrapModule` during the Angular boot process. See https://angular.io/api/core/PlatformRef#bootstrapModule for possible values.

This is mainly used to allow an Angular Pilet to run without `zone.js` as described [here](https://angular.io/guide/zone#noopzone).

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { defineNgModule } from 'piral-ng/convert';
import { AppModule } from './AppModule';
import { AngularPage } from './AngularPage';

export function setup(piral: PiletApi) {
  defineNgModule(AppModule, { ngZone: 'noop' });

  piral.registerPage('/sample', piral.fromNg(AngularPage));
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

The `ResourceUrlPipe` is there to get the correct paths for images that are just copied to the output directory. The pipe can be used in HTML like this:

```html
<img width="250" [src]="'images/coffee.jpg' | resourceUrl" alt="Coffee" />
```

In the example the relative path `images/coffee.jpg` will be expanded to a full URL rooted at the pilet's origin.

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

  const cssLoaderNoModule = {
    loader: require.resolve('css-loader'),
    options: {
      esModule: false,
    },
  };

  const htmlLoaderNoModule = {
    loader: require.resolve('html-loader'),
    options: {
      esModule: false,
    },
  };

  const ruleIndex = config.module.rules.findIndex(m => m.test.toString() === /\.tsx?$/i.toString());

  config.module.rules.splice(ruleIndex, 1,
    {
      test: /\.[jt]sx?$/,
      loader: '@ngtools/webpack',
    },
    {
      test: /\.component.html$/i,
      use: ["to-string-loader", htmlLoaderNoModule],
    },
    {
      test: /\.component.css$/i,
      use: ["to-string-loader", cssLoaderNoModule],
    },
    {
      test: /\.component.s[ac]ss$/i,
      use: ["to-string-loader", cssLoaderNoModule, "sass-loader"],
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

**Note**: You must install these dependencies (also things like `copy-webpack-plugin`) yourself. `piral-ng` does not come with any dependencies for development.
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-ng` in your Piral instance.

The provided library only brings API extensions for pilets to a Piral instance. The Piral instance still needs to be configured properly to support Angular 2+.

The following (Angular) packages should be installed:

- `@angular/common`
- `@angular/core`
- `@angular/platform-browser`
- `@angular/platform-browser-dynamic`
- `@angular/router`
- `rxjs`

The following polyfills/vendor libs should be imported *before* any other package.

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
  "importmap": {
    "imports": {
      "@angular/common": "",
      "@angular/compiler": "",
      "@angular/core": "",
      "@angular/platform-browser": "",
      "@angular/platform-browser-dynamic": "",
      "piral-ng-common": "",
      "rxjs": "",
      "zone.js": ""
    }
  }
}
```

Depending on your Angular needs you'd want to share more packages.
:::

## Injected Services

Depending on the mounted component different services are injected. the following table lists the names of the injected services per component type.

**Important**: These are all meant as constructor injectors. As injected services are always singletons in Angular you will *never* receive a changed value on them. Therefore, only use these values in the constructor and **don't** capture them. You might capture / store values *inside* the props (e.g., `props.params`), but don't capture the injected props. Instead, use `@Input` (see next section) if you need to continuously monitor the props.

| Component | Props   | Piral   | Context   |
|-----------|---------|---------|-----------|
| Tile      | `Props` | `piral` | `Context` |
| Page      | `Props` | `piral` | `Context` |
| Modal     | `Props` | `piral` | `Context` |
| Extension | `Props` | `piral` | `Context` |
| Menu      | `Props` | `piral` | `Context` |

`piral-ng` also exports typed `InjectionToken` constants compatible with Angular's `inject` function:
- `PROPS`
- `PIRAL`
- `CONTEXT`

To use such a service you should:
- either use the `@Inject` parameter decorator with the explicit name
- or use the `inject` function with the imported token

The following code snippet illustrates the injection of the `Props` service from an `TileProps` interface into a sample tile component.

```ts
@Component({
  template: `
    <div class="tile">
      <p>{{ rows }} rows and {{ cols }} columns</p>
    </div>
  `,
})
export class SampleTileComponent {
  constructor(@Inject('Props') props: TileComponentProps<any>) {
    this.rows = props.rows;
    this.cols = props.columns;
  }
}
```

## Dynamic Props

For `Props` there is also the possibility to use `@Input` for making them reactive, i.e., notify the Angular component when they changed.

```ts
@Component({
  template: `
    <div class="tile">
      <p>{{ props.rows }} rows and {{ props.columns }} columns</p>
    </div>
  `,
})
export class SampleTileComponent {
  @Input('Props') public props: TileComponentProps<any>;

  constructor() {}
}
```

Starting with Angular 19 you can also use signal inputs instead of `@Input` properties. Same example as above:

```ts
@Component({
  template: `
    <div class="tile">
      <p>{{ props().rows }} rows and {{ props().columns }} columns</p>
    </div>
  `,
})
export class SampleTileComponent {
  public readonly props = input<TileComponentProps<any>>(undefined, {
    alias: "Props",
  });

  constructor() {}
}
```

## Converting an Angular Application to a Pilet

Depending on the kind of Angular application this may be rather straight forward or very difficult. Since we cannot discuss all possible edge cases we will assume the standard scenario. If you need more help then don't hesitate to contact us.

First, you'll need to get rid of the Angular CLI. In most cases adding a Webpack configuration should be sufficient. The Webpack configuration can be similar to the one presented above. In many cases you can use the convenience `extend-webpack` module.

This is how your *webpack.config.js* can look like:

```js
const extendWebpack = require('piral-ng/extend-webpack');

module.exports = extendWebpack({
  ngOptions: {
    jitMode: false,
  },
});
```

For using `piral-ng/extend-webpack` you must have installed:

- `copy-webpack-plugin`
- `@ngtools/webpack`
- `to-string-loader`
- `html-loader`
- `webpack`, e.g., via `piral-cli-webpack5`

You can do that via:

```sh
npm i copy-webpack-plugin @ngtools/webpack to-string-loader html-loader piral-cli-webpack5 --save-dev
```

The available options for `piral-ng/extend-webpack` are:

- `ngOptions` (providing input to the `AngularWebpackPlugin` class)
- `patterns` (providing input to the Webpack `copy-webpack-plugin`)
- `compilerOptions` (providing input to the `angularCompilerOptions` section of the *tsconfig.json*)

For AoT (i.e. `jitMode: false`) to work correctly the `compilationMode: 'partial'` has to be set. If you use the `piral-ng/extend-webpack` helper as shown above this will be configured correctly for you.

::: failure: AoT does not work with dependency sharing
For AoT to work correctly the Angular sources need to be bundled. This is not the case in scenarios where you installed `piral-ng` as a plugin in your shell or distribute the Angular packages as shared dependencies from your app shell.
:::

If you have set up the build process then you need to make sure that your application has an entry point (*index.ts*). That entry point has to be a valid pilet entry module. It may look as follows:

```ts
import { PiletApi } from '<your-app-shell>';

export function setup(api: PiletApi) {

}
```

You can remove your *main.ts* (or similar) containing

```ts
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

as the bootstrapping is done by Piral. Instead, you now need to define your `AppModule` in the pilet:

```ts
import { PiletApi } from '<your-app-shell>';
import { AppModule } from './app/AppModule.ts';

export function setup(api: PiletApi) {
  api.defineNgModule(AppModule);
}
```

Now you can register the exported components from the `AppModule` in the various parts. Example:

```ts
import { PiletApi } from '<your-app-shell>';
import { AppModule } from './app/AppModule.ts';
import { AppComponent } from './app/AppComponent.ts';

export function setup(api: PiletApi) {
  api.defineNgModule(AppModule);

  api.registerPage('/foo/*', api.fromNg(AppComponent));
}
```

In the given example we register a single page, however, with all subpages resolving to the same page. Within the page we may use the Angular Router to determine what content to show.

The content may remain pretty much unchanged. Routing should be done either via the Angular Router (internal) or via the React Router (across components) automatically. The thing you'll need to pay attention to is the usage of resources. Since the resource will be available available to the location of the pilet (e.g., if the pilet's main bundle is located at `https://yourcdn.com/your-pilet/1.0.0/index.js` then resources need to be relative to `https://yourcdn.com/your-pilet/1.0.0/`).

In general you may also want to convert the `templateUrl` (and `styleUrls`) properties of your components (to `template` and `styles`). If you set up the bundler as recommended then it would still work though.

::: warning: Prefer not to use `templateUrl`
In many Angular projects you still find `templateUrl`, which would be transformed to a `template` by the Angular CLI during build. If you want to achieve the same using, e.g., Webpack, then use a custom loader such as [angularjs-template-loader](https://www.npmjs.com/package/angularjs-template-loader).

The same issue applies to `styleUrls`, which should be replaced by `styles`.

If you still need to use `templateUrl` (or `styleUrls`) then take a look below at the Webpack config file.
:::

## Angular Versions

This plugin works with recent versions of Angular (right now 9 - 16). Support for Angular.js (also known as Angular 1) is given via `piral-ngjs`.

### Angular 9

In general, Angular 9 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^9",
  "@angular/compiler": "^9",
  "@angular/core": "^9",
  "@angular/router": "^9",
  "@angular/platform-browser": "^9",
  "@angular/platform-browser-dynamic": "^9",
  "core-js": "^3",
  "rxjs": "~6.5",
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
  "@angular/router": "^10",
  "@angular/platform-browser": "^10",
  "@angular/platform-browser-dynamic": "^10",
  "core-js": "^3",
  "rxjs": "~6.5",
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
  "@angular/router": "^11",
  "@angular/platform-browser": "^11",
  "@angular/platform-browser-dynamic": "^11",
  "core-js": "^3",
  "rxjs": "~6.5",
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
  "@angular/router": "^12",
  "@angular/platform-browser": "^12",
  "@angular/platform-browser-dynamic": "^12",
  "core-js": "^3",
  "rxjs": "~6.4",
  "zone.js": "0.11.4"
}
```

### Angular 13

In general, Angular 13 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^13",
  "@angular/compiler": "^13",
  "@angular/core": "^13",
  "@angular/router": "^13",
  "@angular/platform-browser": "^13",
  "@angular/platform-browser-dynamic": "^13",
  "core-js": "^3",
  "rxjs": "^7.4",
  "zone.js": "0.11.4"
}
```

Besides the usual imports the explicit import of the `@angular/compiler` package may be necessary.

So include in your app shell as preamble:

```js
import 'core-js/proposals/reflect-metadata';
import '@angular/compiler';
```

### Angular 14

In general, Angular 14 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^14",
  "@angular/compiler": "^14",
  "@angular/core": "^14",
  "@angular/router": "^14",
  "@angular/platform-browser": "^14",
  "@angular/platform-browser-dynamic": "^14",
  "core-js": "^3",
  "rxjs": "^7.4",
  "zone.js": "~0.12"
}
```

Besides the usual imports the explicit import of the `@angular/compiler` package may be necessary.

So include in your app shell as preamble:

```js
import 'core-js/proposals/reflect-metadata';
import '@angular/compiler';
```

### Angular 15

In general, Angular 15 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^15",
  "@angular/compiler": "^15",
  "@angular/core": "^15",
  "@angular/router": "^15",
  "@angular/platform-browser": "^15",
  "@angular/platform-browser-dynamic": "^15",
  "core-js": "^3",
  "rxjs": "^7.4",
  "zone.js": "~0.13"
}
```

Besides the usual imports the explicit import of the `@angular/compiler` package may be necessary.

So include in your app shell as preamble:

```js
import 'core-js/proposals/reflect-metadata';
import '@angular/compiler';
```

### Angular 16

In general, Angular 16 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^16",
  "@angular/compiler": "^16",
  "@angular/core": "^16",
  "@angular/router": "^16",
  "@angular/platform-browser": "^16",
  "@angular/platform-browser-dynamic": "^16",
  "core-js": "^3",
  "rxjs": "^7.4",
  "zone.js": "~0.13"
}
```

Besides the usual imports, the explicit import of the `@angular/compiler` package may be necessary. TypeScript has to be higher than 4.8 (and pre-5.0).

So include in your app shell as preamble:

```js
import 'core-js/proposals/reflect-metadata';
import '@angular/compiler';
```

### Angular 17

In general, Angular 17 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^17",
  "@angular/compiler": "^17",
  "@angular/core": "^17",
  "@angular/router": "^17",
  "@angular/platform-browser": "^17",
  "@angular/platform-browser-dynamic": "^17",
  "core-js": "^3",
  "rxjs": "^7.4",
  "zone.js": "~0.14"
}
```

Besides the usual imports, the explicit import of the `@angular/compiler` package may be necessary. TypeScript has to be higher or equal to 5.2 (and less than 5.3).

So include in your app shell as preamble:

```js
import 'core-js/proposals/reflect-metadata';
import '@angular/compiler';
```

### Angular 18

In general, Angular 18 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^18",
  "@angular/compiler": "^18",
  "@angular/core": "^18",
  "@angular/router": "^18",
  "@angular/platform-browser": "^18",
  "@angular/platform-browser-dynamic": "^18",
  "core-js": "^3",
  "rxjs": "^7.4",
  "zone.js": "~0.14"
}
```

Besides the usual imports, the explicit import of the `@angular/compiler` package may be necessary. TypeScript has to be higher or equal to 5.3 (and less than 5.6).

So include in your app shell as preamble:

```js
import 'core-js/proposals/reflect-metadata';
import '@angular/compiler';
```

### Angular 19

In general, Angular 19 seems to work and is **supported**.

The basic dependencies look as follows:

```json
{
  "@angular/common": "^19",
  "@angular/compiler": "^19",
  "@angular/core": "^19",
  "@angular/router": "^19",
  "@angular/platform-browser": "^19",
  "@angular/platform-browser-dynamic": "^19",
  "core-js": "^3",
  "rxjs": "^7.4",
  "zone.js": "~0.15"
}
```

Besides the usual imports, the explicit import of the `@angular/compiler` package may be necessary. TypeScript has to be higher or equal to 5.5 (and less than 5.9).

So include in your app shell as preamble:

```js
import 'core-js/proposals/reflect-metadata';
import '@angular/compiler';
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
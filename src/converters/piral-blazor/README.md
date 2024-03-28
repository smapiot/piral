[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Blazor](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-blazor.svg?style=flat)](https://www.npmjs.com/package/piral-blazor) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that has a peer dependency to `blazor`. What `piral-blazor` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Blazor (WASM) loader and converter for any component registration, as well as a `fromBlazor` shortcut together with some Blazor component coming in the `Piral.Blazor.Utils` NuGet package.

::: warning: Only for Blazor WASM
The Blazor integration is for the client-side framework Blazor, also known as Blazor WASM.

If you want to use Blazor Server we recommend using one of the ways of including a server-side rendered application as a pilet. More infos can be found at [in our migration tutorial for SSR applications](https://docs.piral.io/guidelines/tutorials/19-migrate-ssr).
:::

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

As Blazor is quite a special technology (since its based on WebAssembly) there are some very special things to follow for integration. The result, however, could be worth it. As Piral gives you here a truly unique and wonderful way of building your application - modular, distributed, and with the fastest possible Blazor startup time!

**Important**: We recommend building pilets for `piral-blazor` exclusively with the official template.

The template can be installed using the `dotnet` CLI:

```sh
dotnet new -i Piral.Blazor.Template
```

Then you can always apply the template in an empty folder:

```sh
dotnet new blazorpilet --piralInstance my-app-shell
```

where `my-app-shell` should refer to the name of the NPM package of your app shell. The `--npmRegistry` option is there, to cover cases where your app shell is not hosted in the standard NPM registry.

Exposing components looks like:

```cs
@attribute [PiralExtension("sample-page")]

<div>
    <p>
        Current count: @counter
    </p>
    <p>
        <button @onclick="Increment">Increment</button>
    </p>
</div>

@code {
    int counter = 0;

    void Increment()
    {
        counter++;
    }
}
```

For more details visit the [Piral.Blazor](https://github.com/smapiot/Piral.Blazor) repository.

## Architecture

Blazor with Piral works from two sides. We have the app shell's side and the side of the micro frontends. This package allows to connect both sides, by placing a set of shared functionality in the app shell.

![Architecture Diagram](https://raw.githubusercontent.com/smapiot/piral/documentation/docs/diagrams/blazor-architecture.png)

The diagram has the following pieces:

1. Your app shell using `piral`, which needs to reference the `piral-blazor` plugin. Effectively, this will use the `blazor` package at build-time to include the Blazor libraries. Additionally, it uses `Piral.Blazor.Core` to be able to reference the defined Blazor components.
2. The TypeScript file in your Blazor pilets. That file will export the `setup` function to define which Blazor components to register/use in your app shell.
3. The Blazor code in your Blazor pilets using the shared library `Piral.Blazor.Utils` for some convenience functions. This code will define all the Blazor components that can be registered/used in the pilet.

Naturally, you can add other dependencies to your Blazor pilet, too. These can be other npm packages for extending the JS part. Usually, however, you will add more NuGet packages to enhance your Blazor code.

This [Munich .NET Meetup video recording](https://www.youtube.com/watch?v=IGVQoCzCtR4) gives you a lot of details on the used architecture.

## API

The following functions are brought to the Pilet API.

### `defineBlazorReferences()`

Adds the URLs to additional DLLs that need to be referenced for obtaining the Blazor components. At best this uses `require.resolve` to get the URL from the bundler.

When you use the `blazorpilet` template you don't need to fill/use this. It is automatically used and filled with generated code. Only touch this one if you know what you are doing.

### `fromBlazor()`

Transforms a standard Blazor component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

There is only a single argument, which refers to the name of the exposed Blazor component.

## Usage

::: summary: For pilet authors

**Note**: If you use the .NET template (and specifically the `Piral.Blazor.Tools` package) then the whole JavaScript code will be generated for you. There is nothing you will need to do - even though you can also manually extend the generated JavaScript module.

You can use the `fromBlazor` function from the Pilet API to convert your Blazor components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  piral.defineBlazorReferences([
    require.resolve('./My.Dependency.dll'),
    require.resolve('./My.Components.dll'),
  ])
  piral.registerPage('/sample', piral.fromBlazor('sample-page'));
}
```

Within Blazor components the `Extension` component referenced from `Piral.Blazor.Utils`, e.g.,

```jsx
<Extension name="name-of-extension" />
```

Alternatively, if `piral-blazor` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { defineBlazorReferences, fromBlazor } from 'piral-blazor/convert';

export function setup(piral: PiletApi) {
  defineBlazorReferences([
    require.resolve('./My.Dependency.dll'),
    require.resolve('./My.Components.dll'),
  ])
  piral.registerPage('/sample', fromBlazor('sample-page'));
}
```

In this case, you'll also have to install the `blazor` package. `piral-blazor` will use this under the hood to access the Blazor libraries.

To maximize compatibility, the major and minor version of the `blazor` package should correspond to the major and minor version of .NET Blazor you want to use (e.g., `blazor@3.2.x` will resolve to the outdated .NET Blazor `3.2` release train - more recent ones look like `blazor@7.0.0`). It should be noted that the patch level is not aligned. If a specific patch level is desired, consult the `blazor` package documentation.

:::

::: summary: For Piral instance developers

Using Blazor with Piral is as simple as installing the `piral-blazor` and `blazor` packages.

```ts
import { createBlazorApi } from 'piral-blazor';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createBlazorApi()],
  // ...
});
```
`piral-blazor` will use `blazor` under the hood to access the Blazor libraries.

To maximize compatibility, the major and minor version of the `blazor` package should correspond to the major and minor version of .NET Blazor you want to use (e.g., `blazor@3.2.x` will resolve to the .NET Blazor `3.2` release train). It should be noted that the patch level is not aligned. If a specific patch level is desired, consult the `blazor` package documentation.

For setting up localization you can supply options such as `initialLanguage` and `onLanguageChange` to the `createBlazorApi` call. While the former is used to set the initial language, the latter can be used to change the language later on. By default, `onLanguageChange` will be configured to listen to the `select-language` event emitted from Piral. This event is emitted (among others) by `piral-translate`, i.e., if you use this plugin it will just work.

Otherwise, you can either emit the event yourself (transporting an object with `currentLanguage` set to the desired language), or use `onLanguageChange` to wire it to whatever event source / emitter you'd like.

Ultimately, you can also call the `SetLanguage` in Piral.Blazor.Core from JavaScript like this:

```js
window.DotNet.invokeMethodAsync('Piral.Blazor.Core', 'SetLanguage', language);
```

Furthermore, it is possible to configure the (initial) log level via the `logLevel` option:

```ts
const instance = createInstance({
  // important part
  plugins: [createBlazorApi({
    logLevel: 1, // everything except trace
  })],
  // ...
});
```

The levels range from 0 (incl. trace) to 6 (nothing will be logged).

:::

## Events

The `piral-blazor` integration emits some events at the global object (`window`):

- `loading-blazor-core` when the loading of (core) Blazor resources starts
- `loaded-blazor-core` when the loading of (core) Blazor resources ends
- `loading-blazor-pilet` when the loading of a Blazor pilet / its resources starts (`detail` contains the pilet's metadata)
- `loaded-blazor-pilet` when the loading of a Blazor pilet / its resources ends (`detail` contains the pilet's metadata)

You can receive these events using, e.g.:

```js
window.addEventListener('loaded-blazor-pilet', (ev) => {
  // your code here - could use:
  // ev.detail.name --> name of the pilet
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

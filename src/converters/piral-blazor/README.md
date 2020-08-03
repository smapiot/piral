[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Blazor](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-blazor.svg?style=flat)](https://www.npmjs.com/package/piral-blazor) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-blazor` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Blazor loader and converter for any component registration, as well as a `fromBlazor` shortcut together with some Blazor component coming in the `Piral.Blazor.Utils` NuGet package.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

As Blazor is quite a special technology (since its based on WebAssembly) there are some very special things to follow for integration. The result, however, could be worth it. As Piral gives you here a truly unique and wonderful way of building your application - modular, distributed, and with the fastest possible Blazor startup time!

**Important**:
We recommend building pilets for `piral-blazor` exclusively with the official template.

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
@attribute [ExposePilet("sample-page")]

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

The following functions are brought to the Pilet API.

### `defineBlazorReferences()`

Adds the URLs to additional DLLs that need to be referenced for obtaining the Blazor components. At best this uses `require.resolve` to get the URL from the bundler.

When you use the `blazorpilet` template you don't need to fill / use this. It is automatically used and filled with generated code. Only touch this one if you know what you are doing.

### `fromBlazor()`

Transforms a standard Blazor component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

There is only a single argument, which refers to the name of the exposed Blazor component.

## Usage

::: summary: For pilet authors

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

:::

::: summary: For Piral instance developers

Using Blazor with Piral is as simple as installing `piral-blazor`.

```ts
import { createBlazorApi } from 'piral-blazor';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createBlazorApi()],
  // ...
});
```

This will automatically download and include the necessary binary files for providing Blazor WASM support. The binary files will be taken from the `Piral.Blazor.Core` NuGet package.

By default, the latest version of the `Piral.Blazor.Core` NuGet package is downloaded. To change this set the `PIRAL_BLAZOR_VERSION` environment variable to the desired version.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

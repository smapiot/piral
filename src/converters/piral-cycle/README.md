[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Cycle](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cycle.svg?style=flat)](https://www.npmjs.com/package/piral-cycle) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `@cycle/dom` and related packages. What `piral-cycle` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes a Cycle.js converter for any component registration, as well as a `fromCycle` shortcut and a `CycleExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromCycle()`

Transforms a standard Cycle.js component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `CycleExtension`

The extension slot component to be used in Cycle.js components.

## Usage

::: summary: Modern Use (recommended)

The recommended way is to use `piral-cycle` from your pilets. In this case, no registration in the Piral instance is required.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromCycle } from 'piral-cycle/convert';
import { CyclePage } from './CyclePage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromCycle(CyclePage));
}
```

Piral provides two drivers to your Cycle.js component. Here, `TProps` are properties provided by Piral, e.g., `TileComponentProps`.

```ts
export interface PiralDomDrivers<TProps> extends Drivers {
  /**
   * A DOM Driver giving access to the DOM where the component is mounted.
   */
  DOM: Driver<Stream<VNode>, MainDOMSource>;
  /**
   * A driver giving access to Piral specific properties passed down to the component.
   */
  props: Driver<void, Stream<TProps>>;
}
```

Within Cycle.js components the Piral Cycle.js extension component can be used by referring to `CycleExtension`, e.g.,

```jsx
CycleExtension({ name: "name-of-extension" })
```
:::

::: summary: Legacy Use

For backwards compatibility, you can also install `piral-cycle` in your Piral instance.

Using Cycle.js with Piral is as simple as installing `piral-cycle` and Cycle.js:

- `@cycle/dom`: 22.x
- `@cycle/run`: 5.x
- `xstream`: 11.x

```ts
import { createCycleApi } from 'piral-cycle';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createCycleApi()],
  // ...
});
```

The `@cycle/run`, `@cycle/dom` and `xstream` packages should be shared with the pilets via the *package.json*:

```json
{
  "importmap": {
    "imports": {
      "@cycle/run": "",
      "@cycle/dom": "",
      "xstream": ""
    }
  }
}
```
:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
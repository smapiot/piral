[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Cycle](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cycle.svg?style=flat)](https://www.npmjs.com/package/piral-cycle) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

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

::: summary: For pilet authors

You can use the `fromCycle` function from the Pilet API to convert your Cycle.js components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { CyclePage } from './CyclePage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromCycle(CyclePage));
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

Alternatively, if `piral-cycle` has not been added to the Piral instance you can install and use the package also from a pilet directly.

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { fromCycle } from 'piral-cycle/convert';
import { CyclePage } from './CyclePage';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', fromCycle(CyclePage));
}
```

:::

::: summary: For Piral instance developers

Using Cycle.js with Piral is as simple as installing `piral-cycle` and Cycle.js.

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
  "pilets": {
    "externals": [
      "@cycle/run",
      "@cycle/dom",
      "xstream"
    ]
  }
}
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Mithril](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-mithril.svg?style=flat)](https://www.npmjs.com/package/piral-mithril) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-mithril` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Mithril.js converter for any component registration, as well as a `fromMithril` shortcut and a `MithrilExtension` component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromMithril()`

Transforms a standard Mithril.js component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

### `MithrilExtension`

The extension slot component to be used in Mithril.js component.

## Setup and Bootstrapping

Using Mithril.js with Piral is as simple as installing `piral-mithril` and `mithril`.

```ts
import 'mithril';
import { createMithrilApi } from 'piral-mithril';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createMithrilApi()],
  // ...
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

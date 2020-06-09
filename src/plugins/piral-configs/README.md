[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Configs](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-configs.svg?style=flat)](https://www.npmjs.com/package/piral-configs) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-configs` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `defineConfigSchema()`

Defines the config schema to be used by the pilet.

### `getCurrentConfig()`

Gets the currently active configuration.

## Usage

> For authors of pilets

```ts
export function setup(app) {
  // define the schema and the default value
  const configSchema = {
    type: 'object',
    properties: {
      increment: {
        type: "number",
        description: "Defines the value to add when the counter is clicked.",
      },
    },
  };
  const defaultConfig = {
    increment: 1,
  };
  app.defineConfigSchema(configSchema, defaultConfig);

  const { increment } = app.getCurrentConfig();
}
```

## Setup and Bootstrapping

> For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createConfigsApi` from the `piral-configs` package.

```ts
import { createConfigsApi } from 'piral-feeds';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  extendApi: [createConfigsApi()],
  // ...
});
```

There are no options available.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

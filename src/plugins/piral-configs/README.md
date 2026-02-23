[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Configs](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-configs.svg?style=flat)](https://www.npmjs.com/package/piral-configs) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-configs` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Why and When

For whitelabel products and generic applications configuration may be applied to the frontend. This could also be used as further personalization on a user-defined basis. In any case the `piral-configs` plugin provides two ways to fully leverage frontend configuration:

1. Each pilet can define how it can be configured and what default values to apply.
2. Injected configuration is validated against the configuration schema. Different values are only applied if they fit into the schema.

This plugin does not make any statement how the configuration is retrieved. Usually, it will be loaded from the backend when the application starts, but you could also go for something like storing the information in `localStorage` or having a pre-determined configuration embedded in your application. The door is open.

Alternatives: Pilets can ready configuration values from the global data store or state container. They are responsible for evaluating these values and falling back to another value.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/mrf886cnBRk)

## Documentation

The following functions are brought to the Pilet API.

### `defineConfigSchema()`

Defines the config schema to be used by the pilet.

### `getCurrentConfig()`

Gets the currently active configuration.

## Usage

::: summary: For pilet authors

Just use `defineConfigSchema` in your `setup` to define your configuration checker and the default values. Later you can access the retrieved configuration via `getCurrentConfig`.

A quick example:

```ts
export function setup(app: PiletApi) {
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

  app.registerExtension('home-dashboard', () => {
    const [count, setCount] = React.useState(0);
    return (
      <a
        href="#"
        onClick={ev => {
          setCount(count => count + increment);
          ev.preventDefault();
        }}>
        {count}
      </a>
    );
  });
}
```

Make sure you use `getCurrentConfig` *after* the configuration schema has been defined.

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createConfigsApi` from the `piral-configs` package.

```ts
import { createConfigsApi } from 'piral-configs';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createConfigsApi()],
  // ...
});
```

There are no options available.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

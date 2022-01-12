[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral CLI](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cli.svg?style=flat)](https://www.npmjs.com/package/piral-cli) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

Piral CLI is a command-line tool that can also be used as a library. It should make common tasks such as building a pilet, scaffolding a pilet, or debugging a piral instance simple.

Internally, Piral CLI is build upon existing tools with connection points to their respective eco-systems.

## Documentation

For details on the available commands check out the [documentation at Piral](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/main/docs/commands).

## Plugins

The Piral CLI can be extended with plugins.

### Available Plugins

Right now the following generic plugins exist:

- [**piral-cli-local-feed**](https://github.com/FlorianRappl/piral-cli-local-feed), provides the ability to start a local feed service
- [**piral-cli-dotenv**](https://github.com/FlorianRappl/piral-cli-dotenv), provides the ability to easily integrate environment variables

Also the following bundler plugin exists (bringing build / debug capabilities):

- [**piral-cli-parcel**](https://github.com/smapiot/piral), provides an integration for Parcel (v1) as a bundler
- [**piral-cli-parcel2**](https://github.com/smapiot/piral), provides an integration for Parcel (v2) as a bundler
- [**piral-cli-webpack**](https://github.com/smapiot/piral), provides an integration for Webpack (v4) as a bundler
- [**piral-cli-webpack5**](https://github.com/smapiot/piral), provides an integration for Webpack (v5) as a bundler
- [**piral-cli-esbuild**](https://github.com/smapiot/piral), provides an integration for ES Build as a bundler

You'll find an updated list [on NPM](https://www.npmjs.com/search?q=keywords%3Apiral-cli) using the keyword **piral-cli**.

### Building a Plugin

A plugin has to be an NPM module with a name that starts with `piral-cli-`, e.g., `piral-cli-local-feed`.

**Recommendation:** If your CLI plugin adds a new command, name your plugin accordingly, e.g., for a new command named `foo-piral` create an NPM package called `piral-cli-foo-piral`. The `foo-piral` command can be invoked by the user in the command line via `piral foo` or `pb foo-piral`.

The NPM module needs to look as follows:

```js
module.exports = function (cliApi) {
  // your code
};
```

With the CLI API you can do things such as wrapping commands or adding new commands. For commands the yargs command definition is followed.

An example command for a pilet:

```js
module.exports = function (cliApi) {
  cliApi.withCommand({
    name: 'dependencies-pilet',
    alias: ['deps-pilet'],
    description: 'Lists the dependencies of the current pilet.',
    arguments: [],
    flags(argv) {
      return argv
        .boolean('only-shared')
        .describe('only-shared', 'Only outputs the declared shared dependencies.')
        .default('only-shared', false)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      // your code here, where args.onlyShared refers to our custom argument
    },
  });
};
```

The resolution for plugins is as follows:

1. Take the plugins from the local project (`piral-cli` must be installed / run locally)
2. Take the plugins from the global modules

Plugins are never loaded twice. Local versions have precedence.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

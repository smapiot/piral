[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral CLI esbuild](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cli-esbuild.svg?style=flat)](https://www.npmjs.com/package/piral-cli-esbuild) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This plugin enables using [esbuild](https://esbuild.github.io) as the bundler for Piral instances and pilets.

## Installation

Use your favorite NPM client for the installation:

```sh
npm i piral-cli-esbuild --save-dev
```

**Note**: The plugin has to be installed to tell the `piral-cli` to use esbuild as the default bundler.

## Using

There is nothing to do. Standard commands such as `piral build` or `pilet debug` will now work with esbuild as the bundler.

This plugin comes with batteries included. You don't need to install or specify your esbuild version.

### What's Inside

Right now it includes:

- `esbuild-sass-plugin`

### Customizing

If you want to customize the given config (e.g., to add more plugins) then create a file *esbuild.config.js* in your root directory.

In the most trivial version the file looks as follows:

```js
module.exports = function(options) {
  return options;
};
```

This would just receive the original build options and return them, i.e., essentially not doing anything. If you want to add some plugin you could do:

```js
const { somePlugin } = require('esbuild-some-plugin');

module.exports = function(options) {
  options.plugins.push(somePlugin());
  return options;
};
```

There are no overrides applied afterwards. Therefore, what you modify will remain in the options.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

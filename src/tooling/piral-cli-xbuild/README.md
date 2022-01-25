[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral CLI xBuild](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cli-xbuild.svg?style=flat)](https://www.npmjs.com/package/piral-cli-xbuild) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This plugin enables using npm scripts for building and debugging Piral instances & pilets.

## Installation

Use your favorite NPM client for the installation:

```sh
npm i piral-cli-xbuild --save-dev
```

**Note**: The plugin has to be installed to tell the `piral-cli` to use `xbuild` as the default bundler.

## Using

Standard commands such as `piral build` or `pilet debug` will now work against shell scripts defined via special sections in the *package.json*.

(tbd)

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral CLI Parcel](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cli-parcel.svg?style=flat)](https://www.npmjs.com/package/piral-cli-parcel) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This plugin enables using [Parcel](https://parceljs.org) as the bundler for Piral instances and pilets.

## Installation

Use your favorite NPM client for the installation:

```sh
npm i piral-cli-parcel --save-dev
```

**Note**: The plugin has to be installed to tell the `piral-cli` to use Parcel v1 as the default bundler.

## Using

There is nothing to do. Standard commands such as `piral build` or `pilet debug` will now work with Parcel as the bundler.

This plugin comes with batteries included. You don't need to install or specify your Parcel version.

### What's Inside

Right now it includes:

- `parcel-plugin-at-alias`
- `parcel-plugin-codegen`
- `parcel-plugin-externals`
- `parcel-plugin-import-maps`

### Customizing

As with standard Parcel customizations are either done by using the *package.json* or special config files (e.g., *.babelrc*).

Installed Parcel plugins are detected via the *package.json*.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

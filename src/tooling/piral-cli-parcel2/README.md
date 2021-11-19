[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral CLI Parcel2](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cli-parcel2.svg?style=flat)](https://www.npmjs.com/package/piral-cli-parcel2) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This plugin enables using [Parcel v2](https://v2.parceljs.org) as the bundler for Piral instances and pilets.

## Installation

Use your favorite NPM client for the installation:

```sh
npm i piral-cli-parcel2 --save-dev
```

**Note**: If you don't install any bundler for use in `piral-cli` then `piral-cli-parcel2` won't be automatically installed for you.

::: failure: Still work in progress
This `piral-cli` bundler plugin is still work in progress and should not be used, unless you know what you are doing.

There are some things that need to be prepared for Parcel v2 to behave as it should.
:::

## Using

There is nothing to do. Standard commands such as `piral build` or `pilet debug` will now work with Parcel as the bundler.

This plugin comes with batteries included. You don't need to install or specify your Parcel (v2) version.

### Customizing

As with standard Parcel v2 customizations are either done by using the *package.json* or special config files (e.g., *.parcelrc*).

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

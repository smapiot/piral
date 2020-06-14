[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Base](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-base.svg?style=flat)](https://www.npmjs.com/package/piral-base) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is the base library that is required for any Piral instance. It is independent of React, a state container, or anything else. It only brings functionality for loading and evaluating pilets.

## Documentation

For details on the provided API check out the [documentation at the Piral website](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/master/docs).

## Getting Started

Creating your own Piral app based on `piral-base` is in general **not recommended**.

The only exception is when a Piral-fork that is based on another technology than React should be created. In any other case please look at `piral-core` library or the full `piral` framework.

More information can be found in our [documentation at the Piral website](https://docs.piral.io).

## Available Options

By default, the loading of pilets assumes standard metadata. In general, however, the `loadPilet` option allows to bring in other ways.

One example of using `loadPilet` to extend Piral beyond its initial capabilities is to use SystemJS for loading the pilets.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

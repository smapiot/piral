[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Jest Utils](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-jest-utils.svg?style=flat)](https://www.npmjs.com/package/piral-search) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a utility library that can be used for testing pilets.

What `piral-jest-utils` offers are utilities and mocks that make testing of pilets very easy. From simple unit tests to complete functional tests.

## Installation

This should only be installed as a development dependency (`devDependencies`) as it is only designed for testing.

If you'd love touse yarn:

```sh
yarn add --dev piral-jest-utils
```

Alternatively, npm works reliably, too:

```sh
npm i --save-dev piral-jest-utils
```

## Setup

The simplest setup is to use the module system, you may also choose to create a setup file if needed.

### Module System

In your *package.json* under the jest configuration section create a `setupFiles` array and add `piral-jest-utils` to the array.

```json
{
  "jest": {
    "setupFiles": ["piral-jest-utils"]
  }
}
```

If you already have a `setupFiles` attribute you can also append `piral-jest-utils` to the array.

```json
{
  "jest": {
    "setupFiles": ["./test/setup.js", "piral-jest-utils"]
  }
}
```

### Setup File

Alternatively, you can create a new setup file which then requires this module or add the `require` statement to an existing setup file.

```js
import 'piral-jest-utils';
// or
require('piral-jest-utils');
```

Add that file to your `setupFiles` array:

```json
"jest": {
  "setupFiles": [
    "./test/setup.js"
  ]
}
```

## Usage

The utilities should be used as follows.

(tbd)

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

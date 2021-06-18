[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Jest Utils](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-jest-utils.svg?style=flat)](https://www.npmjs.com/package/piral-jest-utils) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an opinionated utility library that can be used for testing Piral instances and pilets.

What `piral-jest-utils` offers are utilities and mocks that make testing Piral instances and pilets with Jest very easy. From simple unit tests to complete functional tests.

## Installation

This should only be installed as a development dependency (`devDependencies`) as it is only designed for testing.

If you'd love to use yarn:

```sh
yarn add --dev piral-jest-utils
```

Alternatively, npm works reliably, too:

```sh
npm i --save-dev piral-jest-utils
```

## Setup

The simplest setup is to use the module system, you may also choose to create a setup file if needed.

Add the following script to your *package.json*:

```json
{
  "scripts": {
    "test": "jest --passWithNoTests"
  },
}
```

Add a new file *jest.config.js* next to the *package.json*:

```js
module.exports = require('piral-jest-utils').default;
```

You can now add tests in your `src` folder. Every file sufficed with `.test.js` or `.test.ts` will be considered.

## Example

Have a look [here](https://github.com/piral-samples/piral-microfrontend-demo/tree/main/team-red) for an example on how `piral-jest-utils` can be used for testing pilets.

## Usage

If you want to add more directories (other than `src`) then you'll need to extend the configuration.

The easiest way is to use the `extendConfig` function. Change the *jest.config.js* to look as follows:

```js
const { extendConfig } = require('piral-jest-utils');
module.exports = extendConfig({
  roots: ['foo/', 'bar/'],
});
```

This would add the `foo/` and `bar/` directories, too.

By default, `*.css` and `*.scss` files will be handled via an identity mapper mock. Likewise, most asset files are handled via a mock. If you want to provide new mocks or change mocks use the `moduleNameMapper` property:

```js
const { extendConfig } = require('piral-jest-utils');
module.exports = extendConfig({
  moduleNameMapper: {
    '\\.(ico|mp3|mp4)$': require.resolve('piral-jest-utils/lib/file.mock.js'),
  },
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

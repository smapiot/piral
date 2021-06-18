[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral SystemJS Utils](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-systemjs-utils.svg?style=flat)](https://www.npmjs.com/package/piral-systemjs-utils) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a utility library that can be used for providing support to SystemJS modules.

What `piral-systemjs-utils` offers are helper functions to actually support SystemJS modules for pilets incl. SystemJS compatible import maps as feed source.

## Installation

This should only be installed as a dependency (`dependencies`) as it is only designed mostly for runtime / consumption by Piral together with `piral-cli-webpack` or another bundler that is SystemJS compatible.

If you'd love to use yarn:

```sh
yarn add piral-systemjs-utils
```

Alternatively, npm works reliably, too:

```sh
npm i --save piral-systemjs-utils
```

## Setup

The lib already comes with SystemJS as a dependency. There is nothing else required. Usually, you just want to include the (SystemJS) vendor bundle first:

```ts
import 'piral-systemjs-utils/vendor';
```

The contents of the vendor bundle are listed below.

Now you should actually register the shared components. This will add all the Piral-shared dependencies to SystemJS, which allows sharing across boundaries.

```ts
import { extendSharedDependencies } from 'piral';
import { registerSharedDependencies } from 'piral-systemjs-utils';

registerSharedDependencies();
```

Finally, provide your pilets via import maps in the *index.html*:

```html
<script type='systemjs-importmap' src="https://feed.piral.cloud/api/v1/pilet/my-import-maps"></script>
```

Make sure that the Webpack configuration is actually extended using the `System` calls.

A simple way for achieving this is to create a file called *webpack.config.js* in the Piral instance's root folder. It may look as follows:

```js
module.exports = function (config) {
  config.module.rules.push({
    parser: {
      system: false,
    },
  });
  return config;
};
```

This is everything for setting up SystemJS in Piral.

## Usage

### App Shell Authors

Using the configured SystemJS import maps is simple. When your Piral instance is created supply the `loadPilet` and `requestPilets` functions from the helper library.

An example:

```ts
import { renderInstance } from 'piral';
import { loadPilet, requestPilets } from 'piral-systemjs-utils';
import { layout, errors } from './layout';

renderInstance({
  layout,
  errors,
  loadPilet,
  requestPilets,
});
```

By default, this will assume that all entries of the previously supplied import maps are pilets. Everything will be loaded and resolved via SystemJS.

### Pilet Authors

Pilet authors don't need to know anything besides that the build system has support SystemJS. Therefore, like with the Piral instance, pilets need to be created via `piral-cli-webpack` or another bundler supporting SystemJS.

(tbd)

## Vendor Bundle

The vendor bundle comes with the following SystemJS scripts:

- The core library
- AMD support
- Support for named exports
- Support for named registrations
- Support for default exports / imports

If you'd like to customize this list then we recommend to avoid importing `piral-systemjs-utils/vendor` and instead declaring your own imports.

In most cases you should be fine with importing `piral-systemjs-utils/vendor`.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral IE11 Polyfills Utils](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ie11polyfills-utils.svg?style=flat)](https://www.npmjs.com/package/piral-ie11polyfills-utils) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a utility library that can be used to make a Piral instance IE11 compatible.

What `piral-ie11polyfills-utils` offers is a set of polyfills making all JS calls work even in older browser such as IE11.

## Installation

This should only be installed as a dependency (`dependencies`).

If you'd love to use yarn:

```sh
yarn add piral-ie11polyfills-utils
```

Alternatively, npm works reliably, too:

```sh
npm i --save piral-ie11polyfills-utils
```

## Usage

The polyfills are just imported as first statement in your `index.tsx` (or root module) of your Piral instance.

```js
import 'piral-ie11polyfills-utils';
```

## Polyfills

The package comes with the following polyfills:

- standard JS API polyfills (`core-js/stable`)
- Promise API (`promise-polyfill/lib/polyfill`)
- URL API (`url-polyfill`)
- fetch API (`whatwg-fetch`)
- `document.currentScript` support (`current-script-polyfill`)

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

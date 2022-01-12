[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral CLI Webpack](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cli-webpack.svg?style=flat)](https://www.npmjs.com/package/piral-cli-webpack) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This plugin enables using [Webpack v4](https://webpack.js.org) as the bundler for Piral instances and pilets.

## Installation

Use your favorite NPM client for the installation:

```sh
npm i piral-cli-webpack --save-dev
```

**Note**: If you don't install any bundler for use in `piral-cli` then `piral-cli-webpack` will be automatically installed for you.

## Using

There is nothing to do. Standard commands such as `piral build` or `pilet debug` will now work with Webpack as the bundler.

This plugin comes with batteries included. You don't need to install or specify your Webpack version.

### What's Inside

Right now it includes:

- `babel-loader`,
- `css-loader`,
- `file-loader`,
- `source-map-loader`,
- `sass-loader`,
- `style-loader`,
- `ts-loader`,
- `parcel-codegen-loader`,
- `piral-instance-webpack-plugin`,
- `pilet-webpack-plugin`,
- `html5-entry-webpack-plugin`,
- `import-maps-webpack-plugin`,
- `html-webpack-plugin`,
- `mini-css-extract-plugin`,
- `optimize-css-assets-webpack-plugin`,
- `terser-webpack-plugin`,
- `webpack`, and
- `webpack-dev-server`.

As such it should be prepared to include assets (images, videos, ...), stylesheets (CSS and SASS), and work with TypeScript.

### Customizing

You can still leverage your own `webpack.config.js`. Either just export *what you want to have overwritten*, e.g.,

```js
module.exports = {
  devtool: 'inline-source-map',
};
```

or specify a function that is called with the already created configuration.

An example would be:

```js
module.exports = function(config) {
  config.plugins.push(myAwesomePlugin);
  config.entry.side = ['@babel/polyfill'];
  return config;
};
```

Otherwise, you can also use the `extend-config` helper module to get the job done without having to know the internals:

```js
const extendConfig = require('piral-cli-webpack/extend-config');

module.exports = extendConfig({
  checkTypes: true, // not only transpiles TS, but also checks the types
  noPresets: true, // removes existing presets from Babel
  rules: [], // adds additional rules
  removeRules: [], // removes the rules mentioned by their loader name
  plugins: [], // adds additional plugins
  removePlugins: [], // removes the plugins mentioned by their class reference
  fileLoaderOptions: {}, // sets the options for the file loader
  tsLoaderOptions: {}, // sets the options for the TS loader
  babelLoaderOptions: {}, // sets the options for the Babel loader
  cssLoaderOptions: {}, // sets the options for the CSS loader
  sassLoaderOptions: {}, // sets the options for the SASS loader
});
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

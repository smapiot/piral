<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# piral-instance-webpack-config-enhancer

The `piral-instance-webpack-config-enhancer` helps you to build Piral instances using Webpack.

## Getting Started

To begin, you'll need to install `piral-instance-webpack-config-enhancer`:

```sh
npm install piral-instance-webpack-config-enhancer --save-dev
```

Then enchance your `webpack` config. For example:

**webpack.config.js**

```js
const { piralInstanceWebpackConfigEnhancer } = require("piral-instance-webpack-config-enhancer");
const piralPkg = require("./package.json");

const excludedDependencies = ["piral", "piral-core", "piral-base", piralPkg.name];
const dependencies = piralPkg.pilets?.externals ?? [];
const externals = dependencies.filter((m) => !excludedDependencies.includes(m));

const enchance = piralInstanceWebpackConfigEnhancer({
    name: piralPkg.name,
    version: piralPkg.version,
    externals,
});

module.exports = enchance({
    /* your webpack config here*/
});
```

And run `webpack` via your preferred method.

## Options

### `variables`

Allows supplying additional variables to be used as definitions. Similar to the `definePlugin`.

Example:

```js
const { piralInstanceWebpackConfigEnhancer } = require("piral-instance-webpack-config-enhancer");
const piralPkg = require("./package.json");

const excludedDependencies = ["piral", "piral-core", "piral-base", piralPkg.name];
const dependencies = piralPkg.pilets?.externals ?? [];
const externals = dependencies.filter((m) => !excludedDependencies.includes(m));

const enchance = piralInstanceWebpackConfigEnhancer({
    name: piralPkg.name,
    version: piralPkg.version,
    externals,
    variables: {
        PIRAL_CLI_VERSION: require("piral-cli/package.json").version,
    },
});

module.exports = enchance({
    /* your webpack config here*/
});
```

### `debug`

Defines the version of the general debugging tools, if any. Setting `true` will auto-determine the version. Setting `false` or omitting will not include general debugging tools.

Example:

```js
const { piralInstanceWebpackConfigEnhancer } = require("piral-instance-webpack-config-enhancer");
const piralPkg = require("./package.json");

const excludedDependencies = ["piral", "piral-core", "piral-base", piralPkg.name];
const dependencies = piralPkg.pilets?.externals ?? [];
const externals = dependencies.filter((m) => !excludedDependencies.includes(m));

const enchance = piralInstanceWebpackConfigEnhancer({
    name: piralPkg.name,
    version: piralPkg.version,
    externals,
    debug: true,
});

module.exports = enchance({
    /* your webpack config here*/
});
```

### `emulator`

Defines the path of the emulator pilet API, if any. Setting `true` will take the default path. Setting `false` or omitting will not include the emulator pilet API call.

Example:

```js
const { piralInstanceWebpackConfigEnhancer } = require("piral-instance-webpack-config-enhancer");
const piralPkg = require("./package.json");

const excludedDependencies = ["piral", "piral-core", "piral-base", piralPkg.name];
const dependencies = piralPkg.pilets?.externals ?? [];
const externals = dependencies.filter((m) => !excludedDependencies.includes(m));

const enchance = piralInstanceWebpackConfigEnhancer({
    name: piralPkg.name,
    version: piralPkg.version,
    externals,
    emulator: "/$pilet-api",
});

module.exports = enchance({
    /* your webpack config here*/
});
```

## Contributing

Contributions in any form are appreciated and much welcome!

Just make sure to post an issue or reach out to me on [Gitter](https://gitter.im/piral-io/community) before starting actual work on anything. It really helps to avoid problems.

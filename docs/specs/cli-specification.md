---
title: Piral CLI Specification
---

# Piral CLI Specification

## Abstract

The Piral CLI is a command-line tool, which offers a rich feature set to allow building application shells for Microfrontend solutions. The application shell can be used as a host and an emulator for smaller applications (known as Microfrontends). As part of the Piral framework, we call those small applications *pilets*. In addition, the Piral CLI is capable of generating valid npm packages, which can be published to the Piral Feed Service.

## Introduction

For building client-side micro frontends, a combination of tools is required. The Piral framework tries to simplify this process by offering a tool (`piral-cli`) to help with the most common processes. While this tool may be handy for most developers, it may be too restrictive for others. Therefore, we wanted to provide with this specification the description for all necessary processes to support custom implementations, too.

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The keywords *MAY*, *MUST*, *MUST NOT*, *OPTIONAL*, *SHOULD*, and *SHOULD NOT* are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119).

## Glossary

**IIFE**: Immediately Invoked Function Expression

**JS**: JavaScript

**JSON**: JavaScript Object Notation

**MIT**: Massachusetts Institute of Technology

**UMD**: Universal Module Definition

**URL**: Uniform Resource Locator

**SPA**: Single Page Application

## Building a Piral Instance

A Piral instance represents an app shell for hosting pilets. It will be either based on `piral`, `piral-core`, or `piral-base`.

### Building for Production Purposes

When building the Piral instance for production, the following environment variables should be provided:

| Environment Variable  | Purpose                             | Example            |
|:----------------------|:------------------------------------|:-------------------|
| `NODE_ENV`            | Indicate the target environment.    | `production`       |
| `SHARED_DEPENDENCIES` | Allow exposing shared dependencies. | `react,react-dom`  |
| `PIRAL_PUBLIC_PATH`   | The chosen public path of the app.  | `/app`             |

In addition, some special keys of the `package.json` are relevant for a production build:

| Key                   | Purpose                                 | Example                            |
|:----------------------|:----------------------------------------|:-----------------------------------|
| `app`                 | Path to the root page to use.           | `"src/index.html"`                 |
| `importmap`           | Indicates shared dependencies (new).    | `{ "imports": {}, "inherit": [] }` |
| `pilets`.`externals`  | Names of the shared dependencies (old). | `["reactstrap"]`                   |

The bundler application also needs to understand that a file ending with `.codegen` should be pre-evaluated before being included as a module. In the case of a Piral instance, we will need to evaluate the `dependencies.codegen` file, if the environment variable `SHARED_DEPENDENCIES` is set.

### Building for Emulation Purposes

When executing the Piral instance for emulation purposes, some additional capabilities have to be integrated. One example of such a capability is the debug API. This API is inserted into `window` at runtime for inspection purposes. The browser extension *Piral Inspector* may be used for debugging the API conveniently.

For running the Piral instance in emulation mode, the set of relevant environment variables is slightly different:

| Environment Variable  | Purpose                             | Example            |
|:----------------------|:------------------------------------|:-------------------|
| `NODE_ENV`            | Indicate the target environment.    | `development`      |
| `DEBUG_PILET`         | Indicate emulator environment.      | `on`               |
| `DEBUG_PIRAL`         | Provides debug API for inspection.  | `1.0`              |
| `SHARED_DEPENDENCIES` | Allow exposing shared dependencies. | `react,react-dom`  |
| `BUILD_PCKG_NAME`     | The name of the Piral instance.     | `my-app`           |
| `BUILD_PCKG_VERSION`  | The version of the Piral instance.  | `1.2.3`            |
| `BUILD_TIME_FULL`     | The date time of the build.         | `2021-01-01T10:23` |
| `PIRAL_CLI_VERSION`   | The version the used Piral CLI.     | `0.14.0`           |
| `PIRAL_PUBLIC_PATH`   | The chosen public path of the app.  | `/`                |

As in the case of generating a production instance, some special keys of the `package.json` are also considered for the emulation mode:

| Key                   | Purpose                                 | Example                            |
|:----------------------|:----------------------------------------|:-----------------------------------|
| `app`                 | Path to the root page to use.           | `"src/index.html"`                 |
| `importmap`           | Indicates shared dependencies (new).    | `{ "imports": {}, "inherit": [] }` |
| `pilets`.`externals`  | Names of the shared dependencies (old). | `["reactstrap"]`                   |

The bundler application also needs to understand that a file ending with `.codegen` should be pre-evaluated before being included as a module. In the case of a Piral instance, we will need to evaluate the `dependencies.codegen` file, if the environment variable `SHARED_DEPENDENCIES` is set.

## Building a Pilet

A pilet is a module, which can be hosted in a Piral instance. It can be published to a feed service. The feed service then serves the modules for execution in the Piral instance. When building a pilet, the following environment variables are evaluated:

Used environment variables:

| Environment Variable  | Purpose                             | Example            |
|:----------------------|:------------------------------------|:-------------------|
| `NODE_ENV`            | Indicate the target environment.    | `production`       |
| `PIRAL_INSTANCE`      | Name of the app shell to build for. | `my-app-shell`     |

Some special fields of the `package.json` are used to switch on some building features.

| Key                   | Purpose                                   | Example                            |
|:----------------------|:------------------------------------------|:-----------------------------------|
| `app`                 | Path to the root page to use.             | `"src/index.html"`                 |
| `importmap`           | Indicates shared dependencies.            | `{ "imports": {}, "inherit": [] }` |
| `peerDependencies`    | Indicates skipped dependencies (old).     | `{ "react": "*" }`                 |
| `peerModules`         | Names of additional shared modules (old). | `[ "react-dom/server" ]`           |
| `piral`.`name`        | Name of the Piral instance.               | `"sample-piral"`                   |

Additionally, some feed servers may implement a bit more here. For instance, the official Piral Cloud Feed Service supports the following keys in the `package.json`:

| Key                   | Purpose                             | Example                              |
|:----------------------|:------------------------------------|:-------------------------------------|
| `piletRules`          | Feature flag rules to follow.       | `{ ... }`                            |
| `piletDependencies`   | The shared dependencies to load.    | `{ "r": "http://example.com/r.js" }` |

### Schema Versions

The Piral supports specifying different mechanisms for loading pilets. To allow versioning of a pilet's loading mechanism, we use a special header line in the output bundle. If the first line starts with a comment such as `//@pilet`, it will be treated as the pilet schema version indicator.

Right now, there are three available schema versions: the legacy version is indicated by `v0` (UMD), the improved version has `v1` (plain UMD using `currentScript`), and the current standard version is `v2` (using SystemJS). Backward compatibility should always be given when introducing a new schema version. There is also an upgrade to `v2` in form of `v3` available.

Most notably the following components should all be able to gracefully fall back:

- The Piral instance (consumer)
- The Pilet Feed service (provider)
- The Pilet script itself (module)

**`v:0`**

The bundled code should be wrapped in an IIFE, which looks similar to:

```js
//@pilet v:0
!(function(global, require) {
  const __bundleUrl__ = /* determine bundle URL */;

  /* insert bundled code */

  global.$pr_name = require;
}(window, window.$pr_name));
```

The `$pr_name` has to be replaced with the globally used name for `require` of the pilet.

**`v:1`**

The bundled code should be wrapped in an IIFE to look similar to:

```js
//@pilet v:1($pr_name)
!(function(global, require) {
  const __bundleUrl__ = /* determine bundle URL */;
  function define(getExports) {
    if (typeof document !== 'undefined') {
      document.currentScript.app = getExports();
    }
  }
  define.amd = true;

  /* insert bundled code */

  global.$pr_name = require;
}(window, window.$pr_name));
```

The `$pr_name` has to be replaced with the globally used name for `require` of the pilet.

**`v:2`**

The bundled code should form a valid SystemJS module:

```js
//@pilet v:2($pr_name, $shared_dependencies)
System.register([],function(e,c){var dep;return{setters:[function(_dep){dep = _dep;}],execute:function(){_export((function(){
  // ...
})())}};});
```

The `$pr_name` has to be replaced with the globally used name for other (lazy loaded) chunks of the pilet. The `$shared_dependencies` represent the used shared dependencies. This is a JSON object mapping the identifiers used for the shared dependencies to their bundles.

**`v:3`**

The bundled code should form a valid SystemJS module:

```js
//@pilet v:3($pr_name, $shared_dependencies)
System.register([],function(e,c){var dep;return{setters:[function(_dep){dep = _dep;}],execute:function(){_export((function(){
  // ...
})())}};});
```

The `$pr_name` has to be replaced with the globally used name for other (lazy loaded) chunks of the pilet. The `$shared_dependencies` represent the used shared dependencies. This is a JSON object mapping the identifiers used for the shared dependencies to their bundles.

**`mf`**

The bundled code follows the specification and implementation of Module Federation. While originated at Webpack ("Webpack Module Federation") it is now also ported over to other bundlers. In supported bundlers the `mf` format can be used to produce compatible pilets.

Pilets that are compatible must have:

- Exposed entry point `./pilet` leading to the module with a `setup` function
- Accepting a share scope with name `default` (this is also the default, so no changes required here)

## Limitations

The specification does not cover things like validation, declaration generation, scaffolding, or upgrading.

## Examples

The best example for following this specification is the `piral-cli` package itself.

Using Webpack for building a pilet could be done via the following configuration.

```js
import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';

const jsonpFunction = `pr_my_pilet_prefixed`;
const piralExternals = shellPkg.pilets?.externals ?? [];
const piletExternals = piletPkg.externals ?? [];
const peerDependencies = Object.keys(piletPkg.peerDependencies ?? {});
const externals = [...piralExternals, ...piletExternals, ...peerDependencies];

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  entry: {
    main: ['./src/index.tsx'],
  },
  externals,
  output: {
    path: './dist',
    filename: 'index.js',
    library: 'my-pilet',
    libraryTarget: 'umd',
    jsonpFunction,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|mp4|mp3|svg|ogg|webp|wav)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              tsconfig: './tsconfig.json',
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: './node_modules',
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          ie8: true,
          output: {
            comments: /^@pilet/,
          },
        },
      }),
    ],
  },
  plugins: getPlugins([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.BannerPlugin({
      banner: `//@pilet v:1(${jsonpFunction})`,
      entryOnly: true,
      raw: true,
    }),
    new ReplaceInFileWebpackPlugin([
      {
        dir: './dist',
        files: ['index.js'],
        rules: [
          {
            search: /^\!function\s?\(e,\s?t\)\s?\{/m,
            replace: `!function(e,t){function define(d,k){(typeof document!=='undefined')&&(document.currentScript.app=k.apply(d.map(window.${jsonpFunction})));}define.amd=!0;`,
          },
        ],
      },
    ]),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ]),
};
```

This assumes that the source of the pilet is stored in `src` and the bundled files should be written to `dist`. The configuration supports TypeScript, CSS, and most media files.

Critical is the correct definition of the `externals` and the output formatting. In the previous example, we use the `v1` schema.

## Acknowledgements

This specification was created by [smapiot](https://smapiot.com).

The initial author was [Florian Rappl](https://twitter.com/FlorianRappl). The review was done by [Lothar Schöttner](https://smapiot.com). Suggestions from [Jens Thirmeyer](https://linkedin.com/in/jens-thirmeyer) have been taken into consideration.

## References

- [RFC2119](https://tools.ietf.org/html/rfc2119)
- [Parcel Bundler](https://parceljs.org)
- [Webpack](https://webpack.js.org)

# Piral CLI Specification

## Abstract

The Piral CLI is an application that is capable of building app shells that can be used as hosts and emulators for smaller applications (known as microfrontends) called *pilets*. The application is also capable of building pilets producing valid NPM packages that can be used by the Piral Feed Service.

## Introduction

For building client-side microfrontends a combination of tools needs to be used. Piral tries to simplify this process by coming with a tool (`piral-cli`) to help with the most common processes. While this tool may be handy for most people, it may be too restrictive for others. As a result we wanted to specify all necessary processes to allow custom implementations, too.

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words *MAY*, *MUST*, *MUST NOT*, *OPTIONAL*, *SHOULD*, and *SHOULD NOT* are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119).

## Glossary

**IIFE**: Immediately Invoked Function Expression

**JS**: JavaScript

**JSON**: JavaScript Object Notation

**MIT**: Massachusetts Institute of Technology

**NPM**: Node Package Manager

**UMD**: Universal Module Definition

**URL**: Uniform Resource Locator

**SPA**: Single Page Application

## Building a Piral Instance

A Piral instance represents an app shell using either `piral`, `piral-core`, or `piral-base`.

### Building for Production Purposes

For producing files suitable for production purposes the following conditions should be respected.

Used environment variables:

| Name                  | Purpose                             | Example            |
|-----------------------|-------------------------------------|--------------------|
| `NODE_ENV`            | Indicate the target environment.    | `production`       |
| `SHARED_DEPENDENCIES` | Allow exposing shared dependencies. | `react,react-dom`  |

To derive some of these properties some special fields of the `package.json` are used.

Special package keys:

| Name                  | Purpose                             | Example            |
|-----------------------|-------------------------------------|--------------------|
| `app`                 | Path to the root page to use.       | `"src/index.html"` |
| `pilets`.`externals`  | Names of the shared dependencies.   | `["reactstrap"]`   |

The bundler application also needs to understand that a file ending with `.codegen` should be pre-evaluated before included as a module. In case of a Piral instance we will need to evaluate the `dependencies.codegen` file in case the environment variable `SHARED_DEPENDENCIES` is set.

### Building for Emulation Purposes

For emulation purposes the set of environment variables is used slightly different. Consequently, some new capabilities have to be integrated. One example of such a capability is the debug API. This API is inserted into `window` at runtime for inspection purposes.

The browser extension Piral Inspector may be used to use the debug API conveniently.

Used environment variables:

| Name                  | Purpose                             | Example            |
|-----------------------|-------------------------------------|--------------------|
| `NODE_ENV`            | Indicate the target environment.    | `development`      |
| `DEBUG_PILET`         | Injects pilet from development API. | `/$pilet-api`      |
| `DEBUG_PIRAL`         | Provides debug API for inspection.  | `1.0`              |
| `SHARED_DEPENDENCIES` | Allow exposing shared dependencies. | `react,react-dom`  |

To derive some of these properties some special fields of the `package.json` are used.

Special package keys:

| Name                  | Purpose                             | Example            |
|-----------------------|-------------------------------------|--------------------|
| `app`                 | Path to the root page to use.       | `"src/index.html"` |
| `pilets`.`externals`  | Names of the shared dependencies.   | `["reactstrap"]`   |

The bundler application also needs to understand that a file ending with `.codegen` should be pre-evaluated before included as a module. In case of a Piral instance we will need to evaluate the `dependencies.codegen` file in case the environment variable `SHARED_DEPENDENCIES` is set.

## Building a Pilet

A pilet is a module that can be published to a feed service. The feed service then serves the modules for use in a Piral instance.

Used environment variables:

| Name                  | Purpose                             | Example            |
|-----------------------|-------------------------------------|--------------------|
| `NODE_ENV`            | Indicate the target environment.    | `production`       |

Some special fields of the `package.json` are used to switch on some building features.

Special package keys:

| Name                  | Purpose                             | Example            |
|-----------------------|-------------------------------------|--------------------|
| `app`                 | Path to the root page to use.       | `"src/index.html"` |
| `peerDependencies`    | Indicates skipped dependencies.     | `{ "react": "*" }` |
| `externals`           | Names of additional externals.      | `[ "reactstrap" ]` |
| `piral`.`name`        | Name of the Piral instance.         | `"sample-piral"`   |

### Schema Versions

To allow versioning of a pilet's loading mechanism we use a special header line in the output bundle. The first line - if starting with a comment such as `//@pilet` will be treated as a pilet schema version indicator.

Right now there are two available schema versions; a legacy one (`v0`) and the current standard (`v1`). Backwards compatibility should always be given when specifying a new schema version.

Most notably the following components should all be able to gracefully fall back:

- The Piral instance (consumer)
- The Pilet Feed service (provider)
- The Pilet script itself (module)

**`v:0`**

The bundled code should be wrapped in an IIFE to look similar to:

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

## Limitations

The specification does not cover things like validation, declaration generation, scaffolding, or upgrading.

## Examples

The best example for following this specification is the `piral-cli` package itself.

To come up with a more realistic example we will in the following implement a pilet build process using Webpack.

(tbd)

## Acknowledgements

This specification was created by [smapiot](https://smapiot.com).

The initial author was [Florian Rappl](https://twitter.com/FlorianRappl). The review was done by [Lothar Schöttner](https://smapiot.com). Suggestions from [Jens Thirmeyer](https://www.iotcloudarchitect.com) have been taken into consideration.

## References

- [RFC2119](https://tools.ietf.org/html/rfc2119)
- [Parcel Bundler](https://parceljs.org)
- [Webpack](https://webpack.js.org)

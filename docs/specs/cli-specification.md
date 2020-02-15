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

(tbd)

Used environment variables:

| Name                  | Purpose | Example           |
|-----------------------|---------|-------------------|
| `NODE_ENV`            | ...     | `production`      |
| `SHARED_DEPENDENCIES` | ...     | `react,react-dom` |

### Building for Emulation Purposes

(tbd)

Used environment variables:

| Name                  | Purpose | Example           |
|-----------------------|---------|-------------------|
| `NODE_ENV`            | ...     | `development`     |
| `DEBUG_PILET`         | ...     | `v0`              |
| `DEBUG_PIRAL`         | ...     | `1.0`             |
| `SHARED_DEPENDENCIES` | ...     | `react,react-dom` |

## Building a Pilet

A pilet is a module that can be published to a feed service. The feed service then serves the modules for use in a Piral instance.

(tbd)

Used environment variables:

| Name                  | Purpose | Example           |
|-----------------------|---------|-------------------|
| `NODE_ENV`            | ...     | `production`      |

### Schema Versions

(tbd)

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

(tbd)

## Acknowledgements

This specification was created by [smapiot](https://smapiot.com).

The initial author was [Florian Rappl](https://twitter.com/FlorianRappl). The review was done by [Lothar Schöttner](https://smapiot.com). Suggestions from [Jens Thirmeyer](https://www.iotcloudarchitect.com) have been taken into consideration.

## References

- [RFC2119](https://tools.ietf.org/html/rfc2119)
- [Parcel Bundler](https://parceljs.org)

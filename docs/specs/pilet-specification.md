---
title: Pilet Package Specification
---

# Pilet Package Specification

## Abstract

A pilet is a small module that delivers additional functionality to a Piral instance. The exact format for packaging a pilet is described in this specification. The format is given by the layout and boundary conditions of the delivered package as well as parts of the package content.

## Introduction

A Piral instance alone only provides the shell for dynamically integrated modules called *pilets*. A pilet should be rather small and as atomic as possible. It could be bound to perform a certain task and / or to be delivered to certain users only.

At its core, a pilet is just a JavaScript library that exports at least a single function that is used by a Piral instance. This allows the pilet to integrate the provided functionality when called by the Piral instance.

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The keywords *MAY*, *MUST*, *MUST NOT*, *OPTIONAL*, *SHOULD*, and *SHOULD NOT* are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119).

## Glossary

**CDN**: Content Delivery Network

**IIFE**: Immediately Invoked Function Expression

**ISC**: Internet Systems Consortium

**JS**: JavaScript

**JSON**: JavaScript Object Notation

**MIT**: Massachusetts Institute of Technology

**UMD**: Universal Module Definition

**URL**: Uniform Resource Locator

**SPA**: Single Page Application

## Package Layout

The layout of a pilet package is a standard gzipped tarball (file extension *tgz*) that matches the npm package layout. In the root folder of the *tgz* file we also have the same `package.json` file. This file can - in addition to the standard npm keys - contain special Piral related keys. The special keys are described in further detail in the "Package Keys" section of this document.

The `main` key of the `package.json` has to point to a folder that has to contain all the assets shipped with the pilet. The assets must be linked from a JavaScript file that is either the *root JS file* or has been linked (directly or indirectly) by the *root JS file*. The *root JS file* is either directly named in the `main` key (e.g., `dist/example.js` would relate to the `dist` folder with *root JS file* `example.js`) or indirectly by just pointing to a folder (e.g., `dist/example` would relate to the `dist/example` folder with *root JS file* `index.js`).

The following diagram illustrates the potential contents of a pilet package. Important is that starting at the `package.json` all other references can be retrieved properly.

![Contents of a Pilet Package](../diagrams/pilet-format.svg)

A pilet package may contain more file types than just JSON and JS. Any asset that can be referenced properly (e.g., images, videos, ...) can be added. The maximum file size of a pilet package is implementation dependent. Pilets that are larger than 16 MB are strongly discouraged. Services providing access to pilets only need to support pilets up to this size.

## JavaScript Bundling Considerations

The *root JS file* contains the root module, which is the first module loaded when the bundle is evaluated by a JS engine.

### `v0` and `v1` Format

The code in this section works for `v0` and `v1` pilets. For `v1` the code could be also reduced to an evaluation against the `src` of the `currentScript` element, which also happens implicitly without any implementation.

#### UMD Creation

For proper bundling of the JS files, the UMD specification should be followed. The following parts are all relevant for the created bundle.

1. Wrap the content of the bundle in an IIFE.
2. Define a module resolver (A) inside that uses a local `require` (B) as a potential fallback. The local module resolver (B) will be passed in by Piral for the root module only.
3. If a global `require` (C) is given prefer this as the fallback. Otherwise, define it in the end with the defined module resolver (A).
4. Work through the bundled modules using the module resolver (A) for resolving dependencies.

*Remark*: As global `require` (C) a `window.pr_...` function should be used that is generated (and valid) for the current bundle only.

#### Bundle Splitting

The dynamic splitting of the single bundle into multiple files needs to adhere to the following algorithm.

1. Create a new `Promise` with `resolve` and `reject` handlers
2. Create a new `script` element
3. Set the `async` mode to `true`, the type to `text/javascript`, and the `charset` to `utf-8`
4. Set the `src` property to the script location
5. Attach the `reject` handler to the `onerror` event
6. Attach the `resolve` handler to the `onload` event
7. Append the `script` element to the `document.head`

The URL for the script has to be retrieved by the relative script URL combined with the root URL from the currently executing script. At the time of writing, multiple ways exist to derive this root URL, each one with its own advantages and disadvantages.

The most robust way to derive the global script URL is by taking a slice of the stack trace generated for an `Error` instance.

The following algorithm works quite reliably:

1. Start a new `try`-`catch` block
2. Inside the `try` block: throw a new `Error` object
3. Inside the `catch` block: Handle the `Error` by
   1. Getting the `stack`
   2. Matching the `string` against `(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+` globally
   3. Obtaining the base URL from the match
   4. Otherwise, just return `/`

The script for the partial resource has to be loaded from the same base URL as the currently running script.

### `v2` Format

This code in this section works exclusively for `v2` pilets. `v2` pilets are using the [SystemJS format](https://github.com/systemjs/systemjs/blob/main/docs/system-register.md). For conformance to this format the SystemJS specification should be considered.

## Package Keys

The following package keys are either already officially introduced by npm and reused, or introduced only for usage in Piral.

### `name`

The `name` property is a standard npm field that is required for a pilet.

The property defines the unique identifier of the pilet.

### `version`

The `version` property is a standard npm field that is required for a pilet.

The property defines the unique version of the pilet. It needs to adhere to the semantic versioning specification.

### `description`

The `description` property is a standard npm field that is optional for a pilet.

The property describes the contents and functionality of the given pilet.

By default, the `description` is left blank.

### `author`

The `author` property is a standard npm field that is optional for a pilet.

The property contains information about the author in the form of a string or an object containing properties such as `name`, `email`, and `url`. The string's format can be either a simple string or an email string (format: `name <email>`).

By default, the `author` is `(unknown)`.

### `license`

The `license` property is a standard npm field that is optional for a pilet.

The property reflects the license used for distributing the given pilet.

By default, the `license` is set to `ISC`, which is equivalent to MIT and npm's default.

### `piral`

The `piral` property is a non-standard field that is optional for a pilet, but may be necessary to determine the related (primary) Piral instance for debugging or validating the pilet.

The property contains a `comment` field for info purposes, as well as a `name` field to define the name of the package containing the emulator of the Piral instance. Other fields may be added, too.

By default, the `piral` is considered undefined, i.e., no primary Piral instance given.

### `peerDependencies`

The `peerDependencies` property is a standard npm field that is optional for a pilet.

The property contains information about the used shared dependencies that have to be supplied from the Piral instance. A feed service or Piral instance may reject the Pilet in case of unmatched shared dependencies.

By default, the `peerDependencies` are set to an empty record `{}`, i.e., no peer dependencies.

### `peerModules`

The `peerModules` property is a non-standard field that is optional for a pilet.

The property contains the names of all peer modules. A peer module is a full module qualifier that leads to the module of a package. For instance, the package `react-dom` comes with a module `react-dom/server`. While `react-dom` is a valid peer dependency, it is not a valid peer module. In contrast, `react-dom/server` is a valid peer module, but not a valid peer dependency.

Like the `peerDependencies` this property defines shared modules that have to be supplied from the Piral instance. A feed service or Piral instance may reject the Pilet in case of unmatched shared modules.

By default, the `peerModules` are set to an empty array `[]`, i.e., no peer modules.

### `dependencies`

The `dependencies` property is a standard npm field that is optional for a pilet.

The property contains information about the used direct dependencies that are supplied by the pilet. A feed service or Piral instance may reject the Pilet in case of blacklisted or insecure  dependencies.

All direct dependencies should be split from the bundle to allow potential sharing with other pilets. In case of very small direct dependencies directly bundling them into the root module is acceptable.

By default, the `dependencies` are set to an empty record `{}`, i.e., no dependencies.

### `main`

The `main` property is a standard npm field that is optional for a pilet.

The field is used to help determine where the root module is located. It is strongly encouraged to *always* set this value to a path leading explicitly or implicitly to the root module.

By default, the `main` is not set to an empty string.

The order of the search for the root module using the value of `main` (hereafter named `main`) is performed as follows:

1. Use `main` directly
2. Using `main` as a subpath below the `dist` directory
3. Using `main` as the path leading to an `index.js` file
4. Using `main` as a subpath below `dist` leading to an `index.js` file
5. Trying to find `index.js` in the root directory
6. Trying to find `index.js` in the `dist` directory

### `preview`

The `preview` property is a custom npm field that is optional for a pilet.

The property contains a boolean value indicating whether the current pilet should be released as a preview independent of the information gathered from the semantic versioning.

This allows a pilet feed service to selectively increment preview versions of the same pilet. In case of a non-conflicting prerelease derived from semantic versioning, the `preview` field wins.

By default, the `preview` field is set to `false`.

### `custom`

The `custom` property is a custom npm field that is optional for a pilet.

The property can contain any value. The content of this field is transported from the feed service to the Piral instance.

This allows the client (or special feed service implementation) to receive (and forward) some additional data about the pilet.

By default, the `custom` field is set to `null` and thus will not be forwarded.

## Root Module Layout

The root module must export a single function called `setup`. This function will receive a single argument known as the *pilet API*. The pilet API is the interface between the hosting Piral instance and a pilet.

The following TypeScript interface defines the expected exported shape of a pilet as seen from the perspective of a JS library.

```ts
interface RootModuleLayout {
  setup(api: PiletApi): void | Promise<void>;
  teardown?(api: PiletApi): void;
}

type RootModule = Promise<RootModuleLayout> | RootModuleLayout;
```

In case calling the module results in a `Promise`, the evaluation is postponed until the `Promise` was resolved.

In case calling the `setup` function of pilet returns a `Promise`, the depending on the used loading strategy the application may wait before continuing.

The provided pilet API must contain at least the following functionality.

```ts
interface PiletApi {
  meta: PiletMetadata;
  on(type: string, callback: Listener): PiletApi;
  off(type: string, callback: Listener): PiletApi;
  emit(type: string, arg: any): PiletApi;
}
```

where the `PiletMetadata` interface refers to

```ts
interface PiletMetadata {
  /**
   * Name of the pilet
   */
  name: string;
  /**
   * Version of the pilet
   */
  version: string;
  /**
   * Content of the pilet (v:0)
   */
  content?: string;
  /**
   * Link to the pilet entry script
   */
  link?: string;
  /**
   * Bundled pilet global reference
   */
  bundle?: string;
  /**
   * Checksum of the pilet (v:0)
   */
  hash?: string;
  /**
   * Pilet global reference (v:1 and v:2)
   */
  requireRef?: string;
  /**
   * Checksum of the pilet (v:1 and v:2)
   */
  integrity?: string;
  /**
   * Local caching rule (v:0)
   */
  noCache?: boolean | string;
  /**
   * Specification of the pilet for evaluation
   */
  spec?: string;
  /**
   * Custom metadata
   */
  custom?: any;
  /**
   * Configuration metadata
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files
   */
  dependencies?: Record<string, string>;
}
```

to indicate the metadata of the current pilet. Which parts are actually available must be determined by the feed service in combination with the used version of the pilet. The version of the pilet must be fully given by a so-called *spec version marker*, which is specified in the next section.

The remaining parts of the Pilet API are defined by the Piral instance. While `piral-core` and the Piral plugins add quite some functionality here, these APIs are not part of the base Piral API that is framework agnostic.

## Pilet Spec Version Marker

The root module (i.e., generated main bundle) can be decorated with a special comment. When the pilet feed service detects that the main bundle starts with a comment like

```js
//@pilet v:
```

it will automatically parse that line as a pilet spec version marker. The syntax is as follows:

```js
//@pilet v:<version-number>[(<spec-arguments>)]
```

Right now the following values for `<version-number>` exist:

- `0`: Initial specification (marker is optional).
- `1`: Extended specification (marker is required).
- `2`: Extended specification (marker is required).
- `x`: Custom specification (marker is required).

All official (i.e., numbered) specifications are backwards compatible, i.e., evaluating a `v:1` pilet with a `v:0` Piral instance should work.

The `v:x` specification was introduced to allow custom formats to work besides official formats. Custom formats are not constraint by any compatibility requirements.

### `v:0`

- Evaluation can be done with `new Function` or `eval`.
- Exports to `module.exports`.
- Supports transport via `content` and `link`.
- No arguments defined.

### `v:1`

- Evaluation should be done by appending a new `<script>`.
- Exports to `document.currentScript.app`.
- Supports transport via `link`.
- Requires a single argument declaring the global require reference.

### `v:2`

- Evaluation should be done via SystemJS.
- Registration of the module by using `System.register`.
- Supports transport via `link`.
- Requires two arguments separated by a comma.
- The first argument declares the global require reference.
- The second argument is a JSON serialized object, which defines the shared dependencies from the pilet.

### `v:x`

- Evaluation will be done by the application in a custom specified manner.
- The metadata is fully determined by the custom specification.
- Optionally uses a single argument to indicate the custom type transported via the `spec` field.

## Examples

The [Piral CLI](https://www.npmjs.com/package/piral-cli) provides all capabilities to successfully build a pilet and package it according to this specification. The bundling itself is done with [Parcel](https://parceljs.org).

The *package.json* for this example looks like

```json
{
  "name": "pilet-example",
  "version": "1.0.0",
  "description": "No description.",
  "keywords": [],
  "dependencies": {},
  "devDependencies": {
    "sample-piral": "latest",
  },
  "peerDependencies": {
    "sample-piral": "*"
  },
  "scripts": {
    "build": "pilet build"
  },
  "main": "dist/index.js",
  "files": [
    "dist"
  ],
  "piral": {
    "name": "sample-piral"
  }
}
```

which was made for the `sample-piral` Piral instance.

Starting with a single file *src/index.js* that looks like

```js
export function setup(piral) {
  piral.showNotification('Hello World!');
}
```

the application is capable of creating a file `dist/index.js`, which was formed to contain:

```js
//@pilet v:0
!(function(global,parcelRequire){
parcelRequire=function(e,r,t,n){var i,o="function"==typeof global.pr_1fab123ad4fd76bd20e5e5e97366fd47&&global.pr_1fab123ad4fd76bd20e5e5e97366fd47,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof global.pr_1fab123ad4fd7
6bd20e5e5e97366fd47&&global.pr_1fab123ad4fd76bd20e5e5e97366fd47;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r}
,p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=f
unction(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(
){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"zo2T":[function(require,module,exports) {
"use strict";function e(e){e.showNotification("Hello World!")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.setup=e;
},{}]},{},["zo2T"], null)
;global.pr_1fab123ad4fd76bd20e5e5e97366fd47=parcelRequire}(window, window.pr_1fab123ad4fd76bd20e5e5e97366fd47));
```

Parcel transpiles the module system to a single file. It still allows child bundles, however, the communication of the externals need to go over the described global `require`, which is *unique* per pilet and the same for the main bundle and all child bundles.

In the example above the `require` is referenced via

```js
window.pr_1fab123ad4fd76bd20e5e5e97366fd47
```

Importantly, the code above still takes a global `require` function if available. This function is set per pilet from the Piral instance and it used to resolve the shared dependencies.

**Remark**: The initial comment is a pilet marker. If left out version 0 should be inferred by the pilet feed service. In the provided example version 0 is explicitly marked.

The internal structure and wrapper are bundler specific. The one shown is generated by Parcel.

The final package for this Pilet can be created using `npm` (or the Piral CLI for that matter) using `npm pack`.

For `v1` the output changes to:

```js
//@pilet v:1(pr_1fab123ad4fd76bd20e5e5e97366fd47)
!(function(global,parcelRequire){
parcelRequire=function(e,r,t,n){function define(getExports){(typeof document!=='undefined')&&(document.currentScript.app=getExports())};define.amd=true;var i,o="function"==typeof global.pr_1fab123ad4fd76bd20e5e5e97366fd47&&global.pr_1fab123ad4fd76bd20e5e5e97366fd47,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof global.pr_1fab123ad4fd7
6bd20e5e5e97366fd47&&global.pr_1fab123ad4fd76bd20e5e5e97366fd47;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r}
,p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=f
unction(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(
){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"zo2T":[function(require,module,exports) {
"use strict";function e(e){e.showNotification("Hello World!")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.setup=e;
},{}]},{},["zo2T"], null)
;global.pr_1fab123ad4fd76bd20e5e5e97366fd47=parcelRequire}(window, window.pr_1fab123ad4fd76bd20e5e5e97366fd47));
```

For `v2` the output changes to:

```js
//@pilet v:2(pr_1fab123ad4fd76bd20e5e5e97366fd47, {})
System.register([],function(e,c){var dep;return{setters:[function(_dep){dep = _dep;}],execute:function(){_export((function(){
//...
})())}};});
```

## Limitations

Not all assets should be packed into a pilet. Videos and larger (or in general persistent) images should be hosted on a CDN, where data transfer is faster and caching is independent of the published version of the pilet.

The maximum specified file size of a pilet is 16 MB. Anything larger is potentially not supported by the used feed service.

## Acknowledgments

This specification was created by [smapiot](https://smapiot.com).

The initial author was [Florian Rappl](https://twitter.com/FlorianRappl). The review was done by [Lothar Schöttner](https://smapiot.com). Suggestions from [Jens Thirmeyer](https://www.iotcloudarchitect.com) have been taken into consideration.

## References

- [RFC2119](https://tools.ietf.org/html/rfc2119)
- [CLI Specification](./cli-specification.md)
- [npm: About Packages and Modules](https://docs.npmjs.com/about-packages-and-modules)
- [UMD: Patterns and Examples](https://github.com/umdjs/umd)
- [SystemJS: Register API](https://github.com/systemjs/systemjs/blob/main/docs/system-register.md)

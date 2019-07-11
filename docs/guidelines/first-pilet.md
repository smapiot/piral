# Your First Pilet

Writing your first pilet should not be more complicated than writing your first web app. In fact, due to the Piral CLI it may be even more simple - as simple as writing a library.

## The Basic Concept

A pilet is structurally nothing more than a library that will be published in form of a bundled NPM library. As a consequence, a pilet needs to consist of at least a single JavaScript module, i.e., a JavaScript file that exports some functionality. For a pilet only a single export is needed - a function called `setup`.

Usually, pilets are developed using TypeScript. You are not forced to use TypeScript. You can use any language as long as it can be transpiled to a valid JavaScript (ES5) bundle.

The bundling of the pilets can be done with any bundler. By default, we recommend using the Piral CLI, which uses *Parcel* under the hood. The Piral CLI will take care of the essential steps when bundling to ensure a correct bundle has been produced. This includes:

- Producing a correct bundle with the exported `setup` function
- Not including (i.e., bundling) the shared dependencies (e.g., React)
- Supporting bundle splitting for asynchronous pilets
- Supporting resource references for including (smaller) assets such as images or stylesheets

Let's start creating our first pilet by using the Piral CLI scaffolding capabilities.

## Scaffolding using the Piral CLI

(tbd)

## Piral Instance Emulation

(tbd)

## Understanding the Pilet API

(tbd)

## Building and Publishing

(tbd)

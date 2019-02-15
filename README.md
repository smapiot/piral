# Piral - Next Generation Portal

Easily build a next generation portal application.

:warning: This is all WIP right now.

## Overview

We call the modules pilets. A pilet is a small module that lives inside a piral instance.

## Development

For development you need to have the following software installed:

- Node.js with NPM (for instructions see [Node.js website](https://nodejs.org/en/))
- Lerna

On the command line install Lerna:

```sh
npm install --global lerna
```

Once you cloned the repository make sure to bootstrap it (installs all dependencies and more).

```sh
lerna bootstrap
```

Now you are ready to build all contained modules:

```sh
lerna run build
```

If you want to run the sample application you can already do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again):

```sh
node node_modules/.bin/piral debug packages/piral-sample/src/index.html
````

This will open a development server sitting at `http://localhost:1234`. Right now our CLI is just a tiny wrapper around Parcel :rocket:.

## License

Piral is released using the MIT license. For more information see the [license file](LICENSE).

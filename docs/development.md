# Development

## Prequisites

For development you need to have the following software installed:

- Node.js with NPM (for instructions see [Node.js website](https://nodejs.org/en/))
- Lerna, see [official website](https://lernajs.io)
- Yarn, see [official website](https://yarnpkg.com/lang/en/)
- Obviously, you'll also need a proper command line terminal and git properly set up

## Setup

On the command line install Lerna and Yarn (if not done already):

```sh
npm install --global lerna yarn
```

Once you cloned the repository make sure to bootstrap it (installs all dependencies and more).

```sh
lerna bootstrap
```

Now you are ready to build all contained modules:

```sh
lerna run build
```

## Sample Application

If you want to run the sample application you can already do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again):

```sh
node node_modules/.bin/piral debug packages/piral-sample/src/index.html
```

This will open a development server sitting at `http://localhost:1234`. Right now our CLI is just a tiny wrapper around Parcel :rocket:.

## Simple Development Tools

For keeping parts of our documentation up-to-date we use a set of simple scripts. We added them to the global *package.json*, such that they are easily accessible.

For instance running

```sh
yarn docgen
```

will update the full documentation based on the current state of the source code. This includes updating the documentation for the `pb` command line tool.

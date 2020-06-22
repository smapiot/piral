# Piral Sources

Piral is developed as a monorepo.

## Available Sources

- [converters](./converters/README.md) contains all the published converter plugins
- [framework](./framework/README.md) contains the core framework packages
- [initializers](./initializers/README.md) provides available NPM initializers
- [pages](./pages/README.md) has the code for the basic Piral websites
- [plugins](./plugins/README.md) contains all the published pilet API plugins
- [samples](./samples/README.md) has example applications for different parts of the solution
- [tooling](./tooling/README.md) contains the Piral CLI and some plugin packages
- [utilities](./utilities/README.md) has some Node.js utility packages

## Development of Piral

### Prerequisites

For development you need to have the following software installed:

- Git must be set up to clone / work with the repository
- Node.js with NPM (for instructions see [Node.js website](https://nodejs.org/en/))
- Lerna, see [official website](https://lernajs.io)
- Yarn, see [official website](https://yarnpkg.com/lang/en/)
- Obviously, you'll also need a proper command line terminal

### Setup

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

### Sample Application

If you want to run the sample application you can already do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again):

```sh
yarn watch:demo-full
```

in the workspace.

This will open a development server sitting at `http://localhost:1234`. Right now the Piral CLI is just a tiny wrapper around Parcel :rocket:.

### Simple Development Tools

For keeping parts of our documentation up-to-date we use a set of simple scripts. We added them to the global *package.json*, such that they are easily accessible.

For instance running

```sh
yarn docgen
```

will update the full documentation based on the current state of the source code. This includes updating the documentation for the `pb` command line tool.

### Versioning

The versioning is fully managed via the *CHANGELOG.md* file. If you make a change to the currently not yet released version block just add your lines. Otherwise, add a new version block. This looks as follows:

```md
## 1.2.3 (not released yet)

* Awesome feature 1
* Awesome feature 2
```

Changes to `develop` will always result in a preview build (pre-release) of the packages. For the pre-release the latest version from the *CHANGELOG.md* is used. In addition the build id is added to make the pre-release unique and easy to identify.

When merging into master the latest version block of the *CHANGELOG.md* will be changed to contain the current release date.

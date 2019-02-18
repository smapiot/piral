[![Piral Logo](docs/logo.png)](https://piral.io)

# [Piral](https://piral.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![Lerna](https://img.shields.io/badge/monorepo-lerna-cc00ff.svg)](https://lernajs.io/) [![Build Status](https://travis-ci.org/smapiot/piral.svg?branch=master)](https://travis-ci.org/smapiot/piral) [![GitHub Tag](https://img.shields.io/github/tag/smapiot/piral.svg)](https://github.com/smapiot/piral/releases) [![GitHub Issues](https://img.shields.io/github/issues/smapiot/piral.svg)](https://github.com/smapiot/piral/issues) [![CLA Assistant](https://cla-assistant.io/readme/badge/smapiot/piral)](https://cla-assistant.io/smapiot/piral)

Easily build a next generation portal application. Piral enables you to create a modular frontend application that is extended at runtime with decoupled modules called *pilets*.

:zap: A pilet is capable of dynamically extending other pilets or using such extension slots itself. Otherwise, a pilet is quite isolated (developed and handled) and will never destroy your application.

:warning: This is all WIP right now.

## Getting Started

Creating your own Piral app is as simple as installing Piral as a dependency to your React app:

```sh
npm i piral-core
```

**Remark**: This package already includes TypeScript declarations. No need to install other packages.

Now you can create a new Piral instance in your code:

```jsx
import { createInstance } from 'piral-core';

const App = createInstance({
  requestModules: () => fetch('https://feed.piral.io/sample'),
});
```

**Remark**: For all available API options make sure to check out the [documentation](https://docs.piral.io).

**Note**: The feed above should only be used for demonstration purposes. Either set up your own feed or your own API / mechanism to serve the modules.

Finally, you can render this Piral instance by using the `render` function from `react-dom`:

```jsx
render((
  <App>
    {content => <Layout>{content}</Layout>}
  </App>
), document.querySelector('#app'));
```

Alternatively, you can use your new Piral instance anywhere as a component.

Your Piral app can be build with any technology that you like or already use (e.g., Webpack, Parcel, ...). If you are unsure what to you use you may fall back to `piral-cli`, which (among other things) also contains a build mechanism that *should just work* :rocket:.

## Development

For development you need to have the following software installed:

- Node.js with NPM (for instructions see [Node.js website](https://nodejs.org/en/))
- Lerna, see [official website](https://lernajs.io)
- Yarn, see [official website](https://yarnpkg.com/lang/en/)

On the command line install Lerna and Yarn:

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

If you want to run the sample application you can already do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again):

```sh
node node_modules/.bin/piral debug packages/piral-sample/src/index.html
```

This will open a development server sitting at `http://localhost:1234`. Right now our CLI is just a tiny wrapper around Parcel :rocket:.

## Contributing

The main purpose of this repository is to continue to evolve Piral core, making it faster, more powerful, and easier to use. Development of Piral happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Piral.

### [Code of Conduct](./CODE_OF_CONDUCT.md)

We adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](.github/CONTRIBUTING.md)

Read our [contributing guide](.github/CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Piral.

### Good First Issues

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/smapiot/piral/labels/good%20first%20issue) that contain bugs which have a relatively limited scope. This is a great place to get started.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](docs/assets/logo.png)](https://piral.io)

# [Piral](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![Lerna](https://img.shields.io/badge/monorepo-lerna-cc00ff.svg)](https://lernajs.io/) [![Build Status](https://smapiot.visualstudio.com/piral/_apis/build/status/piral-CI?branchName=develop)](https://smapiot.visualstudio.com/piral/_build/latest?definitionId=10) [![GitHub Tag](https://img.shields.io/github/tag/smapiot/piral.svg)](https://github.com/smapiot/piral/releases) [![GitHub Issues](https://img.shields.io/github/issues/smapiot/piral.svg)](https://github.com/smapiot/piral/issues) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community) [![CLA Assistant](https://cla-assistant.io/readme/badge/smapiot/piral)](https://cla-assistant.io/smapiot/piral)

Easily build a next generation portal application using microfrontends. Piral enables you to create a modular frontend application that is extended at runtime with decoupled modules called *pilets* leveraging a **microfrontend architecture**. A pilet can be **developed independently** and ships with the necessary code, as well as all other relevant assets.

This makes Piral an ideal foundation for a mid-sized to large-scale applications developed by **distributed teams**.

:zap: A pilet is capable of dynamically **extending other pilets** or using such extension slots itself.

:zap: A pilet is **isolated** (developed and handled) and will never destroy your application.

:zap: A pilet can be developed with **any technology** using a **standard IDE**.

:zap: A pilet can be updated and **published within seconds**.

## Getting Started

Piral itself is developed as a monorepo. As such this repository may contain an overwhelming amount of information.

Our recommendation is to start at the documentation available at [docs.piral.io](https://docs.piral.io). Working through the available [tutorials](https://docs.piral.io/tutorials) will give you the necessary information in the best possible order.

## Questions

While [the GitHub issues](https://github.com/smapiot/piral/issues) may be used in case of questions, we would prefer general usage questions to be raised either in [our Gitter chat](https://gitter.im/piral-io/community) or [at StackOverflow](https://stackoverflow.com/questions/tagged/piral).

Be sure to check [our FAQ](https://docs.piral.io/faq) and [the official tutorials](https://docs.piral.io/tutorials) upfront!

## Contributing

The main purpose of this repository is to continue to evolve Piral and its core ecosystem, making it faster, more powerful, and easier to use. Development of Piral happens in the open on [GitHub](https://github.com/smapiot/piral), and we are grateful to the community for contributing bugfixes, ideas, and improvements.

Read below to learn how you can take part in improving Piral.

### Repository Structure

- `docs` contains the (user) documentation
- `src` has the sources for all the developed packages, samples, and pages
- `test` contains the test setup and (in the future) system tests
- `tools` has some of the internal tooling for building the different components

Each subdirectory contains another `README.md` with more information regarding the contents of the specific folder.

### [Code of Conduct](./CODE_OF_CONDUCT.md)

We adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](.github/CONTRIBUTING.md)

Read our [contributing guide](.github/CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Piral.

### Good First Issues

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/smapiot/piral/labels/good%20first%20issue) that contain bugs which have a relatively limited scope. This is a great place to get started.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Cross Frameworks Sample](https://piral.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE)

The sample application should demonstrate you the use of multiple frameworks in the context of Piral. Piral is referenced via `piral-core`. The pilets are not served from any backend, but are provided out of the box.

## Running

If you want to run the sample you can do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again). Make sure to run the following command from the root of the monorepo:

```sh
yarn watch:demo-cross
```

This will open a development server sitting at `http://localhost:1234`. Right now our CLI is just a tiny wrapper around Parcel :rocket:.

## Building

You can also build the sample web app built on top of `piral-core` to see what the outcome ("produced assets") of such a web app is. Running

```sh
yarn build:demo-cross
```

will produce the assets in the *dist/demo-cross/release* directory.

### Pilets

The pilets for this sample are stored in a separate repository. You'll find the [repository at GitHub](https://github.com/smapiot/sample-cross-fx-pilets).

Each pilet is published on the public feed service in the [cross-fx feed](https://feed.piral.cloud/api/v1/pilet/cross-fx).

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

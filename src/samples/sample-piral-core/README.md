[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Core Sample App](https://piral.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE)

The sample application should demonstrate you the use of `piral-core` to create your own Piral instance (or portal). The pilets are not served from any backend, but are provided out of the box. Some delays are inserted to showcase the loading spinners.

The provided pilets show some of the features of the standard API created by `piral-core`. We see that a feed connector can automatically handle the lazy loading and change of a data feed, that routes and pages can be registered and unregistered at any time, and that Piral comes with a notification management.

## Running

If you want to run the sample you can do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again). Make sure to run the following command from the root of the monorepo:

```sh
yarn watch:demo-core
```

This will open a development server sitting at `http://localhost:1234`. Right now our CLI is just a tiny wrapper around Parcel :rocket:.

## Building

You can also build the sample web app built on top of `piral-core` to see what the outcome ("produced assets") of such a web app is. Running

```sh
yarn build:demo-core
```

will produce the assets in the *dist/demo-core/release* directory.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Sample App](https://piral.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/sample-piral.svg?style=flat)](https://www.npmjs.com/package/sample-piral)

The sample application should demonstrate you the use of `piral` to create your own Piral instance (or portal). The pilets are served from a sample backend.

The provided pilets show some of the features of the standard API created by `piral`. For more information on the `piral` API please look at the sample using `piral-core` (see `sample-piral-core` folder).

## Running

If you want to run the sample you can do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again). Make sure to run the following command from the root of the monorepo:

```sh
yarn watch:demo-full
```

This will open a development server sitting at `http://localhost:1234`. Right now our CLI is just a tiny wrapper around Parcel :rocket:.

## Building

You can also build the sample Piral instance to see what the outcome ("produced assets") of such a web app is. Running

```sh
yarn build:demo-full
```

will produce the assets in the *dist/demo-full/release* directory. Additionally, the tarball for distribution via NPM will be placed in the *dist/demo-full/develop* directory.

## Using

This example is also published on NPM as `sample-piral`.

You can scaffold a new pilet for this instance using the `piral-cli`:

```sh
pilet new sample-piral --target my-first-pilet
```

This will create a new pilet called `my-first-pilet` in the *./my-first-pilet* folder. Afterwards run `npm install` in the directory to resolve all dependencies followed by `npm start` to start the instance locally.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Sample App](https://piral.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE)

The sample application should demonstrate you the use of `piral` to create your own Piral instance (or portal). The pilets are served from a sample backend.

The provided pilets show some of the features of the standard API created by `piral`. For more information on the `piral` API please look at the sample using `piral-core` (see `sample-piral-core` folder).

## Running

If you want to run the sample you can do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again). Make sure to run the following command from the root of the monorepo:

```sh
yarn demos:full
```

This will open a development server sitting at `http://localhost:1234`. Right now our CLI is just a tiny wrapper around Parcel :rocket:.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

# Piral Sample

The sample application should demonstrate you the use of `piral-core` to create your own Piral instance (or portal). The pilets are not served from any backend, but are provided out of the box. Some delays are inserted to showcase the loading spinners.

The provided pilets show some of the features of the standard API created by `piral-core`. We see that a feed connector can automatically handle the lazy loading and change of a data feed, that routes and pages can be registered and unregistered at any time, and that Piral comes with a notification management.

## Running

If you want to run the sample you can do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again). Make sure to run the following command from the root of the monorepo:

```sh
node node_modules/.bin/piral debug packages/piral-sample/src/index.html
```

This will open a development server sitting at `http://localhost:1234`. Right now our CLI is just a tiny wrapper around Parcel :rocket:.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

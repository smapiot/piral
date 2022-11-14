[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Empty Piral App](https://piral.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/sample-piral.svg?style=flat)](https://www.npmjs.com/package/sample-piral)

The empty application only exposes the basic API, which makes it great for building really independent pilets.

## Running

If you want to run the sample you can do it with our CLI tool (which should be available after building, otherwise use `lerna bootstrap` again). Make sure to run the following command from the root of the monorepo:

```sh
yarn watch:demo-empty
```

This will open a development server sitting at `http://localhost:1234`.

## Building

You can also build the sample Piral instance to see what the outcome ("produced assets") of such a web app is. Running

```sh
yarn build:demo-empty
```

will produce the assets in the *dist/demo-empty/release* directory. Additionally, the tarball for distribution via NPM will be placed in the *dist/demo-empty/emulator* directory.

## Using

This example is also published on NPM as `empty-piral`.

You can scaffold a new pilet for this instance using the `piral-cli`:

```sh
npm init pilet --source empty-piral --target my-first-pilet --bundler esbuild --defaults
```

(**Note**: Here we select `esbuild` as bundler to use - you can choose any other if you want to)

Alternatively, you can also just omit the `--source` as the `empty-piral` app shell is chosen by default.

This will create a new pilet called `my-first-pilet` in the *./my-first-pilet* folder. Afterwards run `npm start` to start the instance locally.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

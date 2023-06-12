# `pilet debug`

Starts the debugging process for a pilet using a Piral instance.

## Syntax

From the command line:

```sh
pilet debug [source..]
```

Alternative:

```sh
pb debug-pilet [source..]
```

## Aliases

Instead of `debug-pilet` you can also use:

- `watch-pilet`
- `debug`
- `watch`

## Positionals

### `source`

Sets the source file containing the pilet root module.


- Type: `string`
- Default: `./src/index`

## Flags

### `--target`

Sets the target directory or file of bundling.


- Type: `string`
- Default: `"./dist/index.js"`

### `--public-url`

Sets the public URL (path) of the application.


- Type: `string`
- Default: `"/"`

### `--port`

Sets the port of the local development server.


- Type: `number`
- Default: `1234`

### `--log-level`

Sets the log level to use (1-5).


- Type: `number`
- Default: `3`

### `--concurrency`

Sets the maximum number of concurrent build jobs.


- Type: `number`
- Default: `16`

### `--open`

Opens the pilet directly in the browser.


- Type: `boolean`
- Default: `false`

### `--no-open`

Opposite of:
Opens the pilet directly in the browser.


- Type: `boolean`
- Default: `true`

### `--hmr`

Activates Hot Module Reloading (HMR).


- Type: `boolean`
- Default: `true`

### `--no-hmr`

Opposite of:
Activates Hot Module Reloading (HMR).


- Type: `boolean`
- Default: `false`

### `--krasrc`

Sets a config file for overwriting the default kras options.


- Type: `string`
- Default: `undefined`

### `--optimize-modules`

Also includes the node modules for target transpilation.


- Type: `boolean`
- Default: `false`

### `--no-optimize-modules`

Opposite of:
Also includes the node modules for target transpilation.


- Type: `boolean`
- Default: `true`

### `--schema`

Sets the schema to be used when bundling the pilets.


- Type: `string`
- Choices: `"v0"`, `"v1"`, `"v2"`, `"none"`
- Default: `undefined`

### `--bundler`

Sets the bundler to use.


- Type: `string`
- Choices: ``
- Default: `undefined`

### `--app`

Sets the name of the Piral instance.


- Type: `string`
- Default: `undefined`

### `--app-dir`

Sets the path to a custom Piral instance for serving.


- Type: `string`
- Default: `undefined`

### `--feed`

Sets the URL of a pilet feed for including remote pilets.


- Type: `string`
- Default: `undefined`

### `--base`

Sets the base directory. By default the current directory is used.


- Type: `string`
- Default: `process.cwd()`

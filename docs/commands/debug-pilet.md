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

Examples:

```sh
pilet debug --target "some value"
```

### `--public-url`

Sets the public URL (path) of the application.

- Type: `string`
- Default: `"/"`

Examples:

```sh
pilet debug --public-url "some value"
```

### `--port`

Sets the port of the local development server.

- Type: `number`
- Default: `1234`

Examples:

```sh
pilet debug --port 42
```

### `--strict-port`

Forces the defined port to be used or exists with an error.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet debug --strict-port
```

```sh
pilet debug --no-strict-port
```

### `--no-strict-port`

Opposite of:
Forces the defined port to be used or exists with an error.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet debug --strict-port
```

```sh
pilet debug --no-strict-port
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
pilet debug --log-level 42
```

### `--concurrency`

Sets the maximum number of concurrent build jobs.

- Type: `number`
- Default: `16`

Examples:

```sh
pilet debug --concurrency 42
```

### `--open`

Opens the pilet directly in the browser.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet debug --open
```

```sh
pilet debug --no-open
```

### `--no-open`

Opposite of:
Opens the pilet directly in the browser.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet debug --open
```

```sh
pilet debug --no-open
```

### `--hmr`

Activates Hot Module Reloading (HMR).

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet debug --hmr
```

```sh
pilet debug --no-hmr
```

### `--no-hmr`

Opposite of:
Activates Hot Module Reloading (HMR).

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet debug --hmr
```

```sh
pilet debug --no-hmr
```

### `--krasrc`

Sets a config file for overwriting the default kras options.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet debug --krasrc "some value"
```

### `--optimize-modules`

Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet debug --optimize-modules
```

```sh
pilet debug --no-optimize-modules
```

### `--no-optimize-modules`

Opposite of:
Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet debug --optimize-modules
```

```sh
pilet debug --no-optimize-modules
```

### `--schema`

Sets the schema to be used when bundling the pilets.

- Type: `string`
- Choices: `"v0"`, `"v1"`, `"v2"`, `"v3"`, `"mf"`, `"none"`
- Default: `undefined`

Examples:

```sh
pilet debug --schema "v0"
```

### `--bundler`

Sets the bundler to use.

- Type: `string`
- Choices: `"bun"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"rspack"`, `"webpack"`, `"webpack5"`, `"vite"`, `"vite5"`, `"xbuild"`
- Default: `undefined`

Examples:

```sh
pilet debug --bundler "bun"
```

### `--app`

Sets the name of the Piral instance.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet debug --app "some value"
```

### `--app-dir`

Sets the path to a custom Piral instance for serving.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet debug --app-dir "some value"
```

### `--feed`

Sets the URL of a pilet feed for including remote pilets.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet debug --feed "some value"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet debug --base "some value"
```

# `piral debug`

Starts the debugging process for a Piral instance.

## Syntax

From the command line:

```sh
piral debug [source]
```

Alternative:

```sh
pb debug-piral [source]
```

## Aliases

Instead of `debug-piral` you can also use:

- `watch-piral`
- `debug-portal`
- `watch-portal`

## Positionals

### `source`

Sets the source Piral instance path for collecting all the information.

- Type: `string`
- Default: `./`

## Flags

### `--target`

Sets the target directory or file of bundling.

- Type: `string`
- Default: `"./dist"`

Examples:

```sh
piral debug --target "some value"
```

### `--port`

Sets the port of the local development server.

- Type: `number`
- Default: `1234`

Examples:

```sh
piral debug --port 42
```

### `--strict-port`

Forces the defined port to be used or exists with an error.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral debug --strict-port
```

```sh
piral debug --no-strict-port
```

### `--no-strict-port`

Opposite of:
Forces the defined port to be used or exists with an error.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral debug --strict-port
```

```sh
piral debug --no-strict-port
```

### `--public-url`

Sets the public URL (path) of the bundle.

- Type: `string`
- Default: `"/"`

Examples:

```sh
piral debug --public-url "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
piral debug --log-level 42
```

### `--open`

Opens the Piral instance directly in the browser.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral debug --open
```

```sh
piral debug --no-open
```

### `--no-open`

Opposite of:
Opens the Piral instance directly in the browser.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral debug --open
```

```sh
piral debug --no-open
```

### `--hmr`

Activates Hot Module Reloading (HMR).

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral debug --hmr
```

```sh
piral debug --no-hmr
```

### `--no-hmr`

Opposite of:
Activates Hot Module Reloading (HMR).

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral debug --hmr
```

```sh
piral debug --no-hmr
```

### `--krasrc`

Sets a config file for overwriting the default kras options.

- Type: `string`
- Default: `undefined`

Examples:

```sh
piral debug --krasrc "some value"
```

### `--optimize-modules`

Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral debug --optimize-modules
```

```sh
piral debug --no-optimize-modules
```

### `--no-optimize-modules`

Opposite of:
Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral debug --optimize-modules
```

```sh
piral debug --no-optimize-modules
```

### `--bundler`

Sets the bundler to use.

- Type: `string`
- Choices: `"bun"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"rspack"`, `"webpack"`, `"webpack5"`, `"vite"`, `"vite5"`, `"xbuild"`
- Default: `undefined`

Examples:

```sh
piral debug --bundler "bun"
```

### `--feed`

Sets the URL of a pilet feed for including remote pilets.

- Type: `string`
- Default: `undefined`

Examples:

```sh
piral debug --feed "some value"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
piral debug --base "some value"
```

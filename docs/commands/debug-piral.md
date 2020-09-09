# `debug-piral`

Starts the debugging process for a Piral instance.

## Syntax

From the command line:

```sh
pb debug-piral [source]
```

Alternative:

```sh
piral debug [source]
```

## Aliases

Instead of `debug-piral` you can also use:

- `watch-piral`
- `debug-portal`
- `watch-portal`

## Positionals

### `source`

Sets the source root directory or index.html file for collecting all the information.

- Type: `string`
- Default: `./`

## Flags

### `--port`

Sets the port of the local development server.

- Type: `number`
- Default: `1234`

### `--public-url`

Sets the public URL (path) of the bundle.

- Type: `string`
- Default: `"/"`

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--open`

Opens the Piral instance directly in the browser.

- Type: `boolean`
- Default: `false`

### `--no-open`

Opposite of:
Opens the Piral instance directly in the browser.

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

### `--optimize-modules`

Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `false`

### `--no-optimize-modules`

Opposite of:
Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `true`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

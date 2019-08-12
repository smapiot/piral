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

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

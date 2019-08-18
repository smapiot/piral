# `debug-pilet`

Starts the debugging process for a pilet using a Piral instance.

## Syntax

From the command line:

```sh
pb debug-pilet [source]
```

Alternative:

```sh
pilet debug [source]
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

### `--port`

Sets the port of the local development server.

- Type: `number`
- Default: `1234`

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--app`

Sets the name of the Piral instance.

- Type: `string`
- Default: `undefined`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

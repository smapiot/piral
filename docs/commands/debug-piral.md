# `debug-piral`

<!--start:auto-generated-->

Starts the debugging process for a Piral instance.

## Syntax

From the command line:

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

Sets the source index.html file for collecting all the information.

- Type: `string`
- Default: `./src/index.html`

## Flags

### `--port`

Sets the port of the local development server.

- Type: `number`
- Default: `1234`

### `--public-url`

Sets the public URL (path) of the bundle.

- Type: `string`
- Default: `"/"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

<!--end:auto-generated-->

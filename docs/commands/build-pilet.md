# `build-pilet`

<!--start:auto-generated-->

Creates a production build for a pilet.

## Syntax

From the command line:

```sh
pb build-pilet [source]
```

## Aliases

Instead of `build-pilet` you can also use:

- `bundle-pilet`
- `build`
- `bundle`

## Positionals

### `source`

Sets the source index.tsx file for collecting all the information.

- Type: `string`
- Default: `./src/index`

## Flags

### `--target`

Sets the target file of bundling.

- Type: `string`
- Default: `"./dist/index.js"`

### `--detailed-report`

Sets if a detailed report should be created.

- Type: `boolean`
- Default: `false`

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

<!--end:auto-generated-->

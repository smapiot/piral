# `build-pilet`

Creates a production build for a pilet.

## Syntax

From the command line:

```sh
pb build-pilet [source]
```

Alternative:

```sh
pilet build [source]
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

### `--fresh`

Performs a fresh build by removing the target directory first.

- Type: `boolean`
- Default: `false`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

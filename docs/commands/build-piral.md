# `build-piral`

Creates a production build for a Piral instance.

## Syntax

From the command line:

```sh
pb build-piral [source]
```

Alternative:

```sh
piral build [source]
```

## Aliases

Instead of `build-piral` you can also use:

- `bundle-piral`
- `build-portal`
- `bundle-portal`

## Positionals

### `source`

Sets the source root directory or index.html file for collecting all the information.

- Type: `string`
- Default: `./`

## Flags

### `--target`

Sets the target directory or file of bundling.

- Type: `string`
- Default: `"./dist"`

### `--public-url`

Sets the public URL (path) of the bundle.

- Type: `string`
- Default: `"/"`

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

### `--type`

Selects the target type of the build. "all" builds all target types.

- Type: `string`
- Choices: `"all"`, `"release"`, `"develop"`
- Default: `"all"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

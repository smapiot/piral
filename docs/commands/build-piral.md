# `build-piral`

<!--start:auto-generated-->

Creates a production build for a Piral instance.

## Syntax

From the command line:

```sh
pb build-piral [source]
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

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

<!--end:auto-generated-->

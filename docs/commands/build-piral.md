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

Sets the source index.html file for collecting all the information.

- Type: `string`
- Default: `./src/index.html`

## Flags

### `--target`

Sets the target file of bundling.

- Type: `string`
- Default: `"./dist/index.html"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

<!--end:auto-generated-->

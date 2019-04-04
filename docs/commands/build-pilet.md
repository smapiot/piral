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

- Type: `string`undefined
- Default: `./src/index`

## Flags

### `--target`

Sets the target file of bundling.

- Type: `string`undefined
- Default: `"./dist/index.js"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`undefined
- Default: `process.cwd()`

<!--end:auto-generated-->

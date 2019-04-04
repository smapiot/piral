# `new-pilet`

<!--start:auto-generated-->

Scaffolds a new pilet for a specified Piral instance.

## Syntax

From the command line:

```sh
pb new-pilet [source]
```

## Aliases

Instead of `new-pilet` you can also use:

- `create-pilet`
- `new`
- `create`

## Positionals

### `source`

Sets the source package containing a Piral instance for templating the scaffold process.

- Type: `string`undefined
- Default: `piral`

## Flags

### `--target`

Sets the target directory for scaffolding. By default, the current directory.

- Type: `string`undefined
- Default: `"."`

### `--registry`

Sets the package registry to use for resolving the specified Piral app.

- Type: `string`undefined
- Default: `"https://registry.npmjs.org/"`

### `--force-overwrite`

Determines if files should be overwritten by the scaffolding.

- Type: `undefined`
- Allowed values: `0`, `1`, `2`, `no`, `prompt`, `yes`
- Default: `"no"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`undefined
- Default: `process.cwd()`

<!--end:auto-generated-->

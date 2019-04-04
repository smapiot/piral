# `upgrade-pilet`

<!--start:auto-generated-->

Upgrades an existing pilet to the latest version of the used Piral instance.

## Syntax

From the command line:

```sh
pb upgrade-pilet 
```

## Aliases

Instead of `upgrade-pilet` you can also use:

- `upgrade`

## Positionals

Not applicable.

## Flags

### `--target`

Sets the target directory to upgrade. By default, the current directory.

- Type: `string`undefined
- Default: `"."`

### `--version`

Sets the version of the Piral instance to upgrade to. By default, the latest version.

- Type: `string`undefined
- Default: `"latest"`

### `--force-overwrite`

Determines if files should be overwritten by the upgrading process.

- Type: `undefined`
- Allowed values: `0`, `1`, `2`, `no`, `prompt`, `yes`
- Default: `"no"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`undefined
- Default: `process.cwd()`

<!--end:auto-generated-->

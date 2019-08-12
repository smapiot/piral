# `upgrade-pilet`

Upgrades an existing pilet to the latest version of the used Piral instance.

## Syntax

From the command line:

```sh
pb upgrade-pilet 
```

Alternative:

```sh
pilet upgrade 
```

## Aliases

Instead of `upgrade-pilet` you can also use:

- `upgrade`

## Positionals

Not applicable.

## Flags

### `--target`

Sets the target directory to upgrade. By default, the current directory.

- Type: `string`
- Default: `"."`

### `--tag`

Sets the tag or version of the Piral instance to upgrade to. By default, it is "latest".

- Type: `string`
- Default: `"latest"`

### `--force-overwrite`

Determines if files should be overwritten by the upgrading process.

- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"no"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

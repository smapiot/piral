# `install-piral`

<!--start:auto-generated-->

Sets up a Piral instance by adding all files and changes to the current project.

## Syntax

From the command line:

```sh
pb install-piral [target]
```

## Aliases

Instead of `install-piral` you can also use:

- `add-piral`
- `integrate-piral`
- `setup-piral`

## Positionals

### `target`

Sets the project's root directory for making the changes.

- Type: `string`
- Default: `.`

## Flags

### `--app`

Sets the path to the app's source HTML file.

- Type: `string`
- Default: `"./src/index.html"`

### `--only-core`

Sets if piral-core should be used. Otherwise, piral is used.

- Type: `boolean`
- Default: `false`

### `--tag`

Sets the tag or version of the package to install. By default, it is "latest".

- Type: `string`
- Default: `"latest"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

<!--end:auto-generated-->

# `declaration-piral`

Creates the declaration file for a Piral instance.

## Syntax

From the command line:

```sh
pb declaration-piral [source]
```

Alternative:

```sh
piral declaration [source]
```

## Aliases

Instead of `declaration-piral` you can also use:

- `declare-piral`
- `declaration-portal`
- `declare-portal`

## Positionals

### `source`

Sets the source root directory or index.html file for collecting all the information.

- Type: `string`
- Default: `./`

## Flags

### `--target`

Sets the target directory for the generated .d.ts file.

- Type: `string`
- Default: `"./dist"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

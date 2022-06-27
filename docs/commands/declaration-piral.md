# `declaration-piral`

Creates the TypeScript declaration file (index.d.ts) for a Piral instance.

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

### `--log-level`

Sets the log level to use (1-5).


- Type: `number`
- Default: `3`

### `--force-overwrite`

Determines if files should be overwritten by the command.


- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"yes"`

### `--base`

Sets the base directory. By default the current directory is used.


- Type: `string`
- Default: `process.cwd()`

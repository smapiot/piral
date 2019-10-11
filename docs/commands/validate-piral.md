# `validate-piral`

Checks the validity of the current project as a Piral instance.

## Syntax

From the command line:

```sh
pb validate-piral [source]
```

Alternative:

```sh
piral validate [source]
```

## Aliases

Instead of `validate-piral` you can also use:

- `verify-piral`
- `check-piral`

## Positionals

### `source`

Sets the source root directory or index.html file for collecting all the information.

- Type: `string`
- Default: `./`

## Flags

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

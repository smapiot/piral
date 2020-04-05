# `upgrade-piral`

Upgrades the Piral instance to the latest version of the used Piral packages.

## Syntax

From the command line:

```sh
pb upgrade-piral [target-version]
```

Alternative:

```sh
piral upgrade [target-version]
```

## Aliases

Instead of `upgrade-piral` you can also use:

- `patch`

## Positionals

### `target-version`

Sets the tag or version of Piral to upgrade to. By default, it is "latest".

- Type: `string`
- Default: `latest`

## Flags

### `--target`

Sets the target directory to upgrade. By default, the current directory.

- Type: `string`
- Default: `"."`

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--install`

Already performs the update of its NPM dependencies.

- Type: `boolean`
- Default: `true`

### `--no-install`

Opposite of:
Already performs the update of its NPM dependencies.

- Type: `boolean`
- Default: `false`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

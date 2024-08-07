# `piral upgrade`

Upgrades the Piral instance to the latest version of the used Piral packages.

## Syntax

From the command line:

```sh
piral upgrade [target-version]
```

Alternative:

```sh
pb upgrade-piral [target-version]
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

Examples:

```sh
piral upgrade --target "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
piral upgrade --log-level 42
```

### `--install`

Already performs the update of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `true`

Examples:

```sh
piral upgrade --install
```

```sh
piral upgrade --no-install
```

### `--no-install`

Opposite of:
Already performs the update of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `false`

Examples:

```sh
piral upgrade --install
```

```sh
piral upgrade --no-install
```

### `--npm-client`

Sets the npm client to be used when upgrading.

- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"pnp"`, `"yarn"`, `"lerna"`, `"rush"`, `"bun"`
- Default: `undefined`

Examples:

```sh
piral upgrade --npm-client "npm"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
piral upgrade --base "some value"
```

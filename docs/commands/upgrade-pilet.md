# `pilet upgrade`

Upgrades an existing pilet to the latest version of the used Piral instance.

## Syntax

From the command line:

```sh
pilet upgrade [target-version]
```

Alternative:

```sh
pb upgrade-pilet [target-version]
```

## Aliases

Instead of `upgrade-pilet` you can also use:

- `upgrade`

## Positionals

### `target-version`

Sets the tag or version of the Piral instance to upgrade to. By default, it is "latest".

- Type: `string`
- Default: `undefined`

## Flags

### `--target`

Sets the target directory to upgrade. By default, the current directory.

- Type: `string`
- Default: `"."`

Examples:

```sh
pilet upgrade --target "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
pilet upgrade --log-level 42
```

### `--install`

Already performs the update of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet upgrade --install
```

```sh
pilet upgrade --no-install
```

### `--no-install`

Opposite of:
Already performs the update of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet upgrade --install
```

```sh
pilet upgrade --no-install
```

### `--force-overwrite`

Determines if files should be overwritten by the upgrading process.

- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"no"`

Examples:

```sh
pilet upgrade --force-overwrite "no"
```

### `--npm-client`

Sets the npm client to be used when upgrading.

- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"pnp"`, `"yarn"`, `"lerna"`, `"rush"`, `"bun"`
- Default: `undefined`

Examples:

```sh
pilet upgrade --npm-client "npm"
```

### `--vars`

Sets additional variables to be used when scaffolding.

- Type: `options`
- Default: `{}`

Examples:

```sh
pilet upgrade --vars.foo bar
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet upgrade --base "some value"
```

# `pilet remove-piral-instance`

Removes an existing Piral instance from the available apps hosting the current pilet.

## Syntax

From the command line:

```sh
pilet remove-piral-instance <app> [source]
```

Alternative:

```sh
pb remove-piral-instance-pilet <app> [source]
```

## Aliases

Instead of `remove-piral-instance-pilet` you can also use:

- `remove-shell-pilet`
- `uninstall-shell-pilet`
- `remove-app-pilet`
- `without-app-pilet`

## Positionals

### `app`

Sets the name of the Piral instance to be removed.

- Type: `string`
- Default: `undefined`

### `source`

Sets the source pilet path where the Piral instance should be removed.

- Type: `string`
- Default: `.`

## Flags

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
pilet remove-piral-instance --log-level 42
```

### `--npm-client`

Sets the npm client to be used for removing the Piral instance.

- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"pnp"`, `"yarn"`, `"lerna"`, `"rush"`, `"bun"`
- Default: `undefined`

Examples:

```sh
pilet remove-piral-instance --npm-client "npm"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet remove-piral-instance --base "some value"
```

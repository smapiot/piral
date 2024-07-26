# `pilet add-piral-instance`

Adds another Piral instance to the available apps hosting the current pilet.

## Syntax

From the command line:

```sh
pilet add-piral-instance <app> [source]
```

Alternative:

```sh
pb add-piral-instance-pilet <app> [source]
```

## Aliases

Instead of `add-piral-instance-pilet` you can also use:

- `add-shell-pilet`
- `install-shell-pilet`
- `add-app-pilet`
- `with-app-pilet`

## Positionals

### `app`

Sets the name of the Piral instance to be added.

- Type: `string`
- Default: `undefined`

### `source`

Sets the source pilet path where the Piral instance should be added.

- Type: `string`
- Default: `.`

## Flags

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
pilet add-piral-instance --log-level 42
```

### `--npm-client`

Sets the npm client to be used for adding the Piral instance.

- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"pnp"`, `"yarn"`, `"lerna"`, `"rush"`, `"bun"`
- Default: `undefined`

Examples:

```sh
pilet add-piral-instance --npm-client "npm"
```

### `--selected`

Defines if the provided Piral instance should be selected initially.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet add-piral-instance --selected
```

```sh
pilet add-piral-instance --no-selected
```

### `--no-selected`

Opposite of:
Defines if the provided Piral instance should be selected initially.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet add-piral-instance --selected
```

```sh
pilet add-piral-instance --no-selected
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet add-piral-instance --base "some value"
```

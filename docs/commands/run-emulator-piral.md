# `piral run-emulator`

Starts a Piral instance emulator.

## Syntax

From the command line:

```sh
piral run-emulator [source]
```

Alternative:

```sh
pb run-emulator-piral [source]
```

## Aliases

Instead of `run-emulator-piral` you can also use:

- `start-emulator-piral`
- `dev-emulator-portal`

## Positionals

### `source`

Sets the source Piral instance emulator package name.

- Type: `string`
- Default: `undefined`

## Flags

### `--port`

Sets the port of the local development server.

- Type: `number`
- Default: `1234`

Examples:

```sh
piral run-emulator --port 42
```

### `--strict-port`

Forces the defined port to be used or exists with an error.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral run-emulator --strict-port
```

```sh
piral run-emulator --no-strict-port
```

### `--no-strict-port`

Opposite of:
Forces the defined port to be used or exists with an error.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral run-emulator --strict-port
```

```sh
piral run-emulator --no-strict-port
```

### `--registry`

Sets the package registry to use for resolving the emulator.

- Aliases: `--package-registry`
- Type: `string`
- Default: `"https://registry.npmjs.org/"`

Examples:

```sh
piral run-emulator --registry "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
piral run-emulator --log-level 42
```

### `--npm-client`

Sets the npm client to be used when installing the emulator.

- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"pnp"`, `"yarn"`, `"lerna"`, `"rush"`, `"bun"`
- Default: `undefined`

Examples:

```sh
piral run-emulator --npm-client "npm"
```

### `--open`

Opens the Piral instance directly in the browser.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral run-emulator --open
```

```sh
piral run-emulator --no-open
```

### `--no-open`

Opposite of:
Opens the Piral instance directly in the browser.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral run-emulator --open
```

```sh
piral run-emulator --no-open
```

### `--feed`

Sets the URL of a pilet feed for including remote pilets.

- Type: `string`
- Default: `undefined`

Examples:

```sh
piral run-emulator --feed "some value"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
piral run-emulator --base "some value"
```

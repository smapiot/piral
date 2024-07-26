# `piral publish`

Publishes Piral instance build artifacts.

## Syntax

From the command line:

```sh
piral publish [source]
```

Alternative:

```sh
pb publish-piral [source]
```

## Aliases

Instead of `publish-piral` you can also use:

- `release-piral`
- `release`

## Positionals

### `source`

Sets the previously used output directory to publish.

- Type: `string`
- Default: `./dist`

## Flags

### `--url`

Sets the explicit URL where to publish the emulator to.

- Type: `string`
- Default: `undefined`

Examples:

```sh
piral publish --url "some value"
```

### `--api-key`

Sets the potential API key to send to the service.

- Type: `string`
- Default: `undefined`

Examples:

```sh
piral publish --api-key "some value"
```

### `--ca-cert`

Sets a custom certificate authority to use, if any.

- Type: `string`
- Default: `undefined`

Examples:

```sh
piral publish --ca-cert "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
piral publish --log-level 42
```

### `--fresh`

Performs a fresh build of the emulator website.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral publish --fresh
```

```sh
piral publish --no-fresh
```

### `--no-fresh`

Opposite of:
Performs a fresh build of the emulator website.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral publish --fresh
```

```sh
piral publish --no-fresh
```

### `--mode`

Sets the authorization mode to use.

- Aliases: `--auth-mode`
- Type: `string`
- Choices: `"none"`, `"basic"`, `"bearer"`, `"digest"`
- Default: `"basic"`

Examples:

```sh
piral publish --mode "none"
```

### `--bundler`

Sets the bundler to use.

- Type: `string`
- Choices: `"bun"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"rspack"`, `"webpack"`, `"webpack5"`, `"vite"`, `"vite5"`, `"xbuild"`
- Default: `undefined`

Examples:

```sh
piral publish --bundler "bun"
```

### `--headers`

Sets additional headers to be included in the feed service request.

- Type: `options`
- Default: `{}`

Examples:

```sh
piral publish --headers.foo bar
```

### `--interactive`

Defines if authorization tokens can be retrieved interactively.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral publish --interactive
```

```sh
piral publish --no-interactive
```

### `--no-interactive`

Opposite of:
Defines if authorization tokens can be retrieved interactively.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral publish --interactive
```

```sh
piral publish --no-interactive
```

### `--type`

Selects the target type of the publish.

- Type: `string`
- Choices: `"release"`, `"emulator"`
- Default: `"emulator"`

Examples:

```sh
piral publish --type "release"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
piral publish --base "some value"
```

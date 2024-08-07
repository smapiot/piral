# `pilet publish`

Publishes a pilet package to a pilet feed.

## Syntax

From the command line:

```sh
pilet publish [source]
```

Alternative:

```sh
pb publish-pilet [source]
```

## Aliases

Instead of `publish-pilet` you can also use:

- `post-pilet`
- `publish`

## Positionals

### `source`

Sets the source of either the previously packed *.tgz bundle or the pilet root module to publish.

- Type: `string`
- Default: `undefined`

## Flags

### `--url`

Sets the explicit URL where to publish the pilet to.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet publish --url "some value"
```

### `--api-key`

Sets the potential API key to send to the service.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet publish --api-key "some value"
```

### `--ca-cert`

Sets a custom certificate authority to use, if any.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet publish --ca-cert "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
pilet publish --log-level 42
```

### `--fresh`

Performs a fresh build, then packages and finally publishes the pilet.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet publish --fresh
```

```sh
pilet publish --no-fresh
```

### `--no-fresh`

Opposite of:
Performs a fresh build, then packages and finally publishes the pilet.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet publish --fresh
```

```sh
pilet publish --no-fresh
```

### `--schema`

Sets the schema to be used when making a fresh build of the pilet.

- Type: `string`
- Choices: `"v0"`, `"v1"`, `"v2"`, `"v3"`, `"mf"`, `"none"`
- Default: `undefined`

Examples:

```sh
pilet publish --schema "v0"
```

### `--mode`

Sets the authorization mode to use.

- Aliases: `--auth-mode`
- Type: `string`
- Choices: `"none"`, `"basic"`, `"bearer"`, `"digest"`
- Default: `"basic"`

Examples:

```sh
pilet publish --mode "none"
```

### `--bundler`

Sets the bundler to use.

- Type: `string`
- Choices: `"bun"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"rspack"`, `"webpack"`, `"webpack5"`, `"vite"`, `"vite5"`, `"xbuild"`
- Default: `undefined`

Examples:

```sh
pilet publish --bundler "bun"
```

### `--from`

Sets the type of the source to use for publishing.

- Type: `string`
- Choices: `"local"`, `"remote"`, `"npm"`
- Default: `"local"`

Examples:

```sh
pilet publish --from "local"
```

### `--fields`

Sets additional fields to be included in the feed service request.

- Type: `options`
- Default: `{}`

Examples:

```sh
pilet publish --fields.foo bar
```

### `--headers`

Sets additional headers to be included in the feed service request.

- Type: `options`
- Default: `{}`

Examples:

```sh
pilet publish --headers.foo bar
```

### `--interactive`

Defines if authorization tokens can be retrieved interactively.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet publish --interactive
```

```sh
pilet publish --no-interactive
```

### `--no-interactive`

Opposite of:
Defines if authorization tokens can be retrieved interactively.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet publish --interactive
```

```sh
pilet publish --no-interactive
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet publish --base "some value"
```

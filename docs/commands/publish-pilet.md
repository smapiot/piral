# `publish-pilet`

Publishes a pilet package to a pilet feed.

## Syntax

From the command line:

```sh
pb publish-pilet [source]
```

Alternative:

```sh
pilet publish [source]
```

## Aliases

Instead of `publish-pilet` you can also use:

- `post-pilet`
- `publish`

## Positionals

### `source`

Sets the source previously packed *.tgz bundle to publish.

- Type: `string`
- Default: `*.tgz`

## Flags

### `--url`

Sets the explicit URL where to publish the pilet to.

- Type: `string`
- Default: `""`
- **Caution: This flag is required!**

### `--api-key`

Sets the potential API key to send to the service.

- Type: `string`
- Default: `""`

### `--ca-cert`

Sets a custom certificate authority to use, if any.

- Type: `string`
- Default: `undefined`

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--fresh`

Performs a fresh build, then packages and finally publishes the pilet.

- Type: `boolean`
- Default: `false`

### `--no-fresh`

Opposite of:
Performs a fresh build, then packages and finally publishes the pilet.

- Type: `boolean`
- Default: `true`

### `--schema`

Sets the schema to be used when making a fresh build of the pilet.

- Type: `string`
- Choices: `"v0"`, `"v1"`
- Default: `"v1"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

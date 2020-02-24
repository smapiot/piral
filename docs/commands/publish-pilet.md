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

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

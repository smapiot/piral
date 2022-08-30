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

### `--api-key`

Sets the potential API key to send to the service.


- Type: `string`
- Default: `undefined`

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
- Choices: `"v0"`, `"v1"`, `"v2"`, `"none"`
- Default: `"v2"`

### `--mode`

Sets the authorization mode to use.

- Aliases: `--auth-mode`
- Type: `string`
- Choices: `"none"`, `"basic"`, `"bearer"`, `"digest"`
- Default: `"basic"`

### `--bundler`

Sets the bundler to use.


- Type: `string`
- Choices: ``
- Default: `undefined`

### `--from`

Sets the type of the source to use for publishing.


- Type: `string`
- Choices: `"local"`, `"remote"`, `"npm"`
- Default: `"local"`

### `--fields`

Sets additional fields to be included in the feed service request.


- Type: `options`
- Default: `{}`

### `--headers`

Sets additional headers to be included in the feed service request.


- Type: `options`
- Default: `{}`

### `--interactive`

Defines if authorization tokens can be retrieved interactively.


- Type: `boolean`
- Default: `false`

### `--no-interactive`

Opposite of:
Defines if authorization tokens can be retrieved interactively.


- Type: `boolean`
- Default: `true`

### `--base`

Sets the base directory. By default the current directory is used.


- Type: `string`
- Default: `process.cwd()`

# `publish-piral`

Publishes Piral instance build artifacts.

## Syntax

From the command line:

```sh
pb publish-piral [source]
```

Alternative:

```sh
piral publish [source]
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

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--type`

Selects the target type to publish. "all" publishes all target types.

- Type: `string`
- Choices: `"all"`, `"release"`, `"emulator"`, `"emulator-sources"`
- Default: `"all"`

### `--provider`

Sets the provider for publishing the release assets.

- Type: `string`
- Choices: `"none"`, `"xcopy"`
- Default: `"none"`

### `--fields`

Sets additional fields to be included in the feed service request.

- Type: `options`
- Default: `{}`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

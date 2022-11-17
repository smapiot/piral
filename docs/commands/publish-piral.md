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
- Choices: `"none"`, `"xcopy"`, `"feed"`
- Default: `"none"`

### `--opts`

Sets the options to forward to the chosen provider.


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

# `pilet pack`

Creates a pilet package that can be published.

## Syntax

From the command line:

```sh
pilet pack [source]
```

Alternative:

```sh
pb pack-pilet [source]
```

## Aliases

Instead of `pack-pilet` you can also use:

- `package-pilet`
- `pack`
- `package`

## Positionals

### `source`

Sets the source pilet path for creating the package.


- Type: `string`
- Default: `.`

## Flags

### `--target`

Sets the target directory or file of packing.


- Type: `string`
- Default: `"."`

### `--log-level`

Sets the log level to use (1-5).


- Type: `number`
- Default: `3`

### `--base`

Sets the base directory. By default the current directory is used.


- Type: `string`
- Default: `process.cwd()`

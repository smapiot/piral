# `pilet declaration`

Creates the TypeScript declaration file (index.d.ts) for a pilet.

## Syntax

From the command line:

```sh
pilet declaration [source]
```

Alternative:

```sh
pb declaration-pilet [source]
```

## Aliases

Instead of `declaration-pilet` you can also use:

- `declare-pilet`

## Positionals

### `source`

Sets the source pilet path for collecting all the information.

- Type: `string`
- Default: `./`

## Flags

### `--target`

Sets the target directory for the generated .d.ts file.

- Type: `string`
- Default: `"./dist"`

Examples:

```sh
pilet declaration --target "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
pilet declaration --log-level 42
```

### `--force-overwrite`

Determines if files should be overwritten by the command.

- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"yes"`

Examples:

```sh
pilet declaration --force-overwrite "no"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet declaration --base "some value"
```

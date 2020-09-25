# `validate-pilet`

Checks the validity of the current pilet according to the rules defined by the Piral instance.

## Syntax

From the command line:

```sh
pb validate-pilet [source]
```

Alternative:

```sh
pilet validate [source]
```

## Aliases

Instead of `validate-pilet` you can also use:

- `verify-pilet`
- `check-pilet`
- `lint-pilet`
- `assert-pilet`

## Positionals

### `source`

Sets the source file containing the pilet root module.

- Type: `string`
- Default: `./src/index`

## Flags

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--app`

Sets the name of the Piral instance.

- Type: `string`
- Default: `undefined`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

## Validators

### `has-externals-as-peers`

Checks that "externals" dependencies have been specified in "peerDependencies".

**Options**: `'ignore' | 'active' | 'only-used'`

### `has-no-self-reference`

Checks if the used Piral instance is not referenced in the code.

**Options**: `'ignore' | 'active'`

### `has-no-third-party-dependency`

Checks that no other (third-party) dependencies are bundled in.

**Options**: `'ignore' | 'active'`

### `stays-small`

Checks if the main bundle of the pilet is not exceeding a given threshold.

**Options**: `number`

### `uses-latest-piral`

Checks if the used Piral instance is used at its latest version.

**Options**: `'suggest' | 'required' | 'ignore'`


# `pilet validate`

Checks the validity of the current pilet according to the rules defined by the Piral instance.

## Syntax

From the command line:

```sh
pilet validate [source]
```

Alternative:

```sh
pb validate-pilet [source]
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

Examples:

```sh
pilet validate --log-level 42
```

### `--app`

Sets the name of the Piral instance.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet validate --app "some value"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet validate --base "some value"
```

## Validators

### `has-externals-as-peers`

Checks that "externals" dependencies have been specified in "peerDependencies". This is legacy and only used if no importmap has been specified. Importmap inherited dependencies are auto-checked.

**Options**: `'ignore' | 'active' | 'only-used'`

### `has-no-self-reference`

Checks if the used Piral instance is not referenced in the code.

**Options**: `'ignore' | 'active'`

### `has-no-third-party-dependency`

Checks that no other (third-party) dependencies are bundled in.

**Options**: `'ignore' | 'active'`

### `has-non-conflicting-css`

Checks if a pilet might cause a CSS conflict. A score of 100 means that there is the least chance of a CSS conflict, while a score of 0 means that a CSS conflict is most likely. Negative values yield a warning if the CSS score is below the given number. Positive values yield an error if the CSS score is below the given number. A value of 0 turns this validation off. By default, a pilet's stylesheet having a CSS score of below 50 will result in a warning.

**Options**: `number`

### `stays-small`

Checks if the main bundle of the pilet is not exceeding a given threshold. The pilet must have been built beforehand for this validation to be conclusive. Negative values yield a warning if the absolute size in kB is exceeded. Positive values yield an error if the absolute size in kB is exceeded. A value of 0 turns this validation off. By default, a pilet's main bundle exceeding 50 kB will result in a warning.

**Options**: `number`

### `uses-latest-piral`

Checks if the used Piral instance is used at its latest version.

**Options**: `'suggest' | 'required' | 'ignore'`


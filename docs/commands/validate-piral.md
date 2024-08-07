# `piral validate`

Checks the validity of the current project as a Piral instance.

## Syntax

From the command line:

```sh
piral validate [source]
```

Alternative:

```sh
pb validate-piral [source]
```

## Aliases

Instead of `validate-piral` you can also use:

- `verify-piral`
- `check-piral`

## Positionals

### `source`

Sets the source Piral instance path for collecting all the information.

- Type: `string`
- Default: `./`

## Flags

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
piral validate --log-level 42
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
piral validate --base "some value"
```

## Validators

### `depends-on-piral`

Checks that the Piral instance depends either on `piral` or `piral-core` or `piral-base`.

**Options**: `<none>`

### `entry-ends-with-html`

Checks that the app field is valid and points to an existing HTML file.

**Options**: `<none>`

### `has-valid-devDependencies`

Checks that devDependencies declared for pilet scaffolding are valid.

**Options**: `<none>`

### `has-valid-externals`

Checks that the externals to be used in pilets are valid.

**Options**: `<none>`

### `has-valid-files`

Checks that the files defined for pilet scaffolding are valid.

**Options**: `<none>`

### `has-valid-scripts`

Checks that the scripts defined for pilets are valid.

**Options**: `<none>`


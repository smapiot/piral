# `new-piral`

Creates a new Piral instance by adding all files and changes to the current project.

## Syntax

From the command line:

```sh
pb new-piral [target]
```

Alternative:

```sh
piral new [target]
```

## Aliases

Instead of `new-piral` you can also use:

- `create-piral`
- `scaffold-piral`
- `setup-piral`

## Positionals

### `target`

Sets the project's root directory for making the changes.

- Type: `string`
- Default: `.`

## Flags

### `--app`

Sets the path to the app's source HTML file.

- Type: `string`
- Default: `"./src/index.html"`

### `--framework`

Sets the framework/library level to use.

- Type: `string`
- Choices: `"piral"`, `"piral-core"`, `"piral-base"`
- Default: `"piral"`

### `--install`

Already performs the installation of its NPM dependencies.

- Type: `boolean`
- Default: `true`

### `--no-install`

Opposite of:
Already performs the installation of its NPM dependencies.

- Type: `boolean`
- Default: `false`

### `--tag`

Sets the tag or version of the package to install. By default, it is "latest".

- Type: `string`
- Default: `"latest"`

### `--force-overwrite`

Determines if files should be overwritten by the installation.

- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"no"`

### `--language`

Determines the programming language for the new Piral instance.

- Type: `string`
- Choices: `"ts"`, `"js"`
- Default: `"ts"`

### `--template`

Sets the boilerplate template to be used when scaffolding.

- Type: `string`
- Choices: `"default"`, `"empty"`
- Default: `"default"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

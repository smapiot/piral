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

### `--registry`

Sets the package registry to use for resolving the dependencies.

- Type: `string`
- Default: `"https://registry.npmjs.org/"`

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--tag`

Sets the tag or version of the package to install. By default, this uses the version of the CLI.

- Type: `string`
- Default: `"0.13.9"`

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

Sets the boilerplate template package to be used when scaffolding.

- Type: `string`
- Default: `"default"`

### `--npm-client`

Sets the NPM client to be used when scaffolding.

- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"yarn"`
- Default: `undefined`

### `--bundler`

Sets the default bundler to install.

- Type: `string`
- Choices: `"none"`, `"parcel"`, `"webpack"`, `"webpack5"`, `"esbuild"`
- Default: `"none"`

### `--vars`

Sets additional variables to be used when scaffolding.

- Type: `options`
- Default: `{}`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

# `piral new`

Creates a new Piral instance by adding all files and changes to the current project.

## Syntax

From the command line:

```sh
piral new [target]
```

Alternative:

```sh
pb new-piral [target]
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

Examples:

```sh
piral new --app "some value"
```

### `--framework`

Sets the framework/library level to use.

- Type: `string`
- Choices: `"piral"`, `"piral-core"`, `"piral-base"`
- Default: `"piral"`

Examples:

```sh
piral new --framework "piral"
```

### `--install`

Already performs the installation of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `true`

Examples:

```sh
piral new --install
```

```sh
piral new --no-install
```

### `--no-install`

Opposite of:
Already performs the installation of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `false`

Examples:

```sh
piral new --install
```

```sh
piral new --no-install
```

### `--registry`

Sets the package registry to use for resolving the dependencies.

- Aliases: `--package-registry`
- Type: `string`
- Default: `"https://registry.npmjs.org/"`

Examples:

```sh
piral new --registry "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
piral new --log-level 42
```

### `--tag`

Sets the tag or version of the package to install. By default, this uses the version of the CLI.

- Aliases: `--piral-version`
- Type: `string`
- Default: `"1.6.0"`

Examples:

```sh
piral new --tag "some value"
```

### `--force-overwrite`

Determines if files should be overwritten by the installation.

- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"no"`

Examples:

```sh
piral new --force-overwrite "no"
```

### `--language`

Determines the programming language for the new Piral instance.

- Type: `string`
- Choices: `"ts"`, `"js"`
- Default: `"ts"`

Examples:

```sh
piral new --language "ts"
```

### `--template`

Sets the boilerplate template package to be used when scaffolding.

- Type: `string`
- Default: `"default"`

Examples:

```sh
piral new --template "some value"
```

### `--npm-client`

Sets the npm client to be used when scaffolding.

- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"pnp"`, `"yarn"`, `"lerna"`, `"rush"`, `"bun"`
- Default: `undefined`

Examples:

```sh
piral new --npm-client "npm"
```

### `--bundler`

Sets the default bundler to install.

- Type: `string`
- Choices: `"bun"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"rspack"`, `"webpack"`, `"webpack5"`, `"vite"`, `"vite5"`, `"xbuild"`
- Default: `"none"`

Examples:

```sh
piral new --bundler "bun"
```

### `--vars`

Sets additional variables to be used when scaffolding.

- Type: `options`
- Default: `{}`

Examples:

```sh
piral new --vars.foo bar
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
piral new --base "some value"
```

### `--name`

Sets the name for the new Piral app.

- Type: `string`
- Default: `undefined`

Examples:

```sh
piral new --name "some value"
```

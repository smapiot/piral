# `pilet new`

Scaffolds a new pilet for a specified Piral instance.

## Syntax

From the command line:

```sh
pilet new [source]
```

Alternative:

```sh
pb new-pilet [source]
```

## Aliases

Instead of `new-pilet` you can also use:

- `create-pilet`
- `scaffold-pilet`
- `scaffold`
- `new`
- `create`

## Positionals

### `source`

Sets the source package (potentially incl. its tag/version) containing a Piral instance for templating the scaffold process.

- Type: `string`
- Default: `undefined`

## Flags

### `--target`

Sets the target directory for scaffolding. By default, the current directory.

- Type: `string`
- Default: `"."`

Examples:

```sh
pilet new --target "some value"
```

### `--registry`

Sets the package registry to use for resolving the specified Piral app.

- Aliases: `--package-registry`
- Type: `string`
- Default: `"https://registry.npmjs.org/"`

Examples:

```sh
pilet new --registry "some value"
```

### `--install`

Already performs the installation of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet new --install
```

```sh
pilet new --no-install
```

### `--no-install`

Opposite of:
Already performs the installation of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet new --install
```

```sh
pilet new --no-install
```

### `--force-overwrite`

Determines if files should be overwritten by the scaffolding.

- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"no"`

Examples:

```sh
pilet new --force-overwrite "no"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
pilet new --log-level 42
```

### `--language`

Determines the programming language for the new pilet.

- Type: `string`
- Choices: `"ts"`, `"js"`
- Default: `"ts"`

Examples:

```sh
pilet new --language "ts"
```

### `--template`

Sets the boilerplate template package to be used when scaffolding.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet new --template "some value"
```

### `--npm-client`

Sets the npm client to be used when scaffolding.

- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"pnp"`, `"yarn"`, `"lerna"`, `"rush"`, `"bun"`
- Default: `undefined`

Examples:

```sh
pilet new --npm-client "npm"
```

### `--bundler`

Sets the default bundler to install.

- Type: `string`
- Choices: `"bun"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"rspack"`, `"webpack"`, `"webpack5"`, `"vite"`, `"vite5"`, `"xbuild"`
- Default: `"none"`

Examples:

```sh
pilet new --bundler "bun"
```

### `--vars`

Sets additional variables to be used when scaffolding.

- Type: `options`
- Default: `{}`

Examples:

```sh
pilet new --vars.foo bar
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet new --base "some value"
```

### `--name`

Sets the name for the new Pilet.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet new --name "some value"
```

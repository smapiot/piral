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
- Default: `piral`

## Flags

### `--target`

Sets the target directory for scaffolding. By default, the current directory.


- Type: `string`
- Default: `"."`

### `--registry`

Sets the package registry to use for resolving the specified Piral app.

- Aliases: `--package-registry`
- Type: `string`
- Default: `"https://registry.npmjs.org/"`

### `--install`

Already performs the installation of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `true`

### `--no-install`

Opposite of:
Already performs the installation of its npm dependencies.

- Aliases: `--package-install`
- Type: `boolean`
- Default: `false`

### `--force-overwrite`

Determines if files should be overwritten by the scaffolding.


- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"no"`

### `--log-level`

Sets the log level to use (1-5).


- Type: `number`
- Default: `3`

### `--language`

Determines the programming language for the new pilet.


- Type: `string`
- Choices: `"ts"`, `"js"`
- Default: `"ts"`

### `--template`

Sets the boilerplate template package to be used when scaffolding.


- Type: `string`
- Default: `undefined`

### `--npm-client`

Sets the npm client to be used when scaffolding.


- Type: `string`
- Choices: `"npm"`, `"pnpm"`, `"pnp"`, `"yarn"`, `"lerna"`, `"rush"`
- Default: `undefined`

### `--bundler`

Sets the default bundler to install.


- Type: `string`
- Choices: `"none"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"webpack"`, `"webpack5"`, `"vite"`, `"xbuild"`
- Default: `"none"`

### `--vars`

Sets additional variables to be used when scaffolding.


- Type: `options`
- Default: `{}`

### `--base`

Sets the base directory. By default the current directory is used.


- Type: `string`
- Default: `process.cwd()`

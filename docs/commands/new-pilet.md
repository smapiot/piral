# `new-pilet`

Scaffolds a new pilet for a specified Piral instance.

## Syntax

From the command line:

```sh
pb new-pilet [source]
```

Alternative:

```sh
pilet new [source]
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

Sets the source package containing a Piral instance for templating the scaffold process.

- Type: `string`
- Default: `piral`

## Flags

### `--target`

Sets the target directory for scaffolding. By default, the current directory.

- Type: `string`
- Default: `"."`

### `--registry`

Sets the package registry to use for resolving the specified Piral app.

- Type: `string`
- Default: `"https://registry.npmjs.org/"`

### `--skip-install`

Skips the installation of the dependencies using NPM.

- Type: `boolean`
- Default: `false`

### `--force-overwrite`

Determines if files should be overwritten by the scaffolding.

- Type: `string`
- Choices: `"no"`, `"prompt"`, `"yes"`
- Default: `"no"`

### `--language`

Determines the programming language for the new pilet.

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

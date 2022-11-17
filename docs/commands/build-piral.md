# `piral build`

Creates a production build for a Piral instance.

## Syntax

From the command line:

```sh
piral build [source]
```

Alternative:

```sh
pb build-piral [source]
```

## Aliases

Instead of `build-piral` you can also use:

- `bundle-piral`
- `build-portal`
- `bundle-portal`

## Positionals

### `source`

Sets the source root directory or index.html file for collecting all the information.


- Type: `string`
- Default: `./`

## Flags

### `--target`

Sets the target directory or file of bundling.


- Type: `string`
- Default: `"./dist"`

### `--public-url`

Sets the public URL (path) of the bundle. Only for release output.


- Type: `string`
- Default: `"/"`

### `--log-level`

Sets the log level to use (1-5).


- Type: `number`
- Default: `3`

### `--fresh`

Performs a fresh build by removing the target directory first.


- Type: `boolean`
- Default: `false`

### `--no-fresh`

Opposite of:
Performs a fresh build by removing the target directory first.


- Type: `boolean`
- Default: `true`

### `--minify`

Performs minification or other post-bundle transformations.


- Type: `boolean`
- Default: `true`

### `--no-minify`

Opposite of:
Performs minification or other post-bundle transformations.


- Type: `boolean`
- Default: `false`

### `--source-maps`

Create associated source maps for the bundles.


- Type: `boolean`
- Default: `true`

### `--no-source-maps`

Opposite of:
Create associated source maps for the bundles.


- Type: `boolean`
- Default: `false`

### `--subdir`

Places the build's output in an appropriate subdirectory (e.g., "emulator"). Ignored for "--all".


- Type: `boolean`
- Default: `true`

### `--no-subdir`

Opposite of:
Places the build's output in an appropriate subdirectory (e.g., "emulator"). Ignored for "--all".


- Type: `boolean`
- Default: `false`

### `--content-hash`

Appends the hash to the side-bundle files.


- Type: `boolean`
- Default: `true`

### `--no-content-hash`

Opposite of:
Appends the hash to the side-bundle files.


- Type: `boolean`
- Default: `false`

### `--optimize-modules`

Also includes the node modules for target transpilation.


- Type: `boolean`
- Default: `false`

### `--no-optimize-modules`

Opposite of:
Also includes the node modules for target transpilation.


- Type: `boolean`
- Default: `true`

### `--type`

Selects the target type of the build. "all" builds all target types.


- Type: `string`
- Choices: `"all"`, `"release"`, `"emulator"`, `"emulator-sources"`
- Default: `"all"`

### `--bundler`

Sets the bundler to use.


- Type: `string`
- Choices: ``
- Default: `undefined`

### `--base`

Sets the base directory. By default the current directory is used.


- Type: `string`
- Default: `process.cwd()`

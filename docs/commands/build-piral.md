# `build-piral`

Creates a production build for a Piral instance.

## Syntax

From the command line:

```sh
pb build-piral [source]
```

Alternative:

```sh
piral build [source]
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

### `--cache-dir`

Sets the cache directory for bundling.

- Type: `string`
- Default: `".cache"`

### `--public-url`

Sets the public URL (path) of the bundle.

- Type: `string`
- Default: `"/"`

### `--detailed-report`

Sets if a detailed report should be created.

- Type: `boolean`
- Default: `false`

### `--no-detailed-report`

Opposite of:
Sets if a detailed report should be created.

- Type: `boolean`
- Default: `true`

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

### `--content-hash`

Appends the hash to the side-bundle files.

- Type: `boolean`
- Default: `true`

### `--no-content-hash`

Opposite of:
Appends the hash to the side-bundle files.

- Type: `boolean`
- Default: `false`

### `--scope-hoist`

Tries to reduce bundle size by introducing tree shaking.

- Type: `boolean`
- Default: `false`

### `--no-scope-hoist`

Opposite of:
Tries to reduce bundle size by introducing tree shaking.

- Type: `boolean`
- Default: `true`

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
- Choices: `"all"`, `"release"`, `"develop"`
- Default: `"all"`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

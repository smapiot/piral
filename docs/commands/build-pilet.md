# `build-pilet`

Creates a production build for a pilet.

## Syntax

From the command line:

```sh
pb build-pilet [source]
```

Alternative:

```sh
pilet build [source]
```

## Aliases

Instead of `build-pilet` you can also use:

- `bundle-pilet`
- `build`
- `bundle`

## Positionals

### `source`

Sets the source index.tsx file for collecting all the information.

- Type: `string`
- Default: `./src/index`

## Flags

### `--target`

Sets the target file of bundling.

- Type: `string`
- Default: `"./dist/index.js"`

### `--cache-dir`

Sets the cache directory for bundling.

- Type: `string`
- Default: `".cache"`

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

Creates source maps for the bundles.

- Type: `boolean`
- Default: `true`

### `--no-source-maps`

Opposite of:
Creates source maps for the bundles.

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

### `--app`

Sets the name of the Piral instance.

- Type: `string`
- Default: `undefined`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

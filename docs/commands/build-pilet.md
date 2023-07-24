# `pilet build`

Creates a production build for a pilet.

## Syntax

From the command line:

```sh
pilet build [source]
```

Alternative:

```sh
pb build-pilet [source]
```

## Aliases

Instead of `build-pilet` you can also use:

- `bundle-pilet`
- `build`
- `bundle`

## Positionals

### `source`

Sets the source pilet path for collecting all the information.


- Type: `string`
- Default: `./src/index`

## Flags

### `--target`

Sets the target file of bundling.


- Type: `string`
- Default: `"./dist/index.js"`

### `--public-url`

Sets the public URL (path) of the application.


- Type: `string`
- Default: `"/"`

### `--log-level`

Sets the log level to use (1-5).


- Type: `number`
- Default: `3`

### `--concurrency`

Sets the maximum number of concurrent build jobs.


- Type: `number`
- Default: `12`

### `--source-maps`

Creates source maps for the bundles.


- Type: `boolean`
- Default: `true`

### `--no-source-maps`

Opposite of:
Creates source maps for the bundles.


- Type: `boolean`
- Default: `false`

### `--watch`

Continuously re-builds while watching the source files.


- Type: `boolean`
- Default: `false`

### `--no-watch`

Opposite of:
Continuously re-builds while watching the source files.


- Type: `boolean`
- Default: `true`

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

### `--declaration`

Creates a declaration file for the pilet.


- Type: `boolean`
- Default: `true`

### `--no-declaration`

Opposite of:
Creates a declaration file for the pilet.


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

### `--schema`

Sets the schema to be used when bundling the pilets.


- Type: `string`
- Choices: `"v0"`, `"v1"`, `"v2"`, `"none"`
- Default: `undefined`

### `--bundler`

Sets the bundler to use.


- Type: `string`
- Choices: ``
- Default: `undefined`

### `--type`

Selects the target type of the build.


- Type: `string`
- Choices: `"default"`, `"standalone"`, `"manifest"`
- Default: `"default"`

### `--app`

Sets the name of the Piral instance.


- Type: `string`
- Default: `undefined`

### `--base`

Sets the base directory. By default the current directory is used.


- Type: `string`
- Default: `process.cwd()`

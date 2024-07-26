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

Examples:

```sh
pilet build --target "some value"
```

### `--public-url`

Sets the public URL (path) of the application.

- Type: `string`
- Default: `"/"`

Examples:

```sh
pilet build --public-url "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
pilet build --log-level 42
```

### `--concurrency`

Sets the maximum number of concurrent build jobs.

- Type: `number`
- Default: `16`

Examples:

```sh
pilet build --concurrency 42
```

### `--source-maps`

Creates source maps for the bundles.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet build --source-maps
```

```sh
pilet build --no-source-maps
```

### `--no-source-maps`

Opposite of:
Creates source maps for the bundles.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet build --source-maps
```

```sh
pilet build --no-source-maps
```

### `--watch`

Continuously re-builds while watching the source files.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet build --watch
```

```sh
pilet build --no-watch
```

### `--no-watch`

Opposite of:
Continuously re-builds while watching the source files.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet build --watch
```

```sh
pilet build --no-watch
```

### `--fresh`

Performs a fresh build by removing the target directory first.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet build --fresh
```

```sh
pilet build --no-fresh
```

### `--no-fresh`

Opposite of:
Performs a fresh build by removing the target directory first.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet build --fresh
```

```sh
pilet build --no-fresh
```

### `--minify`

Performs minification or other post-bundle transformations.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet build --minify
```

```sh
pilet build --no-minify
```

### `--no-minify`

Opposite of:
Performs minification or other post-bundle transformations.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet build --minify
```

```sh
pilet build --no-minify
```

### `--declaration`

Creates a declaration file for the pilet.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet build --declaration
```

```sh
pilet build --no-declaration
```

### `--no-declaration`

Opposite of:
Creates a declaration file for the pilet.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet build --declaration
```

```sh
pilet build --no-declaration
```

### `--content-hash`

Appends the hash to the side-bundle files.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet build --content-hash
```

```sh
pilet build --no-content-hash
```

### `--no-content-hash`

Opposite of:
Appends the hash to the side-bundle files.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet build --content-hash
```

```sh
pilet build --no-content-hash
```

### `--optimize-modules`

Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `false`

Examples:

```sh
pilet build --optimize-modules
```

```sh
pilet build --no-optimize-modules
```

### `--no-optimize-modules`

Opposite of:
Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `true`

Examples:

```sh
pilet build --optimize-modules
```

```sh
pilet build --no-optimize-modules
```

### `--schema`

Sets the schema to be used when bundling the pilets.

- Type: `string`
- Choices: `"v0"`, `"v1"`, `"v2"`, `"v3"`, `"mf"`, `"none"`
- Default: `undefined`

Examples:

```sh
pilet build --schema "v0"
```

### `--bundler`

Sets the bundler to use.

- Type: `string`
- Choices: `"bun"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"rspack"`, `"webpack"`, `"webpack5"`, `"vite"`, `"vite5"`, `"xbuild"`
- Default: `undefined`

Examples:

```sh
pilet build --bundler "bun"
```

### `--type`

Selects the target type of the build.

- Type: `string`
- Choices: `"default"`, `"standalone"`, `"manifest"`
- Default: `"default"`

Examples:

```sh
pilet build --type "default"
```

### `--app`

Sets the name of the Piral instance.

- Type: `string`
- Default: `undefined`

Examples:

```sh
pilet build --app "some value"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
pilet build --base "some value"
```

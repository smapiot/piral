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

Sets the source Piral instance path for collecting all the information.

- Type: `string`
- Default: `./`

## Flags

### `--target`

Sets the target directory or file of bundling.

- Type: `string`
- Default: `"./dist"`

Examples:

```sh
piral build --target "some value"
```

### `--public-url`

Sets the public URL (path) of the bundle. Only for release output.

- Type: `string`
- Default: `"/"`

Examples:

```sh
piral build --public-url "some value"
```

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

Examples:

```sh
piral build --log-level 42
```

### `--fresh`

Performs a fresh build by removing the target directory first.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral build --fresh
```

```sh
piral build --no-fresh
```

### `--no-fresh`

Opposite of:
Performs a fresh build by removing the target directory first.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral build --fresh
```

```sh
piral build --no-fresh
```

### `--minify`

Performs minification or other post-bundle transformations.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral build --minify
```

```sh
piral build --no-minify
```

### `--no-minify`

Opposite of:
Performs minification or other post-bundle transformations.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral build --minify
```

```sh
piral build --no-minify
```

### `--source-maps`

Create associated source maps for the bundles.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral build --source-maps
```

```sh
piral build --no-source-maps
```

### `--no-source-maps`

Opposite of:
Create associated source maps for the bundles.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral build --source-maps
```

```sh
piral build --no-source-maps
```

### `--watch`

Continuously re-builds while watching the source files.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral build --watch
```

```sh
piral build --no-watch
```

### `--no-watch`

Opposite of:
Continuously re-builds while watching the source files.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral build --watch
```

```sh
piral build --no-watch
```

### `--subdir`

Places the build's output in an appropriate subdirectory (e.g., "emulator"). Ignored for "--all".

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral build --subdir
```

```sh
piral build --no-subdir
```

### `--no-subdir`

Opposite of:
Places the build's output in an appropriate subdirectory (e.g., "emulator"). Ignored for "--all".

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral build --subdir
```

```sh
piral build --no-subdir
```

### `--content-hash`

Appends the hash to the side-bundle files.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral build --content-hash
```

```sh
piral build --no-content-hash
```

### `--no-content-hash`

Opposite of:
Appends the hash to the side-bundle files.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral build --content-hash
```

```sh
piral build --no-content-hash
```

### `--optimize-modules`

Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `false`

Examples:

```sh
piral build --optimize-modules
```

```sh
piral build --no-optimize-modules
```

### `--no-optimize-modules`

Opposite of:
Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `true`

Examples:

```sh
piral build --optimize-modules
```

```sh
piral build --no-optimize-modules
```

### `--type`

Selects the target type of the build. "all" builds all target types.

- Type: `string`
- Choices: `"all"`, `"release"`, `"emulator"`, `"emulator-package"`, `"emulator-sources"`, `"emulator-website"`
- Default: `"all"`

Examples:

```sh
piral build --type "all"
```

### `--bundler`

Sets the bundler to use.

- Type: `string`
- Choices: `"bun"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"rollup"`, `"rspack"`, `"webpack"`, `"webpack5"`, `"vite"`, `"vite5"`, `"xbuild"`
- Default: `undefined`

Examples:

```sh
piral build --bundler "bun"
```

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

Examples:

```sh
piral build --base "some value"
```

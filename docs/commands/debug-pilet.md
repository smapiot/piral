# `debug-pilet`

Starts the debugging process for a pilet using a Piral instance.

## Syntax

From the command line:

```sh
pb debug-pilet [source..]
```

Alternative:

```sh
pilet debug [source..]
```

## Aliases

Instead of `debug-pilet` you can also use:

- `watch-pilet`
- `debug`
- `watch`

## Positionals

### `source`

Sets the source file containing the pilet root module.

- Type: `string`
- Default: `./src/index`

## Flags

### `--port`

Sets the port of the local development server.

- Type: `number`
- Default: `1234`

### `--cache-dir`

Sets the cache directory for bundling.

- Type: `string`
- Default: `".cache"`

### `--log-level`

Sets the log level to use (1-5).

- Type: `number`
- Default: `3`

### `--fresh`

Resets the cache before starting the debug mode.

- Type: `boolean`
- Default: `false`

### `--no-fresh`

Opposite of:
Resets the cache before starting the debug mode.

- Type: `boolean`
- Default: `true`

### `--open`

Opens the pilet directly in the browser.

- Type: `boolean`
- Default: `false`

### `--no-open`

Opposite of:
Opens the pilet directly in the browser.

- Type: `boolean`
- Default: `true`

### `--scope-hoist`

Tries to reduce bundle size by introducing tree shaking.

- Type: `boolean`
- Default: `false`

### `--no-scope-hoist`

Opposite of:
Tries to reduce bundle size by introducing tree shaking.

- Type: `boolean`
- Default: `true`

### `--hmr`

Activates Hot Module Reloading (HMR).

- Type: `boolean`
- Default: `true`

### `--no-hmr`

Opposite of:
Activates Hot Module Reloading (HMR).

- Type: `boolean`
- Default: `false`

### `--autoinstall`

Automatically installs missing Node.js packages.

- Type: `boolean`
- Default: `true`

### `--no-autoinstall`

Opposite of:
Automatically installs missing Node.js packages.

- Type: `boolean`
- Default: `false`

### `--optimize-modules`

Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `true`

### `--no-optimize-modules`

Opposite of:
Also includes the node modules for target transpilation.

- Type: `boolean`
- Default: `false`

### `--schema`

Sets the schema to be used when bundling the pilets.

- Type: `string`
- Choices: `"v0"`, `"v1"`
- Default: `"v1"`

### `--app`

Sets the name of the Piral instance.

- Type: `string`
- Default: `undefined`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

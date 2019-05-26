# `publish-pilet`

<!--start:auto-generated-->

Publishes a pilet package to a pilet feed.

## Syntax

From the command line:

```sh
pb publish-pilet [source]
```

## Aliases

Instead of `publish-pilet` you can also use:

- `post-pilet`
- `publish`

## Positionals

### `source`

Sets the source previously packed *.tgz bundle to publish.

- Type: `string`
- Default: `*.tgz`

## Flags

### `--url`

Sets the explicit URL where to publish the pilet to.

- Type: `string`
- Default: `"https://sample.piral.io/api/v1/pilet"`

### `--api-key`

Sets the potential API key to send to the service.

- Type: `string`
- Default: `""`

### `--base`

Sets the base directory. By default the current directory is used.

- Type: `string`
- Default: `process.cwd()`

<!--end:auto-generated-->

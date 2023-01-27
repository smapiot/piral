[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Publish Microfrontend](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/publish-microfrontend.svg?style=flat)](https://www.npmjs.com/package/publish-microfrontend) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

A simple command-line utility for publishing micro frontends to compatible feed services.

## Usage

You can publish any micro frontend using this tool using

```sh
npx publish-microfrontend --url <feed-url> --api-key <feed-api-key>
```

By default, this will take the current folder, pack it, and push it to a server. This server could also be configured in a `.microfrontendrc` file such as

```json
{
  "url": "https://myfeed.com/api/v1/pilet"
}
```

No API key is necessary. Depending on your feed server you might want to use interactive authentication:

```sh
npx publish-microfrontend --url <feed-url> --interactive
```

## Config Options

For the `.microfrontendrc` file the following options exist:

- `url`: The URL of the feed service to use.
- `apiKey`: The API key to use when authenticating.
- `interactive`: Determines if the interactive login should be used to retrieve the authentication token / API key. Defaults to *false*.
- `cert`: The path to the custom certificate to use as CA.
- `mode`: The auth mode to use (can be 'none', 'basic', 'bearer', 'digest'). Defaults to *basic*.
- `from`: Describes the source location (can be 'local', 'remote', 'npm'). Defaults to *local*.
- `fields`: An object using key-value pairs to place additionally in the request's body.
- `headers`: An object using key-value pairs to place additionally in the request's header.

The config options can all be overriden by the CLI flags. They serve as the default values for the CLI flags.

## CLI Flags

The CLI flags are a superset of the shown config options.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

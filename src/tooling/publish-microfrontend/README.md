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

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

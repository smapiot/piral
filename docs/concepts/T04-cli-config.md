---
title: CLI Configuration
description: The possibilities of configuring the CLI locally and globally.
section: Tooling
---

# CLI Configuration

The CLI uses [rc](https://www.npmjs.com/package/rc) to resolve a `.piralrc` configuration file.

The format of this file is determined by rc, too. It can either be specified in an *ini* format or *json* format. Either way, the format will be auto determined and must not be reflected via an additional file extension. Just use `.piralrc` as file name.

## Configuration Options

Right now the following configuration options exist:

- **apiKey** (`string`): Key to be used for all servers in case there is no specialized key in *apiKeys* specified.
- **apiKeys** (`{ string }`): Mapping of feed URLs to API keys. Can be used to determine a key for a specific URL.
- **url** (`string`): URL to be used for publishing a pilet in case there is no specialized key in url specified.
- **cert** (`string`): Path to a custom certificate file.
- **npmClient** (`string`): Selects the default npm client (`npm`, `yarn`, `pnpm`) to use.
- **bundler** (`string`): Selects the default bundler (`parcel`, `parcel2`, `webpack`, `webpack5`, ...) to use, if none given and found.
- **piletApi** (`string`): Selects the default pilet API path (default: `/$pilet-api`) to use.
- **validators** (`{ any }`): Sets the validators configuration for a Piral instance.

Most options would almost never be needed to be changed. A good example for such an advanced option is the `piletApi`, which would only require a change in some extreme situations.

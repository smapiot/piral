# Pluggable Bundlers

The Piral CLI is the central tooling for Piral, but neither do you need to use it nor does it try to reinvent the wheel. Instead, it leverages existing open-source software for doing its job.

One of the covered areas is bundling, i.e., producing optimized assets from your source code for debugging or production purposes.

## Available Bundler Plugins

The `piral-cli` tool can be extended using existing bundler plugins. By default, we use the `piral-cli-webpack` plugin, which integrates Webpack as a bundler into the Piral CLI.

Officially, there are the following plugins available:

- [piral-cli-webpack](https://www.npmjs.com/package/piral-cli-webpack) for bringing support for Webpack
- [piral-cli-parcel](https://www.npmjs.com/package/piral-cli-parcel) for bringing support for Parcel

::: question: Can the Piral CLI work without a bundler?
Indeed it can, even though the default bundler plugin would be installed when a bundler would be required.
:::

## Providing a Bundler Plugin

Integrating your own bundler plugin is easily possible. In a nutshell, a bundler plugin is just a "normal" `piral-cli` plugin using the `withBundler` API.

The simplest example would look as follows:

```ts
import * as actions from './actions';
import { CliPlugin } from 'piral-cli';

const plugin: CliPlugin = cli => {
  cli.withBundler('bundler-name', actions);
};

module.exports = plugin;
```

The provided actions need to fulfill the following interface:

```ts
export interface BundlerDefinition {
  debugPiral: {
    flags?: ToolCommandFlagsSetter;
    run(args: DebugPiralParameters): Promise<Bundler>;
  };
  watchPiral: {
    run(args: WatchPiralParameters): Promise<Bundler>;
  };
  buildPiral: {
    flags?: ToolCommandFlagsSetter;
    run(args: BuildPiralParameters): Promise<BundleDetails>;
  };
  debugPilet: {
    flags?: ToolCommandFlagsSetter;
    run(args: DebugPiletParameters): Promise<Bundler>;
  };
  buildPilet: {
    flags?: ToolCommandFlagsSetter;
    run(args: BuildPiletParameters): Promise<BundleDetails>;
  };
}
```

Details on the used interfaces can be found in the types section.

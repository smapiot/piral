---
title: Bundlers
description: The idea and realization of integrating any bundler.
section: Tooling
---

# Bundlers

The Piral CLI is the central tooling for Piral, but neither do you need to use it nor does it try to reinvent the wheel. Instead, it leverages existing open-source software for doing its job.

One of the covered areas is bundling, i.e., producing optimized assets from your source code for debugging or production purposes.

## Available Bundler Plugins

The `piral-cli` tool can be extended using existing bundler plugins. By default, we use the `piral-cli-webpack` plugin, which integrates Webpack as a bundler into the Piral CLI.

Officially, there are the following plugins available:

- [piral-cli-webpack](https://www.npmjs.com/package/piral-cli-webpack) for bringing support for Webpack (v4)
- [piral-cli-webpack5](https://www.npmjs.com/package/piral-cli-webpack5) for bringing support for Webpack (v5)
- [piral-cli-parcel](https://www.npmjs.com/package/piral-cli-parcel) for bringing support for Parcel (v1)
- [piral-cli-parcel2](https://www.npmjs.com/package/piral-cli-parcel2) for bringing support for Parcel (v2)
- [piral-cli-esbuild](https://www.npmjs.com/package/piral-cli-esbuild) for bringing support for esbuild
- [piral-cli-rollup](https://www.npmjs.com/package/piral-cli-rollup) for bringing support for Rollup.js
- [piral-cli-vite](https://www.npmjs.com/package/piral-cli-vite) for bringing support for Vite

::: question: Can the Piral CLI work without a bundler?
Indeed it can, even though the default bundler plugin would be installed when a bundler is required.
:::

## Providing a Bundler Plugin

Integrating your own bundler plugin is easily possible. In a nutshell, a bundler plugin is just a "normal" `piral-cli` plugin using the `withBundler` API.

The simplest example would look as follows:

```ts
import * as actions from './actions';
import type { CliPlugin } from 'piral-cli';

const plugin: CliPlugin = cli => {
  cli.withBundler('bundler-name', actions);
};

module.exports = plugin;
```

The provided actions need to fulfill the following interface:

```ts
export interface BundlerPrepareArgs<T> {
  (args: T): T | Promise<T>;
}

export interface BaseBundlerDefinition<T> {
  path: string;
  prepare?: BundlerPrepareArgs<T>;
}

export interface WatchPiralBundlerDefinition extends BaseBundlerDefinition<WatchPiralParameters> {}

export interface DebugPiralBundlerDefinition extends BaseBundlerDefinition<DebugPiralParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface BuildPiralBundlerDefinition extends BaseBundlerDefinition<BuildPiralParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface DebugPiletBundlerDefinition extends BaseBundlerDefinition<DebugPiletParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface BuildPiletBundlerDefinition extends BaseBundlerDefinition<BuildPiletParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface BundlerDefinition {
  debugPiral: DebugPiralBundlerDefinition;
  watchPiral: WatchPiralBundlerDefinition;
  buildPiral: BuildPiralBundlerDefinition;
  debugPilet: DebugPiletBundlerDefinition;
  buildPilet: BuildPiletBundlerDefinition;
}
```

Details on the used interfaces can be found in the types section. The `path` must lead to a module handling the bundling process. This module will be called in a new process, so don't expect any shared state between the Piral CLI plugin and this module.

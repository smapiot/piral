---
title: Migration Instructions
description: Find out what to do when upgrading from one major to another major version.
section: Upgrade
---

# Instructions for Migration

Starting with the release of 0.11 we encourage everyone to read this before migrating.

> In general we will never break your Pilet API. Therefore, all of these changes below refer to the use of the Piral CLI for non-essential tasks or your Piral instance.

## 0.13 to 0.14

### Breaking Changes in 0.14

1. The debug API does not work with the legacy Piral Inspector. The new API is supported from the Piral Inspector browser extension v0.7 upwards.
2. By default the new pilet schema (v2) is used to build and debug pilets. Make sure the used feed service and app shell support this or use `--schema v1` when building or publishing pilets with the previous (v1) schema.
3. The API for the bundler plugins in the `piral-cli` changed. See below for details.
4. The overall mechanism for converting Angular components (`piral-ng`) has changed. See below for details.
5. Removed the functions `extendSharedDependencies` and `setSharedDependencies`. See below for details.

#### 2) New Pilet Schema

The new pilet schema (`v2`) uses SystemJS as output format. Still, a spec version marker is required (just with `v1`). For `v2` it looks as follows:

```js
//@pilet v:2(<requireRef>, <sharedDependencies>)
```

The `requireRef` is not used as beforehand. Most notably, it should be used for internal chunk sharing of the pilet. In cases where the pilet is removed or this name would be removed from the global object.

The `sharedDependencies` are interesting. This is a JSON object that maps the identifiers of the shared dependencies to their bundles.

Example:

```js
//@pilet v:2(webpackChunkpr_piletwebpack5,{"emojis-list@3.0.0":"emojis-list.js"})
```

Here, the `requireRef` is `webpackChunkpr_piletwebpack5` and the `sharedDependencies` are `{"emojis-list@3.0.0":"emojis-list.js"}`, i.e., a single shared dependency named `emojis-list@3.0.0` (coming from the `emojis-list` package in version 3.0.0) which can be loaded via the local *emojis-list.js* file, if not available yet.

We recommend to update custom feed server implementations to support `v2`. See the [specification](../specs/feed-api-specification.md) for details.

#### 3) New Bundler API

The **old** bundler API looked as follows (fragment):

```ts
export interface WatchPiralBundlerDefinition {
  run(args: WatchPiralParameters): Promise<Bundler>;
}

export interface DebugPiralBundlerDefinition {
  flags?: ToolCommandFlagsSetter;
  run(args: DebugPiralParameters): Promise<Bundler>;
}

export interface BuildPiralBundlerDefinition {
  flags?: ToolCommandFlagsSetter;
  run(args: BuildPiralParameters): Promise<BundleDetails>;
}

export interface DebugPiletBundlerDefinition {
  flags?: ToolCommandFlagsSetter;
  run(args: DebugPiletParameters): Promise<Bundler>;
}

export interface BuildPiletBundlerDefinition {
  flags?: ToolCommandFlagsSetter;
  run(args: BuildPiletParameters): Promise<BundleDetails>;
}

export interface BundlerDefinition {
  debugPiral: DebugPiralBundlerDefinition;
  watchPiral: WatchPiralBundlerDefinition;
  buildPiral: BuildPiralBundlerDefinition;
  debugPilet: DebugPiletBundlerDefinition;
  buildPilet: BuildPiletBundlerDefinition;
}
```

The **new** bundler API is now changed to (fragment):

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
```

This means that the job of pre-processing the configuration and then starting a new process for the bundling is completely done inside the `piral-cli`.

If you want to pre-process some of the new arguments (still inserted via the `flags` option) you'd use the `prepare` function. The `run` function has been removed. Instead, use the `path`, which should be absolute to lead to a module to invoke.

Example (changed actions in `piral-cli-webpack`).

**Previously** we had:

```ts
export const debugPiral: DebugPiralBundlerDefinition = {
  async run(args) {
    const bundler = await callDynamic('debug-piral', args);
    return bundler;
  },
};

export const watchPiral: WatchPiralBundlerDefinition = {
  async run(args) {
    const bundler = await callStatic('debug-mono-piral', args);
    return bundler;
  },
};

export const buildPiral: BuildPiralBundlerDefinition = {
  async run(args) {
    const bundler = await callStatic('build-piral', args);
    return bundler.bundle;
  },
};

export const debugPilet: DebugPiletBundlerDefinition = {
  async run(args) {
    const bundler = await callDynamic('debug-pilet', args);
    return bundler;
  },
};

export const buildPilet: BuildPiletBundlerDefinition = {
  async run(args) {
    const bundler = await callStatic('build-pilet', args);
    return bundler.bundle;
  },
};
```

In the **current** way we have:

```ts
export const debugPiral: DebugPiralBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const watchPiral: WatchPiralBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const buildPiral: BuildPiralBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const debugPilet: DebugPiletBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'pilet.js'),
};

export const buildPilet: BuildPiletBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'pilet.js'),
};
```

Essentially, we only distinguish between pilet and Piral. The module itself is a standard CommonJS module that exports a single function `create` returning a `Promise`.

#### 4) Updated `piral-ng`

Previously, using Angular AoT was pretty much impossible. With the new approach this is possible in situations where you also bundle Angular with your pilet. Otherwise, in a shared Angular scenario you'll not be able to get AoT working.

The other thing that is new is that you can actually reuse modules. While the old approach of having an `NgModule` inserted into `fromNg` still works, we recommend inserting the module into `defineNgModule` instead.

Old way:

```ts
@NgModule({
  //...
  bootstrap: [MyComponent],
})
class MyModule {}

// in the setup function
api.registerPage('/foo', api.fromNg(MyModule));
```

New way:

```ts
@NgModule({
  //...
  exports: [MyComponent],
})
class MyModule {}

// in the setup function
api.defineNgModule(MyModule);
api.registerPage('/foo', api.fromNg(MyComponent));
```

The main advantage of the new way is that it allows reusing the module for multiple components.

```ts
@NgModule({
  //...
  exports: [MyPage, MyTile],
})
class MyModule {}

// in the setup function
api.defineNgModule(MyModule);

api.registerPage('/foo', api.fromNg(MyPage));
api.registerTile(api.fromNg(MyTile));
```

All of these components will be running in the same module instance, but they will be bootstrapped into different container elements.

For using the common functionality such as the `ResourceUrlPipe` pipe or the `NgExtension` component you'll now need to install `piral-ng` in the pilets, too. Then you can import the `SharedModule` from `piral-ng/common`. Your app module (or any other) would then look as follows:

```ts
import { SharedModule } from 'piral-ng/common';

@NgModule({
  //...
  imports: [SharedModule],
})
class AppModule {}
```

Very often, this import would only go into a single module - your "common" module.

#### 5) Removed dependency helpers

The dependency management is now in the hands of SystemJS. Therefore any manipulation of shared dependencies is no longer using `extendSharedDependencies` or `setSharedDependencies`. Instead, you should use the SystemJS API as [documented on their repository](https://github.com/systemjs/systemjs/blob/main/docs/api.md).

For instance, you can use `System.register` to actually register a new dependency. Alternatively, the `registerModule` function of `piral-base` could be used for a single dependency.

Finally, the best equivalent for `extendSharedDependencies` is `registerDependencies` from `piral-base`. This will receive an object with modules - each module will be registered in SystemJS.

## 0.12 to 0.13

### Breaking Changes in 0.13

1. The `withApi` API of the `piral-core` package changed its first argument. Instead of the `context.converters` it now expects the full `context`. This may break some plugins that used that internally.
2. The `piral` package now comes with React 17 as a dependency. This is (in almost all practical cases) backwards compatible so it should not represent an issue. If you really want to stay on React 16 then use the `piral-core` and `piral-ext` packages instead of the full `piral` package. `piral-core` still has a peer dependency to React - allowing versions 16 or 17.
3. For full compatibility with npm v7 the `peerDependencies` in pilets will only contain valid package names. Therefore, submodule externals (e.g. `foo/bar`) will be placed in a new section called `peerModules`, which is not evaluated by npm but picked up by the Piral CLI.

## 0.11 to 0.12

### Breaking Changes in 0.12

1. The `--type` flag of the Piral CLI changed values. `develop` has been renamed to `emulator`.
2. The output of the emulator is no longer in the `[out]/develop` directory, but in `[out]/emulator`, where `[out]` refers to the output directory (usually *dist*).

### Deprecations

1. The `extendApi` configuration option for the `createInstance` function is now called `plugins`

## 0.10 to 0.11

### Breaking Changes in 0.11

1. The `PiletApi` now originates from piral-base
2. In pilets externals are now part of the root object in their package.json, no longer in piral
3. Pilets are built by default using the `v1` schema (this can be changed via a command-line flag `--schema`)

Let's see how to handle these breaking changes.

#### 1) PiletApi

Well, this is a pretty simple one. If you - for some reason - extended the `PiletApi` directly (i.e., not via the `PiletCustomApi` interface that comes from `piral-core`) then you'd need to change your `declare module` path.

```ts
declare module 'piral-base/lib/types' {
  interface PiletApi {}
}
```

But then again - in most cases, you will not need to do anything.

#### 2) Externals

The handling of externals was always split into two parts:

1. Definition of the shared dependencies in the `externals` key of the `pilets` section within the *package.json* of the Piral instance.
2. The `peerDependencies` in `externals` keys in the *package.json* of the pilets. The latter key is part of the `piral` section.

The second part was now changed. `externals` are no longer copied from the app shell to the pilet. Instead, only the `peerDependencies` are used.

Since it is the classic behavior anyway to copy the externals to the `peerDependencies`, too, in most cases you'll not need to do anything here, too.

In any other case upon `pilet upgrade`, this is corrected/aligned anyway. There is also no functional consequence here that forces you to update and rebuild.

#### 3) Pilet Schema

With 0.11 the interpretation of pilets changed. For backwards compatibility the old mode is still present and triggered if the feed service metadata does not contain a `requireRef` key per pilet.

The whole mechanism has been build such that the new way is used when:

- the Piral instance uses 0.11 or more recent
- the feed service knows about the pilet `v1` schema
- the pilet has been build using the Piral CLI 0.11 or more recent with the `v1` schema (which is the default schema)

We recommend using the new mode. If you want to use it, you'll need to upgrade your Piral instance to 0.11 or later. You'll also need to use a compatible feed service (the official one is updated, as well as our sample feed service). Finally, all pilets that should use `v1` must be re-build using a 0.11 version of the `piral-cli`.

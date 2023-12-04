---
title: Emulator
description: Details on how an emulator is created and used.
section: Tooling
---

# Emulator

To make developing pilets as easy and intuitive as possible, the app shell can be distributed as a so-called emulator. For this distribution there are right now 3 different models:

1. Package - a tarball (npm package) is used (use case: a (private) npm registry exists)
2. Source - the app shell's source code is directly referenced (use case: monorepo)
3. Website - a special build of the app shell is uploaded to some static storage (use case: the emulator can be public)

The emulator is essentially the app shell with special debug helpers (e.g., allowing usage with the Piral Inspector), source maps, and non-production sources (e.g., shipping with the full React error explanations and development warnings).

## Building

### Package Emulator

The emulator is built via the `piral-cli` using the command `piral build --type emulator-package`. The result is a `tgz` located in the `dist/emulator` folder that could be published to an npm registry.

In case you want to inspect the files contained in the emulator package (without opening / unpacking the tarball) you can use the `--type emulator-sources` flag for the `piral-cli`: `piral build --type emulator-sources`.

This type of emulator is the default. In case you want to be explicit about this being the default you can change the *piral.json* to be:

```json
{
  "$schema": "https://docs.piral.io/schemas/piral-v0.json",
  "emulator": "package"
}
```

Alternatively, if you want to have the emulator package, but not already packaged but rather in form of its sources, you can change that default to be:

```json
{
  "$schema": "https://docs.piral.io/schemas/piral-v0.json",
  "emulator": "sources"
}
```

### Source Emulator

In this variation no build step is necessary. This is the case in a monorepo where your app shell is just one of the "packages" / directories along your pilets. Alternatively, you could also just package or distribute the app shell's source code with no build step. In this case your app shell is already an emulator, however, the build of this emulator is still necessary and might fail if certain dependencies are not available in the pilet's directory.

### Website Emulator

In this variation the emulator is built via the `piral-cli` using the command `piral build --type emulator-website`. The result quite similar to the release build, with the artifacts placed in `dist/emulator` instead of `dist/release`. The files located in `dist/emulator` can then be uploaded to some static storage that can be referenced by an URL.

In case you want to always produce this kind of emulator when you call `piral build` you can adjust the *piral.json* to be:

```json
{
  "$schema": "https://docs.piral.io/schemas/piral-v0.json",
  "emulator": "website"
}

## Package Definition

In case of a emulator package the generated tarball contains a pre-bundled version of the sources, together with a modified version of the app shell repository's original *package.json*.

The following properties are taken over:

- `name`
- `version`
- `description`
- `license`
- `homepage`
- `keywords`
- `pilets`
- `repository`
- `bugs`
- `author`
- `contributors`
- `engines`
- `cpu`
- `publishConfig`

The following props are created:

- `main` (pointing to `app/index.js`)
- `typings` (pointing to `app/index.d.ts`)
- `app` (pointing to `app/index.html`)
- `piralCLI` (to contain the current version)
- `devDependencies` (from `devDependencies`, `dependencies`, and `pilets.externals`)

The `piralCLI` property determines if the given package contains *raw* sources or already *pre-bundled* sources. In the latter case, we will directly start a server from `app`, in the former case, a lightweight version of `piral debug` is applied to the sources.

::: tip: Custom emulator
If you build your emulator package on your own incl. already pre-bundled sources, make sure to include the following snippet in your *package.json*:

```json
{
  "piralCLI": {
    "generated": true
  }
}
```

This makes sure to avoid running a `piral debug` on the sources.
:::

## Emulator Manifest

The emulator website comes with a special file called `emulator.json` that contains all information to be used by pilets. This file contains the following information:

- `name` has the name of the app shell
- `description` contains the description given for the app shell
- `version` specifies the currently used version of the app shell
- `timestamp` defines the point in time when the emulator was created
- `scaffolding` information with the defined pilets info and used version of the `piral-cli`
- `files` referencing essential files for typings, the app (HTML and JS), as well as all assets
- `importmap` having the exposed importmap (centrally shared dependencies)
- `dependencies` goes into details on the used optional and included dependencies

## Declaration

Usually, only the `PiletApi` and its used types are exported from the app shell.

Extending this is possible, too. The first step is to reference additional `typings` in the *package.json*:

```json
{
  "typings": "src/types.ts"
}
```

If, for some reason, you cannot use the `typings` field you can use the artificial/non-official `extraTypes` field, too:

```json
{
  "extraTypes": "src/types.ts"
}
```

Either way, this could lead to a `.d.ts` or `.ts` file. Exports in the given file are directly integrated into the declaration.

For instance, the following would appear as an app shell export:

```ts
export interface ExportedInterface {}
```

The emulator declaration can also be built independently using the command `piral declaration`.

::: tip: Piral declaration entry point
By default, the `piral declaration` command works against the current working directory. It looks for the closest *package.json* and retrieves the application's entry point via the `app` field. In case you want to specify this you can provide the entry point directly.

The command `piral declaration path/to/entry` supports *.html*, *.js*, *.jsx*, *.ts*, and *.tsx* files as entry points.
:::

There are some advantages of using `extraTypes` over `typings`:

- Works in a monorepo, too
- Avoids confusion for developers knowing that `typings` comes from TypeScript directly (like `types`)
- Also accepts an array of entries, e.g., `["src/types.ts", "src/api.ts"]`

## Virtual Packages

Using the declaration technique a virtual package could be bundled, too.

```ts
declare module 'my-virtual-package' {
  export interface Example {}

  export declare const Foo: Example;
}
```

While importing the type from the virtual package in a pilet is always possible, the functional import of `Foo` is trickier. After all, we need to have this prepared, too:

```ts
const instance = createInstance({
  getDependencies() {
    return {
      ...getLocalDependencies(),
      'my-virtual-package': {
        Foo: {},
      },
    };
  },
});
```

This allows importing things from the `my-virtual-package` dependency in a pilet at runtime.

::: warning: Use real packages
The downside is that some bundlers may have a problem with the virtual package. For instance, Parcel likes to resolve real paths first and will complain if a package cannot be found.

We therefore recommend using only real packages. In a monorepo the cost of maintenance is negligible and they are much more flexible, introduce less magic, and could be reused.
:::

## Types in Monorepos

As the `typings` field in the *package.json* is already used for the declaration types, we may have a problem properly defining the path to the generated declaration. This is, however, essential to have a great monorepo experience.

For specifying the path in a monorepo we can use the `types` field. Officially, the `types` field is synonymous with `typings`, however, in resolution it takes precedence. Thus it works just as it should.

::: tip: Avoid confusion
Our recommendation is to use the artificial `extraTypes` field to avoid having `typings` and `types` specified. The latter may result in confusion among developers, which is never a good thing.

In this approach, we recommend using `extraTypes` for specifying the additional typings to consider when building the declaration, and `types` to refer to the generated declaration file.
:::

Note that for creating the emulator none of the two are directly taken. More details are in the [monorepo guideline](../tutorials/23-monorepo.md).

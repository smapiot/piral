---
title: Emulator Package
---

# Emulator Package

To make developing pilets as easy and intuitive as possible the app shell can be packaged to serve as an emulator.

The emulator is essentially the app shell with special debug helpers (e.g., allowing usage with the Piral Inspector), source maps, and non-production sources (e.g., shipping with the full React error explanations and development warnings).

## Building

The emulator is built via the `piral-cli` using the command `piral build --type emulator`. The result is a `tgz` located in the `dist/emulator` folder that could be published to an NPM feed.

## Package Definition

The generated tarball contains a pre-bundled version of the sources, together with a modified version of the app shell repository's original *package.json*.

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
- `piralCLI` (to containg the current version)
- `devDependencies` (from `devDependencies`, `dependencies`, and `pilets.externals`)

The `piralCLI` property determines if the given package contains *raw* sources or already *pre-bundled* sources. In the latter case we will directly start a server from `app`, in the former case a lightweight version of `piral debug` is applied to the sources.

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

## Declaration

Usually, only the `PiletApi` and its used types are exported from the app shell.

Extending this is possible, too. The first step is to reference additional `typings` in the *package.json*:

```json
{
  "typings": "src/types.ts"
}
```

This could lead to a `.d.ts` or `.ts` file. Exports in the given file are directly integrated into the declaration.

For instance, the following would appear as an app shell export:

```ts
export interface ExportedInterface {}
```

The emulator declaration can also be built independently using the command `piral declaration`.

::: tip: Piral declaration entry point
By default, the `piral declaration` command works against the current working directory. It looks for the closest *package.json* and retrieves the application's entry point via the `app` field. In case you want to specify this you can provide the entry point directly.

The command `piral declaration path/to/entry` supports *.html*, *.js*, *.jsx*, *.ts*, and *.tsx* files as entry points.
:::

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
The downside is that some bundlers may have a problem with the virtual package. For instance, Parcel likes to resolve real paths first, and will complain if a package cannot be found.

We therefore recommend using only real packages. In a monorepo the cost of maintenance is negligible and they are much more flexible, introduce less magic, and could be reused.
:::

## Types in Monorepos

As the `typings` field in the *package.json* is already used for the declaration types, we may have a problem to properly define the path to the generated declaration. This is, however, essential to have a great monorepo experience.

For specifying the path in a monorepo we can use the `types` field. Officially, the `types` field is synonymous to `typings`, however, in resolution it takes precedence. Thus it works just as it should.

Note that for creating the emulator none of the two are directly taken.

---
title: TypeScript Declarations
description: Guidance how enhanced TypeScript support can be used in app shells and micro frontends.
audience: Architects, Developers
level: Proficient
section: Details
---

# TypeScript Declarations

Scaling an application is not only achieved by proper modularization, but also by ensuring that contracts in form of component props, function arguments, as well as object keys and value types are fulfilled. A good tool to help in this area is TypeScript. Piral comes with full support for TypeScript out of the box, but also offers enhanced way to tackle various scenarios, too.

Let's first start by understanding what is possible without any configuration.

## Emulator Declarations

Piral uses [dets](https://github.com/FlorianRappl/dets) to generate declaration files for Piral instances and pilets. These files are automatically produced on the `build` command, e.g., `piral build` will imply that `piral declaration` is run for generating the TypeScript declaration file. Likewise, there is a `pilet declaration` for generating the declaration file in context of a pilet.

The declaration file of a Piral instance should be set in the `types` field of the *package.json*. As an example:

```json
{
  // ... normal package.json content with name, version, ...
  "types": "dist/index.d.ts"
}
```

While this won't be really needed for the emulator build, it is crucial for using the source of the Piral instance within a monorepo. This way, pilets relating to your app shell via an import will be able to find its type declarations correctly - as if it was the statically built emulator package.

In addition to the once generated `index.d.ts` file you can also instruct the `piral-cli` tool to include remote types. This can be super helpful in cases where additional definitions are scattered within your micro frontends (think of pilets adding more event types, or using extension slots with a certain contract in mind). The key for teaching the `piral-cli` about those types is the `remoteTypesSource` property in the *piral.json*:

```json
{
  "remoteTypesSource": "https://myfeedservice.example.com/api/v1/pilet/myfeed/types.d.ts"
}
```

With this configuration the emulator will be constructed in a way that allows other areas to download and update the remote typings. They will always be merged into the generated declaration file. The download only happens for pilets.

To configure where to store the remote types locally within a pilet, the `remoteTypesTarget` property can be set in the *pilet.json*:

```json
{
  "remoteTypesTarget": "./src/remote.d.ts"
}
```

While a string value indicates the absolute or relative location of the file to write, using `true` will fall back to the default location (which is `./src/remote.d.ts`). Using `false` will result in the file being omitted. The generated file can be ignored in your version control system, e.g., using *.gitignore* for git you might want to add the following entry:

```
./src/remote.d.ts
```

Make sure that the entry matches the name of the file as specified in the *pilet.json*.

## Pilet Declarations

Like Piral instances, pilets automatically generate declaration files. These declaration files will be shipped together with the runtime code to allow any micro frontend discovery service to collect and aggregate the files. As an example, the [Piral Cloud Feed Service](https://docs.piral.cloud/) does that automatically - resulting in an URL with the aggregated declarations of all currently active micro frontends.

For this to work properly, the *package.json* of a pilet also needs to reference the TypeScript declarations properly:

```json
{
  // ... normal package.json content with name, version, ...
  "types": "dist/index.d.ts"
}
```

Upon running `pilet build` the `pilet declaration` command is implicit, i.e., a declaration file will be generated. Installing a Piral instance from an emulator package or emulator website will automatically download referenced remote type declaration files.

In order to generate proper declaration files within a pilet, the difference between the full typings starting at the pilet and the ones from the app shell are considered. Only the difference is included.

As an example, to extend the Piral instance (in this example named `my-app-shell`) with an extension slot taking a parameter `qxz`, which has to be a string, the following code can be added to the *index.tsx* of the pilet:

```ts
declare module "my-app-shell" {
  interface PiralCustomExtensionSlotMap {
    qxz: string;
  }
}
```

## Conclusion

In this article, you've seen how easy it is to bring type safety to your application. Not only are Piral instances properly guarded, also pilets can generate declaration files which can be aggregated and installed in micro frontends. This way, contracts can be formed that allow safe distribute development without any centrally required documentation effort.

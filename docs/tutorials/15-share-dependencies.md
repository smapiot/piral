---
title: Sharing Dependencies
description: Dependencies can be shared in Piral implicitly and explicitly.
audience: Developers
level: Proficient
---

# Sharing Dependencies

Sharing dependencies is one of the selling points of Piral. The key, however, is not to *overshare*, i.e., to share too much. With every shared dependency a certain burden / debt is included. If too many dependencies are shared, the dependency management will become too complicated and eventually collapse.

Our recommendation is to keep the sharing of dependencies from the app shell as practical as possible.

## Implicit Sharing from the App Shell

The easiest way to share dependencies from the app shell is to declare them in the `externals` section of the *package.json*.

For instance, if we want to share the `reactstrap` dependency we can place the following snippet in the app shell's *package.json*:

```json
{
  "pilets": {
    "externals": [
      "reactstrap"
    ],
  },
  // ...
}
```

Besides the dependencies that are specified in the `externals` list of the *package.json* the following dependencies are anyway always added:

- `react`
- `react-dom`
- `react-router`
- `react-router-dom`
- `history`
- `tslib`
- `path-to-regexp`
- `@libre/atom`
- `@dbeining/react-atom`

These are dependencies that are coming directly or indirectly from `piral-core`. Any other dependency needs to be added to the `externals` list above.

## Explicit Sharing from the App Shell

Dependencies can also be "defined" or explicitly mentioned in the app shell. The mechanism for this works via the `getDependencies` option of the `createInstance` function.

```js
const instance = createInstance({
  getDependencies() {
    return {

    };
  },
});
```

**Note**: By default this will override the standard behavior mentioned above. Using this mechanism one can completely define how and which dependencies are shared. To just mimic the original behavior the following code can be used.

```js
const instance = createInstance({
  getDependencies() {
    return getLocalDependencies();
  },
});
```

Using this behavior we can expose "new" dependencies, e.g., the app shell itself.

As an example consider that an app shell named `my-app-shell` also wants to export some functionality coming from a module declared in *exports.ts*. The following code would just do that:

```js
const instance = createInstance({
  getDependencies() {
    return {
      ...getLocalDependencies(),
      'my-app-shell': require('./exports'),
    };
  },
});
```

By default, we do not recommend exporting functionality from the app shell. A Piral instance should **only deliver types** to the pilets. However, sometimes having a dedicated package for extra functionality would either complicate things or is just not feasible.

## Type Declarations

While the explicit way is great for flexibility it comes with one caveat: For this kind of sharing types are not automatically inferred and generated. As a result, we need to place additional typings for our offerings.

By specifying the `typings` field in the *package.json* of the Piral instance we can tell Piral where the *.d.ts* files describing our app shell exports are placed.

As an example, for referencing a file called *api.d.ts*, which is adjacent to the *package.json* we would thus use the following snippet:

```json
{
  "typings": "api.d.ts",
  // ...
}
```

The file could look as simple as:

```ts
export declare function myfunction(): void;
```

This would tell pilets that an import of `myfunction` is possible.

Using this technique we can also describe other modules that we've added. For instance, explicitly stating the module name of our app shell:

```ts
declare module 'my-app-shell' {
  export declare function myfunction(): void;
}
```

**Important**: These are just type declarations. We could, of course, declare some module like `foo-bar`, however, if that is indeed used in a pilet the build will potentially fail. As long as no module with the given name really exists the bundler will not be able to resolve it - independent of what TypeScript assumes.

The rule of thumb for sharing the type declarations is: Everything exported top-level will be associated with the app shell, everything exported from an explicitly declared module will be associated with that module.

## Sharing from Pilets

...

## Conclusion

Sharing dependencies in Piral is an important aspect that can be controlled in simple ways. Piral understands itself here as a guide and tool. Sharing all dependencies is certainly not helpful and should be avoided. On the other hand sharing no dependency will in most cases not be beneficial, too. Finding a good "middle" way will take time.

The most effective sharing comes by extending the Pilet API. One crucial aspect is that some sharing will be centralized in Piral's state container. In the next tutorial you'll learn how to use Piral's state container with (custom) actions.

---
title: Developing for Multiple App Shells
description: Guidance how pilets can be developed for multiple Piral instances.
audience: Architects, Developers
level: Proficient
section: Details
---

# Developing for Multiple App Shells

Pilets do not depend on a specific app shell, even though the development setup may suggest that. In fact, it is totally up to the pilet's creator how tightly it will be integrated into a specific Piral instance.

Let's first start by understanding how, why, and where a pilet might be coupled to a specific Piral instance.

## Understanding the Coupling

An app shell comes with several possibilities that may be leveraged by an individual pilet. These include (but are not limited to):

- Shared dependencies
- Pilet API functionality
- Global variables
- Global styling

As your pilet knows and uses more of such parts, its coupling to that app shell gets stronger. Likewise, looking at all possible app shells you may build with Piral, you'll see that most of them will have `react` as a peer dependency and use some Pilet API such as `registerPage` or `registerExtension`.

If you only use such "common" possibilities the coupling would be relatively weak. In comparison, if an app shell has custom APIs (e.g., `registerFoo`) and custom shared dependencies (e.g., custom package `@foo/bar`) then using these will obviously make the coupling really strong.

A strong coupling indicates that exchanging the (primary) app shell for another Piral instance will be difficult. The difficulty arises from the used possibilities, which now need to be replicated in this new shell.

The story regarding coupling is not over with Piral-specific details such as dependency sharing or the Pilet API. It certainly continues to also touch any globals provided by the app shell. While global variables (anything attached to `window`) can be seen in the code directly, global styling is more of a problem. Consider, the `registerMenu` API. Even though your pilet may register the same component in the menu of app shell 1 and 2, it may look completely broken in app shell 2, while it's looking perfectly fine in app shell 1.

Ideally, any global styling is implicitly used correctly and does not rely on CSS class names. Hence, instead of requiring the use of some class like `menu-item` the styling should be performed directly on the substructure (e.g., some child elements). Remember, that having more things to know about leads to higher coupling which leads to less flexibility.

So, how can we weaken the coupling?

## Strategies to Weaken the Coupling

All these strategies work best together with the best practices described in [tutorial 9 - pilet best practices](./09-pilet-best-practices.md).

### Adopting the Types

The easiest way to weaken the coupling is to not make any assumptions about which functionality is provided by the app shells. How can this be achieved? Let's have a look at a pilet's root module. It may look like this:

```tsx
import { PiletApi } from 'app-shell-1';

export function setup(app: PiletApi) {
  // ...
}
```

The `PiletApi` is just a type - so the import of `app-shell-1` has no runtime consequence and only provides development convenience. In this case, however, it may cause pilet authors to use functionality that is only available in `app-shell-1`. After all, this is what the pilet author *sees* or *knows*.

Hence, if `app-shell-1` exposes an API `registerTile`, we can use it without an error:

```tsx
import { PiletApi } from 'app-shell-1';

export function setup(app: PiletApi) {
  // just works
  app.registerTile(MyTile);
}
```

The best way to stay app shell independent is to determine the Pilet API type yourself:

```tsx
interface PiletApi {
  registerPage(route: string, component: FC): void;
  registerExtension(slotName: string, component: FC): void;
}

export function setup(app: PiletApi) {
  // does not work - gives error!
  app.registerTile(MyTile);
}
```

With the given definition, only `registerPage` and `registerExtension` can be used without an error. What if we want to dynamically use `registerTile` if provided by the current app shell? This can also be covered pretty nicely:

```tsx
interface PiletApi {
  registerPage(route: string, component: FC): void;
  registerExtension(slotName: string, component: FC): void;
  registerTile?(component: FC): void;
}

export function setup(app: PiletApi) {
  // works if guarded
  if (app.registerTile) {
    app.registerTile(MyTile);
  }
}
```

Of course, such guards would also work without using the interface at all.

### Handling Shared Dependencies

Besides the typings, you'll also need to take care of shared dependencies. If your pilet's *package.json* contains a (filled) `peerDependencies` section or a (filled) `inherit` section of an `importmap`, some assumptions about the app shell have already been made.

There are now two extreme ways you can take:

1. Make all `peerDependencies` normal `dependencies`, i.e., do not use shared dependencies at all.
2. Move all `peerDependencies` to `imports` of an `importmap`, i.e., make them implicitly shared if possible.

For this kind of scenario, you should not use `inherit` of an `importmap`.

There is also a combination of (1) and (2) where some shared dependencies are put into `dependencies` and others are put into the `importmap`. Usually, this is the best way. Dependencies like `react` are typically shared and would not behave nicely if not.

You don't need to apply this strategy to everything listed in `peerDependencies`. You can also drop packages that are not used at all in the pilet. They may still stay in `devDependencies` to potentially resolve all types, but that's it.

## Multi-Pilet vs Multi-Shell

There are two ways you can handle such multi app shell scenarios:

1. Build and publish the same pilet for each shell
2. Reuse the (once) published pilet for each shell

In the first case, functionality specific to each shell may be included. Such functionality may be included or stripped out at build-time via the `process.env.PIRAL_INSTANCE` environment variable. Furthermore, by using guards as described above, API capabilities can be dynamically detected at runtime.

In the second case, a single feed is mostly used for the different app shells. Now, the same pilet will be consumed by these shells requiring it to be app shell independent, as described above.

If you want to see how a pilet looks in a different app shell you can add the other app shell's emulator to the pilet's `devDependencies` and run it with the `--app` flag:

```sh
pilet debug --app my-other-shell
```

This flag overrides the (primary) app shell selected via the `name` field of the `piral` section in the *package.json*.

## Conclusion

In this article, you've seen how pilets can be developed for multiple app shells. In theory, this is straightforward, however, depending on your (primary) app shell and the requirements it may be challenging. If you keep your pilets rather independent then a single artifact can be consumed by multiple shells. Otherwise, you can always opt-in to write code that can be published for different shells.

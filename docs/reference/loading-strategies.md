---
title: Loading Strategies
---

# Loading Strategies

To orchestrate how pilets are loaded a loading strategy is implemented. In most cases the default loading strategy is the most suitable one.

::: tip: Strategies come with `piral.base`
The package to come with the available loading strategies is the most basic Piral package `piral-base`, which forms the framework independent basis for Piral.
:::

Without any specifics the `standardStrategy` is used.

## Default Loading Strategy

The `standardStrategy` loads and evaluates all pilets before rendering. In the meantime Piral shows the defined loading spinner.

The execution is performed in the following way:

1. Fetch the metadata
2. Load the pilets in the order given by the metadata
3. Evaluate the pilets in the order given by the metadata

If one pilet would finish loading before another one it would still need to wait for evaluation. Here, the loading strategy guarantees that pilets are evaluated in order.

## Asynchronous Loading

There are various asynchronous loading strategies.

### Using `asyncStrategy`

The simplest asynchronous loading strategy is the `asyncStrategy`. Here, the same algorithm as with `standardStrategy` is followed, however, the loading spinner is immediately removed showing the application itself.

The advantage of this mode is that the application is rendered as soon as possible. The disadvantage is that it could be quite empty for a while. The strategy makes only sense if pilets are only used to extend certain subareas with functionality - not if they transport the main content.

### Using `blazingStrategy`

A natural evolution of the `asyncStrategy` is the `blazingStrategy`. This one also removes the loading spinner quite fast, however, waits until the metadata has been fetched.

In contrast to the `asyncStrategy` and the `standardStrategy` pilets are loaded as fast as possible, without any barriers in between. As such, this strategy does not guarantee order, but sacrifices this constraint for being able to load (and thus show) the different pilets as soon as possible.

While this strategy can make sense even for content-heavy applications, the UX needs to be quite optimized for the progressive loading behavior. Suddenly expanding menus, jumping scrollbars, and other effects may be disliked and should be gracefully handled.

## Further Strategies

The `blazingStrategy` is just an instance constructed by the `createProgressiveStrategy` factory. This factory also allows to create progressive "synchronous" strategies, which still guarantee order.

Alternatively, the `syncStrategy` can help if all pilets have been loaded already, but still need to be run (i.e., calling the `setup` function). It could be used for special purposes, e.g., SSR or specific builds of the Piral instance. This strategy ignores the fetcher and only considers the already given pilets.

::: tip: Place pilets in `window`
A very simple way of optimizing first-render performance is to place the pilets code in a global `script` tag injected into the HTML. This way, the pilets can be retrieved synchronously, allowing the use of the `syncStrategy` for evaluation.

While this could be a quick win in many scenarios, the long-term (and much more scalable) solution is to use server-side generated bundles or individual scripts.
:::

## Implementing Your Own Strategy

A loading strategy is just a small function kernel that implements the following interface:

```ts
interface PiletLoadingStrategy {
  (options: LoadPiletsOptions, pilets: PiletsLoaded): Promise<void>;
}
```

where `PiletsLoaded` is a callback to allow streaming back intermediate results. This reporter callback was defined to be:

```ts
interface PiletsLoaded {
  (error: Error | undefined, pilets: Array<Pilet>): void;
}
```

The `options` (first argument) contain all options that may be necessary for actually loading the pilets:

```ts
interface LoadPiletsOptions {
  createApi: PiletApiCreator;
  fetchPilets: PiletRequester;
  pilets?: Array<Pilet>;
  loadPilet?: PiletLoader;
  fetchDependency?: PiletDependencyFetcher;
  getDependencies?: PiletDependencyGetter;
  dependencies?: AvailableDependencies;
}
```

Most importantly, the options have the `fetchPilets` function to get the pilet metadata. The options also transport the `createApi` function to construct an API object dedicated to be used in a pilet.

All the other options are only overrides for specific functionality, e.g., to determine how exactly a pilet is loaded the `loadPilet` option can be used.

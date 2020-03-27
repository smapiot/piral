---
title: Customizing the API
description: Learn how to extend and customize the Pilet API.
audience: Developers
level: Intermediate
---

# Customizing the Pilet API

Turning back to the Piral instance we can determine how the Pilet API looks like. By default, the Pilet API is already extensive and well-suited for many use cases. Nevertheless, we may need to add another useful API to give our pilets the right set of capabilities.

## Video

We also have this tutorial available in form of a video.

@[youtube](https://youtu.be/2o4ImfZWdLM)

Let's start by looking at how we scaffolded the Piral instance.

## Standard Scaffolding Approach

The code that has been generated in the getting started section was similar to the following:

```jsx
import * as React from 'react';
import { renderInstance } from 'piral';

renderInstance({
  layout: {
    ErrorInfo: ({ type }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>Error: {type}</span>
    )),
  },
});
```

This starts rendering a full Piral instance in the `#app` element of the DOM constructed by the *index.html*. While the scaffolding only starts with a *minimal* layout, it does not change anything regarding the Pilet API.

We can also modify it to the following:

```jsx
import * as React from 'react';
import { renderInstance } from 'piral';

renderInstance({
  extendApi: [],
  layout: {
    ErrorInfo: ({ type }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>Error: {type}</span>
    )),
  },
});
```

In this case we added a configuration that determines how to extend the provided (Pilet) API. The different APIs are usually given by API creator methods, which accept none or one parameter for an optional configuration. In any case we can pass in an array with such plugins or just a single plugin if we want to.

## Extending Existing APIs

An API creator function (or plugin) has the following signature:

```ts
interface ApiExtender<T> {
  /**
   * Extends the base API of a module with new functionality.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The extended API.
   */
  (api: PiletApi, target: PiletMetadata): T;
}

interface Extend<T = Partial<PiletApi>> {
  /**
   * Extends the base API with a custom set of functionality to be used by modules.
   * @param context The global state context to be used.
   * @returns The extended API or a function to create the extended API for a specific target.
   */
  (context: GlobalStateContext): T | ApiExtender<T>;
}
```

An example for such a function may be the following:

```ts
interface TrackingConfig {}

interface PiletTrackingApi {
  trackEvent(name: string): void;
}

function createTrackingApi(config: TrackingConfig = {}): Extend<PiletTrackingApi> {
  return context => (api, target) => ({
    trackEvent(name) {
      // ...
    },
  });
}
```

Importantly, to bring the typed API into the Pilet API declaration merging needs to be performed.

```ts
declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletTrackingApi {}
}
```

The function above can be simplified. If we are not dependent on the `api` or `target` parameter, we could just return the extended API.

```ts
function createTrackingApi() {
  return () => ({
    trackEvent(name) {
      // ...
    },
  });
}
```

The configuration has been left out for brevity, but we recommend to always have an `config` predefined, even though no options are available (yet).

It could be used in the configuration by referencing the function in the array:

```ts
[createTrackingApi()]
```

There are many plugins for Piral that extend the Pilet API.

## Using Piral Plugins

As an example, consider that you wrote already a great deal of components in Vue. How useful would it be to also support writing pilets with Vue? Luckily, there is the `piral-vue` package, which is plugin for Piral that extends the Pilet API with Vue specific (or enabling) functionality.

In the command line we need to install the plugin first:

```sh
npm i piral-vue
```

**Remark:** Vue (or any other library / framework) is opt-in only. Thus no code for these extra functionalities is available after installing Piral. We will always need to install additional packages to opt-in.

Now we can use `piral-vue`:

```jsx
import * as React from 'react';
import { renderInstance } from 'piral';
import { createVueApi } from 'piral-vue';

renderInstance({
  extendApi: [createVueApi()],
  layout: {
    ErrorInfo: ({ type }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>Error: {type}</span>
    ),
  },
});
```

The list of all plugins is available via [NPM](https://www.npmjs.com/search?q=keywords:piral).

Next we will see how we can define the user experience by setting up the whole look and feel of Piral.

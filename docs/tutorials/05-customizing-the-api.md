---
title: Customizing the API
description: Learn how to extend and customize the Pilet API.
audience: Developers
level: Intermediate
---

# Customizing the Pilet API

Turning back to the Piral instance we can determine how the Pilet API looks like. By default, the Pilet API is already extensive and well-suited for many use cases. Nevertheless, we may need to add another useful API to give our pilets the right set of capabilities.

Let's start by looking at how we scaffolded the Piral instance.

## Standard Scaffolding Approach

The code that has been generated in the getting started section was similar to the following:

```jsx
import * as React from 'react';
import { renderInstance, buildLayout } from 'piral';

renderInstance({
  layout: buildLayout()
    .withError(({ type }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>Error: {type}</span>
    )),
});

export * from 'piral/lib/types';
```

This starts rendering a full Piral instance in the `#app` element of the DOM constructed by the *index.html*. While the scaffolding only starts with a *minimal* layout, it does not change anything regarding the Pilet API.

We can also modify it to the following:

```jsx
import * as React from 'react';
import { renderInstance, buildLayout, extendApis } from 'piral';

renderInstance({
  config: {
    extendApi: extendApis([]),
  },
  layout: buildLayout()
    .withError(({ type }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>Error: {type}</span>
    )),
});

export * from 'piral/lib/types';
```

In this case we added a configuration that determines how to extend the provided (Pilet) API. There are multiple helpers to support us here, but in the case above we choose the `extendApis` function, which should be the right one in most cases.

## Extending Existing APIs

The `extendApis` function accepts an array that contains all the API creator functions. An API creator function has the following signature:

```ts
interface ApiCreatorSignature<TApi> {
  (api: PiletApi, target: PiletModule): TApi;
}
```

An example for such a function may be the following:

```ts
function createTrackingApi(api: PiletApi) {
  return {
    trackEvent(name) {
      // ...
    },
  };
}
```

It could be used in the configuration by referencing the function in the array:

```ts
extendApis([createTrackingApi])
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
import { renderInstance, buildLayout, extendApis } from 'piral';
import { createVueApi } from 'piral-vue';

renderInstance({
  config: {
    extendApi: extendApis([createVueApi]),
  },
  layout: buildLayout()
    .withError(({ type }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>Error: {type}</span>
    )),
});

export * from 'piral/lib/types';
```

The list of all plugins is available via [NPM](https://www.npmjs.com/search?q=keywords:piral).

## Removing Existing APIs

In most cases we only want to bring in additional APIs, however, in rare scenarios we are also interested in removing existing functionality from the Pilet API. Here the default signature for the `extendApi` property gets helpful. It provides the full flexibility.

```jsx
import * as React from 'react';
import { renderInstance } from 'piral';

renderInstance({
  config: {
    extendApi(api) {
      // removes all APIs - just returns an empty object
      return {};
    },
  },
  layout: // ...
});
```

Emptying the full API is quite simple - we just return an empty object. We may also use the JavaScript spread operator to remove selected parts:

```jsx
import * as React from 'react';
import { renderInstance } from 'piral';

renderInstance({
  config: {
    extendApi(api) {
      // remove registerTile and registerSearch
      const { registerTile: _0, registerSearch: _1, ...newApi } = api;
      return newApi;
    },
  },
  layout: // ...
});
```

Obviously, using this approach we can still add (or re-declare) functionality.

Next we will see how we can define the user experience by setting up the whole look and feel of Piral.

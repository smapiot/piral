---
title: Layout Components
description: Defining the error and layout components in a Piral instance.
section: Customization
---

# Layout Components

In Piral micro frontends can define (i.e., "register") components to be used in different situations freely. This is great for many scenarios, but usually does not help with general layouting - as layouting quite often demands very specific components to be placed on very specific positions.

To help with general layouting Piral allows developers to define everything related to the general layout of the application in the app shell itself. Note, that this can still be delegated to pilets.

## State Container

The layouting components are all placed in the state container below `components`. So, in order to register your own components you just need to either manipulate (i.e., *dispatch*) the state container or start with the desired initial state.

```js
import { createInstance } from 'piral-core';

const instance = createInstance({
  state: {
    components: {
      // put your layout components here
    },
  },
  // ... define more options
});

// ... use instance
```

Alternativeley, registration of layout components can be done via the `SetComponent` component, e.g.,

```jsx
<Piral instance={instance}>
  <SetComponent name="LoadingIndicator" component={Spinner} />
</Piral>
```

Coming with `piral-core` already there are just a few layout components you'd need to consider:

- `LoadingIndicator` if you want to add your own loading spinner when the application or sub-parts are loading (recommended)
- `Layout` to give your application an overall layout, e.g., define how it looks and where the (page's) content should go (recommended)

A few optional choices are in here, too, such as:

- `ErrorInfo` if you want to override the overall error display component (usually you'd want to delegate this to individual error components, see [./C02-errors.md](Error Handling))
- `Router` if you want to define your own `Router`, e.g., for using a `HashRouter` instead of a `BrowserRouter`
- `RouteSwitch` if you want or need to overwrite the standard `Switch` setting up the individual routes

In addition, plugins may bring in additional layouting needs. Every plugin that requires some layouting is strongly encouraged to use the `components` section of the state container.

## Extensibility

As an example, this is what the `piral-dashboard` plugin does:

```ts
declare module 'piral-core/lib/types/custom' {
  interface PiralCustomComponentsState {
    DashboardContainer: ComponentType<DashboardContainerProps>;
    DashboardTile: ComponentType<DashboardTileProps>;
  }
}
```

Since the `piral-dashboard` plugin does not want to be biased regarding the actual display of the dashboard container and its tiles it allows the developer to set these components.

As a plugin author we encourage you to register default values for these layouting components.

Example:

```ts
context.dispatch(state => ({
  ...state,
  components: {
      DashboardTile: DefaultTile,
      DashboardContainer: DefaultContainer,
    ...state.components,
  },
}));
```

The important part is that `state.components` should be able to override your layouting components. This way if the respective layouting components have already been defined (e.g., in the app shell) they won't be overwritten.

The components itself should be always obtained via the `getPiralComponent` helper from `piral-core`. In the previous example that would be:

```js
import { getPiralComponent } from 'piral-core';

const PiralDashboardContainer = getPiralComponent('DashboardContainer');
const PiralDashboardTile = getPiralComponent('DashboardTile');
```

This way, nothing (`null`) would be rendered if the component is not yet part of the state container. Furthermore, the binding to the component would be "live" or "reactive", i.e., if - at a later point in time - a new / different component would be registered then any rendering would be immediately updated.

In any case using `getPiralComponent` you'd get a component a that can be used immediately.

## Exposing Layouting to Pilets

By default, the state container incl. the layouting part is not exposed to pilets. This is for a lot of reasons, but presumably you'll not care about those reasons and actually want to distribute your layout to pilets.

While there are downsides to this approach (e.g., the layout pilet(s) would be required during development of a new pilet) the upside is that (parts of) the layout could be updated independently of the main application. This can also be very helpful with white-labelling.

The easiest way to expose the layouting capability to pilets is to create a new API for this:

```ts
import { ComponentType } from 'react';
import { AnyComponent, ComponentsState, PiralPlugin, withApi } from 'piral-core';

type GenericComponents<T> = Partial<
  {
    [P in keyof T]: T[P] extends ComponentType<infer C> ? AnyComponent<C> : T[P];
  }
>;

interface LayoutingApi {
  setLayout(components: GenericComponents<ComponentsState>): void;
}

function createLayoutingApi(): PiralPlugin<LayoutingApi> {
  return (context) => (api) => ({
    setLayout(newComponents) {
      context.dispatch((state) => {
        const components = {
          ...state.components,
        };

        for (const name of Object.keys(newComponents)) {
          components[name] = withApi(context, newComponents[name], api, 'unknown');
        }

        return {
          ...state,
          components,
        };
      });
    },
  });
}
```

which is then added to the `plugins` array in the instance creation options. As an example, this could look like:

```ts
const instance = createInstance({
  plugins: [createLayoutingApi()]; // and other plugins you want to use
  state: {
    // ... define initial state
  },
  // ... rest
});
```

In any case don't forget to merge the created `LayoutingApi` into the types, specifically the pilet API:

```ts
declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends LayoutingApi {}
}
```

Now this can be used in pilets such as:

```ts
import { PiletApi } from '<my-shell>';
import { MyLoadingIndicator } from './components';

export function setup(api: PiletApi) {
  api.setLayout({
    LoadingIndicator: MyLoadingIndicator,
  });
}
```

Another benefit of distributing the layout is that you can now easily define parts of the layout from other frameworks, e.g., if the `MyLoadingIndicator` is actually an Angular component you could do something like:

```ts
import { PiletApi } from '<my-shell>';
import { MyLoadingIndicator } from './components';

export function setup(api: PiletApi) {
  api.setLayout({
    LoadingIndicator: api.fromNg(MyLoadingIndicator),
  });
}
```

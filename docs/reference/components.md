---
title: Components
---

# Layout and Error Components

Some functionality of Piral actually is related to rendering a component on the screen. For instance, in order for `piral-notifications` to work as expected there has to be a notification host rendered in the DOM with each notification being a child of this host component.

## Layout Components

Layout components are UI fragments that are used to provide the right UI context or ensure that rendering of microfrontend components are done at the right locations. In general, these components form the "outer" layout of the application, while the whole "inner" layout it pretty much determined only by the pilets.

The outer layout is driven by technical and design considerations, while the inner layout will be driven by domain-specific and user experience considerations. As an example, the outer layout would define where the menu and the content are placed, how the menu works, and how modal dialogs will be rendered. The inner layout would actually fill the menu with items, present the actual content of the pages, and declare the contents of these modal dialogs.

With `piral-core` the following layout components are defined:

- `LoadingIndicator`: will be shown in loading scenarios, e.g., when the app is initialized or when a page is loaded
- `ErrorInfo`: will be shown in case of an error, actually being the carrier component of a specific error component (see next section)
- `Router`: is a technical component that provides the routing capabilities
- `Layout`: is the component wrapping the whole application with a given design
- `Debug`: will be shown on every page for potential debug purposes

Furthermore, plugins may extend the `PiralCustomComponentsState` type to add their own layout components. For instance, the `piral-dashboard` plugin brings two layout components `DashboardContainer` and `DashboardTile`, which define how the dashboard container (hosting all tiles) and how a single tile look like. That way, the component registered via `registerTile` only needs to take care of a tile's content, without having to know or handle the outer layout.

Registration of layout components can be done via the `SetComponent` component, e.g.,

```jsx
<Piral instance={instance}>
  <SetComponent name="LoadingIndicator" component={Spinner} />
</Piral>
```

or directly when initializing the instance:

```jsx
const instance = createInstance({
  state: {
    components: {
      LoadingIndicator: Spinner,
    },
  },
  // ...
});
```

## Error Components

Error components are UI fragments that are used to fill space in case of errors. With `piral-core` the following error components can be defined:

- `extension`: will be shown in place of an extension that errors out
- `loading`: will be shown in place of the application when loading fails
- `page`: will be shown in place of the page when it errors out
- `not_found`: will be shown in place of a page when the route could not be resolved
- `unknown`: will be shown in place of a component that errors out

Furthermore, plugins may extend the `PiralCustomErrors` type to add their own resolutions. For instance, the `piral-dashboard` plugin brings a new error type for `tile`, which would be shown in place of a tile that errors out.

Most error components are called with an `error` prop usually of type `Error`. One exclusion to this is the `not_found` error, which does only come with props describing the current route.

Registration of error components can be done via the `SetError` component, e.g.,

```jsx
<Piral instance={instance}>
  <SetError type="not_found" component={MyNotFoundComponent} />
</Piral>
```

or directly when initializing the instance:

```jsx
const instance = createInstance({
  state: {
    errorComponents: {
      not_found: MyNotFoundComponent,
    },
  },
  // ...
});
```

---
title: Piral Layout
description: Set up the layout of your Piral instance.
audience: Developers
level: Intermediate
---

# Piral Layout Setup

So far we did not spent much time on setting up the Piral instance. In reality, a fair amount of time should be invested into setting up the Piral instance correctly. Primarily, this has nothing to do with Piral itself, but rather with standard things such as the used styling and the potential points of interaction with the user.

## Layout Basics

Coming up with a great layout is a good start for a supreme user experience. Before we start creating a large amount of pilets the application shell should be in a good shape.

Let's recap how the layout was done in the scaffolding process:

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

We use a single property called `layout`, which expects a layout builder instance. A layout builder has the following signature:

```ts
interface LayoutBuilder {
  build(): [React.ComponentType, GlobalStateOptions];
}
```

The `GlobalStateOptions` could be just an empty object. Luckily, we don't need to implement anything ourselves. Instead, we can use the `buildLayout` function to obtain a layout builder instance, which provides a fluent interface.

The fluent interface of the default layout builder contains functions such as `withLayout`, `withError`, or `withDashboard`. Since all of these functions are fluent they return the layout builder instance again. Besides the `with...` functions the default layout builder also exposed `create...` functions. These functions accept a callback as parameter, which allows using another (mini or sub) layout builder inside.

An example would be using the `createDashboard` function:

```ts
const layout = buildLayout()
  .createDashboard(dashboard => dashboard
    .container(MyDashboardContainer)
    .tile(MyDashboardTile));
```

The inner parts allow to define the different parts of the component to create. For a dashboard we have a container (exposing the potential grid or any other mean of exposing the different tiles) and its tiles. If no special styling or definition should be considered the part does not need to be defined.

So what are the `MyDashboardContainer` and `MyDashboardTile` variables? We need to define these somewhere. At the end they are just React components.

For instance, the following definitions would be totally legit:

```jsx
import { DashboardContainerProps, TileProps } from 'piral';

const MyDashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => (
  <div className="dashboard">
    <h1>My Dashboard</h1>
    <div className="dashboard-tiles">
      {children}
    </div>
  </div>
);

const MyDashboardTile: React.FC<TileProps> = ({ columns, rows, resizable, children }) => (
  <div className="tile" data-rows={rows} data-columns={columns}>
    {children}
    {resizable && <div className="tile-resizer" />}
  </div>
);
```

This will create a dashboard container with some title and a proper structure incl. some CSS classes for styling. Any React component (or way of creating React components for that matter) is valid.

Besides the component-specific props (e.g., a tile receives its currently available number of `rows` and `columns`) we also get the standard `children` prop. The children of the dashboard container are the different tiles. The tiles themselves are rendered using the dashboard tile component above, where the pilet defined part is passed in as `children`.

Now that we understand the fundamentals of the ...

## Example Layout

How does a sample layout (minus the CSS) look like?

We start with the necessary imports

```jsx
import * as React from 'react';
import { buildLayout } from 'piral';
```

then we use the default layout builder

```jsx
const layout = buildLayout()
  .withLayout(Layout)
  .withLoader(Loader)
  .createDashboard(dashboardBuilder)
  .createError(errorBuilder)
  .createMenu(menuBuilder)
  .createSearch(searchBuilder)
  .createNotifications(notificationsBuilder)
  .createModals(modalsBuilder);
```

At this point the used sub-builders and components need to be resolved.

There are some really simple components in there, e.g., the `Loader` may look like

```jsx
const Loader = () => (
  <div className="v-center h-center">
    <div className="loading-spinner">
      Loading ...
    </div>
  </div>
);
```

and more complicated ones such as the full `Layout` itself.

```jsx
const Layout = ({
  Menu,
  Notifications,
  Search,
  Modals,
  selectedLanguage,
  children,
}) => (
  <div className="app-container">
    <div className="app-menu">
      <div className="app-menu-content">
        <Menu type="general" />
        <Menu type="admin" />
      </div>
    </div>
    <Notifications />
    <Modals />
    <div className="app-header">
      <div className="app-title">
        <h1>Sample Layout ({selectedLanguage})</h1>
      </div>
      <Search />
      <Menu type="header" />
    </div>
    <div className="app-content">
      {children}
    </div>
    <div className="app-footer">
      <Menu type="footer" />
    </div>
  </div>
);
```

Here some of the given props are standard values such as the chosen language (which changes when the currently selected language changes) or the currently displayed content (`children`). Other props refer to Piral internal components that may consist of user-defined components, such as the `Menu` or `Search`.

The sub-builders work like the dashboard example above. In case of the `menuBuilder` we can define it like:

```jsx
const menuBuilder = menu =>
  menu
    .container(({ children }) => (
      <div className="menu">
        {children}
      </div>
    ))
    .item(({ children }) => (
      <div className="menu-item">
        {children}
      </div>
    ));
```

For the full example look at the [sample Piral instance layout definition](https://github.com/smapiot/piral/blob/master/src/samples/sample-piral/src/layout.tsx).

## Sharing Layouts

Layouts can be shared in multiple ways. The Piral independent way is a simple NPM package that contains all components necessary for creating the layout. Alternatively, it could be contained in the same packages as, e.g., a pattern library anyway.

Additionally, the layout can already be shared in a package that comes with a **peer dependency** to `piral`. In such a package we could expose a whole layout builder instance, such as the one shown in the example layout section.

In the next tutorial we review the standard development cycle of a Piral instance and its associated pilets.

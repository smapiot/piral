---
title: Piral Layout
description: Set up the layout of your Piral instance.
audience: Developers
level: Intermediate
---

# Piral Layout Setup

So far we did not spent much time on setting up the Piral instance. In reality, a fair amount of time should be invested into setting up the Piral instance correctly. Primarily, this has nothing to do with Piral itself, but rather with standard things such as the used styling and the potential points of interaction with the user.

## Video

We also have this tutorial available in form of a video.

@[youtube](https://youtu.be/u7XhTuf2hDQ)

## Layout Basics

Coming up with a great layout is a good start for a supreme user experience. Before we start creating a large amount of pilets the application shell should be in a good shape.

Let's recap how the layout was done in the scaffolding process:

```jsx
import * as React from 'react';
import { renderInstance } from 'piral';

renderInstance({
  layout: {
    ErrorInfo: ({ type }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>Error: {type}</span>
    ),
    DashboardContainer: MyDashboardContainer,
    DashboardTile: MyDashboardTile,
  },
});
```

We use a single property called `layout`, which expects an object with components that are used to represent various building blocks.

The components allow to define the different parts of the application for visualization. For a dashboard we have a container (exposing the potential grid or any other mean of exposing the different tiles) and its tiles. If no special styling or definition should be considered the part does not need to be defined.

So what are the `MyDashboardContainer` and `MyDashboardTile` references? We need to define these somewhere. At the end they are just React components.

For instance, the following definitions would be totally legit:

```jsx
import { DashboardContainerProps, DashboardTileProps } from 'piral';

const MyDashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => (
  <div className="dashboard">
    <h1>My Dashboard</h1>
    <div className="dashboard-tiles">
      {children}
    </div>
  </div>
);

const MyDashboardTile: React.FC<DashboardTileProps> = ({ columns, rows, resizable, children }) => (
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
```

then we use the default layout object to define everything that we care, e.g.,

```jsx
const layout = {
  Layout,
  LoadingIndicator,
  DashboardContainer,
  DashboardTile,
  ErrorInfo,
  MenuContainer,
  MenuItem,
  SearchResult,
  SearchInput,
  SearchContainer,
  NotificationsHost,
  NotificationsToast,
};
```

At this point the used sub-builders and components need to be resolved.

There are some really simple components in there, e.g., the `Loader` may look like

```jsx
const LoadingIndicator = () => (
  <div className="v-center h-center">
    <div className="loading-spinner">
      Loading ...
    </div>
  </div>
);
```

and more complicated ones such as the full `Layout` itself.

```jsx
import { Menu, Notifications, Modals } from 'piral';
import { Search } from 'piral-search';

const Layout = ({ children }) => (
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
        <h1>Sample Layout</h1>
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

Note that only the `children` are transported as props. For the layout the children represent the page's content. All the rest, e.g., the `Menu` we use from `piral`, which uses internally the parts we defined (e.g., the `MenuContainer`).

For the full example look at the [sample Piral instance layout definition](https://github.com/smapiot/piral/blob/master/src/samples/sample-piral/src/layout.tsx).

## Sharing Layouts

Layouts can be shared in multiple ways. The Piral independent way is a simple NPM package that contains all components necessary for creating the layout. Alternatively, it could be contained in the same packages as, e.g., a pattern library anyway.

Additionally, the layout can already be shared in a package that comes with a **peer dependency** to `piral`. In such a package we could expose a whole layout builder instance, such as the one shown in the example layout section.

In the next tutorial we review the standard development cycle of a Piral instance and its associated pilets.

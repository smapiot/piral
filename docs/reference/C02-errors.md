---
title: Error Handling
description: The error handling methods of Piral.
section: Customization
---

# Error Handling

We make sure to sandbox every pilet, such that errors in a pilet will never have a destructive influence on the whole app shell or other pilets.

When a pilet crashes we will show a certain message (i.e., component) that can be (and should be) completely customized.

## Error Components

Much like standard layout components error components are UI fragments that are used to fill space in case of errors. With `piral-core` the following error components can be defined:

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

## Types of Errors

We distinguish between a variety of errors. Currently, the following types of errors exist:

- Loading
- Extension
- Page
- Not Found

More types of errors may be added by plugins. As an example, the `piral-forms` plugin also adds the following error:

- Form

Some other ones that are fairly common (i.e., included in `piral-ext`):

- Feed
- Tile
- Menu

### Loading

The loading error appears when the loading of the app shell failed. As an example, if the pilet metadata cannot be retrieved successfully, the loading of the app shell failed (unless we handle this particular error specifically and fall back to, e.g., an empty set of pilets).

It will always be shown as a blank page, thus we can not only style it like a page we may also need to add some layout to it.

**Note**: In this layout, we should not reference internal links. The loading error page is decoupled from the standard router. Instead, we should only include functionality to restart the application and/or report the error.

*Example*: The pilet feed service is offline and the network exception is not handled in the initial request.

### Extension

The extension error appears when an extension crashes. As an example, if we crash while rendering an extension, the error is shown.

It will always be shown as the respective component containing the extension, which may be as prominent as a page or as little as a button.

*Example*: The extension receives unexpected `params` and does not handle that gracefully.

### Page

The page error appears when a page crashes. As an example, if a page emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a normal page, thus we can style it like a page.

*Example*: The page runs some invalid code.

### Not Found

The not found error appears when a page could not be found. Specifically, if a wrong URL/route is used (e.g., `/foo` when no page or custom route for `/foo` is registered) we'll see this error.

It will always be shown as a normal page, thus we can style it like a page.

*Example*: The user navigates to a page that has not been registered in the router. This could be the case when the page (i.e. link) comes from a pilet that has not been loaded.

### Feed

The feed error appears when a feed fails during loading.

It will always be shown as the respective component containing the feed, which may be as prominent as a page or as little as a menu item.

*Example*: The API responsible for connecting to the feed is down resulting in an unhandled network error.

### Tile

The tile error appears when a tile crashes. As an example, if a tile emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a tile with the current dimensions, thus we can style it like a tile.

*Example*: The tile runs some invalid code.

### Menu

The menu error appears when a menu item crashes. As an example, if a menu item emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a menu item for the given menu type, thus we can style it like a menu item.

*Example*: The menu item runs some invalid code.

### Form

The form error appears when a form fails during submission.

It will always be shown as the respective component containing the form, which may be as prominent as a page or as little as a button.

*Example*: The network is down when submitting the form resulting in an unhandled network error.

### Others

More types of errors could be added to the core, or by including a plugin. Thus we recommend always handling the "default" (or anything else) case.

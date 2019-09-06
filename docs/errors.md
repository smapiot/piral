# Error Handling

We make sure to sandbox every pilet, such that errors in a pilet will never have a destructive influence on the whole app shell or other pilets.

When a pilet crashes we will show a certain message (i.e., component) that can be (and should be) completely customized.

We distinguish between a variety of errors. Currently, the following types of errors exist:

- Loading
- Not Found
- Feed
- Form
- Page
- Tile
- Menu

## Loading

The loading error appears when loading of the app shell failed. As an example, if the pilet metadata cannot be retrieved successfully, the loading of the app shell failed (unless we handle this particular error specifically and fall back to, e.g., an empty set of pilets).

It will always be shown as a blank page, thus we can not only style it like a page we may also need to add some layout to it.

**Note**: In this layout we should not reference internal links. The loading error page is decoupled from the standard router. Instead, we should only include functionality to restart the application and / or report the error.

*Example*: The pilet feed service is offline and the network exception is not handled in the initial request.

## Not Found

The not found error appears when a page could not been found. Specifically, if a wrong URL / route is used (e.g., `/foo` when no page or custom route for `/foo` is registered) we'll see this error.

It will always be shown as a normal page, thus we can style it like a page.

*Example*: The user navigates to a page that has not been registered in the router. This could be the case when the page (i.e. link) comes from a pilet that has not been loaded.

## Feed

The feed error appears when a feed fails during loading.

It will always be shown as the respective component containing the feed, which may be as prominent as a page or as little as a menu item.

*Example*: The API responsible for connecting to the feed is down resulting in an unhandled network error.

## Form

The form error appears when a form fails during submission.

It will always be shown as the respective component containing the form, which may be as prominent as a page or as little as a button.

*Example*: The network is down when submitting the form resulting in an unhandled network error.

## Page

The page error appears when a page crashes. As an example, if a page emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a normal page, thus we can style it like a page.

*Example*: The page runs some invalid code.

## Tile

The tile error appears when a tile crashes. As an example, if a tile emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a tile with the current dimensions, thus we can style it like a tile.

*Example*: The tile runs some invalid code.

## Menu

The menu error appears when a menu item crashes. As an example, if a menu item emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a menu item for the given menu type, thus we can style it like a menu item.

*Example*: The menu item runs some invalid code.

## Others

Obviously, in future versions more types of errors could be added. Thus we recommend to always handle the "default" (or anything else) case.

[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Page Layouts](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-page-layouts.svg?style=flat)](https://www.npmjs.com/package/piral-page-layouts) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-page-layouts` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` for using different layouts on different pages.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Why and When

Sometimes you have some pages that are radically different than the usual pages/layout. For instance, while most pages in a single application should be shown with a header, footer, and navigation, a login page is usually shown without these elements (or with just some of them, e.g., the footer).

Of course, you could leave this layout to the page itself, e.g., that

```jsx
const PageA = () => (
  <>
    <Header />
    <Navigation />
    <ActualContentOfPageA />
    <Footer />
  </>
);
```

while another page is

```jsx
const PageB = () => (
  <>
    <ActualContentOfPageB />
    <Footer />
  </>
);
```

however, this is rather cumbersome and inconvient to write. If the `Footer` (or other used elements) are not globally available it may be even impossible for a page to use these artifacts. Surely, you could use an extension to transport these, but then again it would remain rather cumbersome and inconvenient to write.

A nice way out is to use this plugin, which enables the use of distributed, reusable layouts. It allows you to register a page together with its layout.

Beforehand you'd have:

```js
const PageA = () => (
  <>
    <Header />
    <Navigation />
    <ActualContentOfPageA />
    <Footer />
  </>
);

export function setup(app) {
  app.registerPage('/page-a', PageA);
}
```

Now you can write:

```js
export function setup(app) {
  app.registerPage('/page-a', ActualContentOfPageA, {
    layout: 'standard',
  });
}
```

So if the `standard` layout has been registered like so:

```js
export function setup(app) {
  app.registerPageLayout('standard', ({ children }) => (
  <>
    <Header />
    <Navigation />
    {children}
    <Footer />
  </>
));
}
```

Then it would just work. Otherwise, it will always fall back to the `default` layout, which is also the default choice for the `layout` key in the provided metadata of `registerPage`.

## Documentation

The following functions are brought to the Pilet API.

### `registerPageLayout()`

Adds the definition of a page layout to the app shell.

### `unregisterPageLayout()`

Removes a page layout from the app shell. Pages using this layout will fall back to the default layout.

## Usage

::: summary: For pilet authors

You can use the `registerPageLayout` function from the Pilet API to add a new page layout in the app shell.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { FullscreenLayout } from './FullscreenLayout';

export function setup(piral: PiletApi) {
  piral.registerPageLayout('fullscreen', FullscreenLayout);
}
```

You can use the `unregisterPageLayout` function from the Pilet API to remove a previously added page layout from the app shell.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { FullscreenLayout } from './FullscreenLayout';

export function setup(piral: PiletApi) {
  // first register a page layout
  piral.registerPageLayout('fullscreen', FullscreenLayout);
  // and unregister; maybe some time later?
  piral.unregisterPageLayout('fullscreen');
}
```

**Note**: A page layout is accessible across all pilets, however, only the pilet that has registerd a page layout can also unregister it. Once a page layout has been taken no other pilet can override it - it first needs to be unregistered.

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createPageLayoutsApi` from the `piral-page-layouts` package.

```ts
import { createPageLayoutsApi } from 'piral-page-layouts';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createPageLayoutsApi()],
  // ...
});
```

Via the options the initially available `layouts` can be defined.

Consider for example:

```ts
const instance = createInstance({
  // important part
  plugins: [createPageLayoutsApi({
    layouts: {
      default: DefaultLayout,
      empty: EmptyLayout,
    }
  })],
  // ...
});
```

Furthermore, the name of the default layout can be chosen with the `fallback` option, too. By default, the name is set to be `default`. If you want to change it to, e.g., `standard` you can do the following:

```ts
const instance = createInstance({
  // important part
  plugins: [createPageLayoutsApi({
    fallback: 'standard',
  })],
  // ...
});
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

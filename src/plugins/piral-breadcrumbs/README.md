[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Breadcrumbs](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-breadcrumbs.svg?style=flat)](https://www.npmjs.com/package/piral-breadcrumbs) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is plugin that only has a peer dependency to `piral-core`. What `piral-breadcrumbs` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

## Why and When

Many applications use breadcrumbs, which are UI indicators of the current page and its place in the page hierachy. Breadcrumbs easily allow going upwards to the root page in hierachy. The problem in a distributed system is that the relation between the pages is not centrally managed nor can it reliably be inferred.

`piral-breadcrumbs` solves this problem by introducing the possibility of registering breadcrumb information stating how the breadcrumb should appear and where to place it in the hierachy. The hierachy is loosely coupled and resilient. Missing parent links are skipped to still come up with a consistent view.

Alternatives: Get the registered pages and come up with a set of conventions and rules to build the breadcrumbs dynamically without requiring explicit registration.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/G7FJeNR-g28)

## Documentation

The following functions are brought to the Pilet API.

### `registerBreadcrumb()`

Adds the definition of a breadcrumb to the app shell. Specifies display characteristics like the title, URL, or parent breadcrumb.

If the first argument is a string a named breadcrumb is registered. A named breadcrumb can also be removed.

### `unregisterBreadcrumb()`

Removes a breadcrumb from the app shell. This requires a named breadcrumb.

## Usage

::: summary: For pilet authors

You can use the `registerBreadcrumb` function from the Pilet API to add a new breadcrumb in the app shell.

**Note**: When the first argument is a string we call it a *named* breadcrumb.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  piral.registerBreadcrumb({
    title: 'Example',
    path: '/example',
  });
}
```

You can use the `unregisterBreadcrumb` function from the Pilet API to remove a previously added breadcrumb from the app shell.

**Note**: You'll need to have added a *named* breadcrumb in order to be able to remove it.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  // first register a named breadcrumb
  piral.registerBreadcrumb('bc-id', {
    title: 'Example',
    path: '/example',
  });
  // and unregister; maybe some time later?
  piral.unregisterBreadcrumb('bc-id');
}
```

### Rendering Breadcrumbs

Within pilets, you typically _cannot_ access the `Breadcrumbs` component from the `piral-breadcrumbs`. While there are several options to work around this, the simplest is to use a built-in extension provided by Piral called `piral-breadcrumbs`:

```tsx
// Within any pilet:
return (
  <>
    <Extension name="piral-breadcrumbs" />
    {otherContent}
  </>
);
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createBreadcrumbsApi` from the `piral-breadcrumbs` package.

```ts
import { createBreadcrumbsApi } from 'piral-breadcrumbs';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createBreadcrumbsApi()],
  // ...
});
```

Via the options the initially available `breadcrumbs` can be defined.

Consider for example:

```ts
const instance = createInstance({
  // important part
  plugins: [createBreadcrumbsApi({
    breadcrumbs: [
      {
        path: '/example',
        title: 'Example',
      },
      {
        path: '/example/foo',
        title: 'Foo',
        parent: '/example',
      },
    ]
  })],
  // ...
});
```

### Rendering Breadcrumbs

From within a Piral instance, you can render the current breadcrumbs via the `Breadcrumbs` component:

```tsx
import { Breadcrumbs } from 'piral-breadcrumbs';

// Render it via:
return (
  <>
    <Breadcrumbs />
    {otherContent}
  </>
);
```

### Customizing

You can customize the breadcrumbs settings.

```ts
import type {} from 'piral-breadcrumbs';

declare module 'piral-breadcrumbs/lib/types' {
  interface PiralCustomBreadcrumbSettings {
    category?: string;
  }
}

// now registerBreadcrumb({ category: 'general' }) is strongly typed in pilets
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

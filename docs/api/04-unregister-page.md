---
title: unregisterPage
section: Core Pilet API
---

# `unregisterPage`

The `unregisterPage` function can be used to unregister a previously registered page component. The page component needs to be removed using the path that was used when registering the page.

The `unregisterPage` function requires exactly one argument:

1. The path of the page that should not longer be used for displaying that component

As an example consider:

```js
export function setup(api: PiletApi) {
  api.registerPage('/foo/bar', MyComponent, {
    prio: 'high',
    foo: 'bar',
    value: 3,
  });

  setTimeout(() => {
    api.unregisterPage('/foo/bar');
  }, 2000);
}
```

This will remove the page 2 seconds after being registered.

Alternatively, you can use the disposer that is returned when calling `registerPage`:

```js
export function setup(api: PiletApi) {
  const unregisterMyPage = api.registerPage('/foo/bar', MyComponent, {
    prio: 'high',
    foo: 'bar',
    value: 3,
  });

  setTimeout(() => {
    unregisterMyPage();
  }, 2000);
}
```

---
title: unregisterExtension
section: Core Pilet API
---

# `unregisterExtension`

The `unregisterExtension` function can be used to unregister a previously registered extension component. The extension component needs to be removed using the same extension name and component reference that was used beforehand.

The `unregisterExtension` function requires exactly two arguments:

1. The name of the extension slot to should not be used any more
2. The component that should not be rendered anymore

As an example consider:

```js
export function setup(api: PiletApi) {
  api.registerExtension('my-extension', MyComponent, {
    prio: 'high',
    foo: 'bar',
    value: 3,
  });

  setTimeout(() => {
    api.unregisterExtension('my-extension', MyComponent);
  }, 2000);
}
```

This will remove the extension 2 seconds after being registered.

Keep in mind that the reference to the component needs to be the same. The following **won't work**.

```js
export function setup(api: PiletApi) {
  api.registerExtension('my-extension', () => <MyComponent />, {
    prio: 'high',
    foo: 'bar',
    value: 3,
  });

  setTimeout(() => {
    api.unregisterExtension('my-extension', () => <MyComponent />);
  }, 2000);
}
```

Even though these would render the same, we have two anonymous functions resulting in two different references. For such cases either store the initial reference somewhere, or use the disposer that is returned from calling `registerExtension`:

```js
export function setup(api: PiletApi) {
  const unregisterMyExtension = api.registerExtension('my-extension', () => <MyComponent />, {
    prio: 'high',
    foo: 'bar',
    value: 3,
  });

  setTimeout(() => {
    unregisterMyExtension();
  }, 2000);
}
```

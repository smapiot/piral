---
title: registerExtension
section: Core Pilet API
---

# `registerExtension`

The `registerExtension` function can be used to register an extension component. An extension component will show up in extension slots (e.g., via `Extension` from the pilet API) that use the same name. The mechanism consisting of "slots" used in host components and "components" defined anywhere is fully dynamic.

The `registerExtension` function requires at least two arguments:

1. The name of the extension slot to be used
2. The component that should be rendered in case of a matching extension slot

The component can be any component, i.e., any framework can be used as long as the respective component was introduced via a converter.

The third argument allows to pass in additional metadata that is then associated with the extension component. This can be useful to actually iterate over existing extension components, e.g., to filter out or sort them before rendering.

```js
...
```

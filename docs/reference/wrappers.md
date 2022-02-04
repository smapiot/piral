---
title: Wrappers
---

# Wrappers

Wrappers allow you to target specific components with an outer shell. This outer shell even lives beyond the standard error boundary, so a wrapper will enclose the component even in the errored state.

## Types of Wrappers

There are three types of wrappers:

- specific wrappers, e.g., `page`, `tile` etc.
- the unspecific wrapper, i.e., `*`
- the default wrapper

Specific wrappers are *only* applied when a component from such a registration (e.g., `page`) is used.

Unspecific wrappers are *always* applied and *always* form the outer shell. That means that in case a specific wrapper was applied (e.g., `page`) the unspecific wrapper is still applied, with the specific one and the component being inside of it.

The default wrapper is only used in case neither a specific nor an unspecific wrapper has been set.

## Updates of Wrappers

Wrappers should not be set at arbitrary times. They should only be set when the application is initialized. The reason is that for performance reasons wrappers are not bound to their registration, which makes them hard-wired to the component.

The rule of thumb is to define a wrapper once (e.g., in the initial state container) and never touch it again.

The wrapper is already applied when a component is registered, so changing the wrapper later involves re-registration of all components.

## Defining Wrappers

Wrappers are set in the state container, e.g.:

```js
const instance = createInstance({
  //...
  state: {
    registry: {
      wrappers: {
        '*': MyGeneralWrapper,
        page: MyPageWrapper,
      },
    },
  },
});
```

A wrapper just has to be a component receiving and rendering children. For instance, the most simple wrapper is the default wrapper:

```jsx
const DefaultWrapper = ({ children }) => <>{children}</>;
```

A wrapper receives all the props that the wrapped component receives. So, as an example, a page wrapper may do something with `meta`:

```jsx
const SomePageWrapper = ({ meta, children }) => (
  <>
    {meta.hide ? <b>This content is hidden.</b> : children}
  </>
);
```

This makes wrappers ideal to implement additional layers for page / component protection or different layouts - depending on the provided props.

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

The following snippet registers a component `MyComponent` to an extension slot called `my-extension`. It registers some metadata that is used as default input for the extension component.

```js
export function setup(api: PiletApi) {
  api.registerExtension('my-extension', MyComponent, {
    prio: 'high',
    foo: 'bar',
    value: 3,
  });
}
```

The type of `registerExtension` is defined to be:

```ts
type AnyExtensionComponent<TName> = TName extends keyof PiralExtensionSlotMap
  ? AnyComponent<ExtensionComponentProps<TName>>
  : TName extends string
  ? AnyComponent<ExtensionComponentProps<any>>
  : AnyComponent<ExtensionComponentProps<TName>>;

type ExtensionParams<TName> = TName extends keyof PiralExtensionSlotMap
  ? PiralExtensionSlotMap[TName]
  : TName extends string
  ? any
  : TName;

type RegistrationDisposer = () => void;

/**
 * Registers an extension component with a predefined extension component.
 * The name must refer to the extension slot.
 * @param name The global name of the extension slot.
 * @param Component The component to be rendered.
 * @param defaults Optionally, sets the default values for the expected data.
 */
type registerExtension<TName> = (
  name: TName extends string ? TName : string,
  Component: AnyExtensionComponent<TName>,
  defaults?: Partial<ExtensionParams<TName>>,
) => RegistrationDisposer;
```

Quite often you want these extension components to be lazy loaded. This way, you preserve precious bandwidth when your pilet (or application in general) loads. For React, this can be done with `lazy` and `import`:

```js
const MyComponent = React.lazy(() => import('./MyComponent'));

export function setup(api: PiletApi) {
  api.registerExtension('my-extension', MyComponent, {
    prio: 'high',
    foo: 'bar',
    value: 3,
  });
}
```

Keep in mind that the `MyComponent` module needs to have a `default` export for this to work. It might look like this:

```jsx
import * as React from 'react';

export default () => {
  // some code
  return (
    <div>
      This is my extension component
    </div>
  )
};
```

The extension component itself gets the pilet API from the current pilet via a prop called `piral`. The parameters that are inserted into the extension slot are transported in the `params` prop. This way, there won't be a conflict with other names chosen for the parameters.

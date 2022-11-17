---
title: registerPage
section: Core Pilet API
---

# `registerPage`

The `registerPage` function can be used to register a component that should be shown when a certain URL is used. There can always be just one component be shown for a page.

The `registerPage` function requires at least two arguments:

1. The path of the page to be used (e.g., `/foo`), where the `path-to-regexp` syntax rules are used
2. The component that should be rendered in case of a matching URL

The component can be any component, i.e., any framework can be used as long as the respective component was introduced via a converter.

::: tip: Path rules
The path rules contain named parameters (starting with a colon, e.g., `:foo` like `/page/:foo`) and unnamed parameters (`.*`). Parameters can also be made optional using a question mark (e.g., `:foo?` would optionally match that segment). All rules can be found on [the `path-to-regexp` GitHub repo](https://github.com/pillarjs/path-to-regexp). You can also [try a route tester](https://pshrmn.github.io/route-tester/#/) to derive suitable routes.
:::

The third argument allows to pass in additional metadata that is then associated with the page component. This can be useful to actually make decisions, e.g., on the used layout, for a given page.

The following snippet registers a page rendering `MyComponent` located at `/foo/page`. It registers some metadata that is used as default input for the page component.

```js
export function setup(api: PiletApi) {
  api.registerPage('/foo/page', MyComponent, {
    prio: 'high',
    foo: 'bar',
    value: 3,
  });
}
```

The type of `registerPage` is defined to be:

```ts
type AnyComponent<T> = React.ComponentType<T> | FirstParametersOf<ComponentConverters<T>>;

interface PiralPageMeta extends PiralCustomPageMeta {};

type RegistrationDisposer = () => void;

/**
 * Registers a route for predefined page component.
 * The route needs to be unique and can contain params.
 * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
 * @param route The route to register.
 * @param Component The component to render the page.
 * @param meta The optional metadata to use.
 */
type registerPage = (
  path: string,
  Component: AnyComponent<PageComponentProps>,
  meta?: PiralPageMeta,
) => RegistrationDisposer;
```

Quite often you want these page components to be lazy loaded. This way, you preserve precious bandwidth when your pilet (or application in general) loads. For React, this can be done with `lazy` and `import`:

```js
const MyComponent = React.lazy(() => import('./MyComponent'));

export function setup(api: PiletApi) {
  api.registerPage('/foo/page', MyComponent, {
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
      This is my page component
    </div>
  )
};
```

The page component itself gets the pilet API from the current pilet via a prop called `piral`. The defined meta properties are transported in the `meta` prop. This way, there won't be a conflict with the general props like `piral` or route props like `match`, `history`, or `location`.

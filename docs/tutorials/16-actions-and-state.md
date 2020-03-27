---
title: Actions and State
description: How to use existing and new actions to manipulate the state.
audience: Architects, Developers
level: Proficient
---

# Actions and State

Piral comes with an integrated state management system: a state container. The state container can be changed using actions, which can be also defined.

In general the flow follows the standard flux architecture:

1. Rendering couples to a state
2. An action is invoked
3. The action dispatches a state change
4. The view is updated, we are effectively back where we started

Piral controls this whole mechanism with hooks even though you can also use the whole state management without.

## Video

We also have this tutorial available in form of a video.

@[youtube](https://youtu.be/Mr-pVfZUry8)

## Available Methods and Hooks

Inside a React component that is rendered from your Piral instance you'll have the following options.

For connecting to the global state we recommend using the `useGlobalState` hook. This comes with the ability to select what should be checked for changes.

```jsx
import { useGlobalState } from 'piral';

const AppLoadingIndicator = () => {
  const loading = useGlobalState(m => m.app.loading);
  return loading ? <div><b>Loading</b></div> : <div>Not loading</div>;
};
```

**Remark**: It makes sense to only select the absolut minimum. Otherwise too many (unnecessary) re-renders may have a negative performance impact.

Alternatively, you can always read the state from the global state context.

```ts
function readState(ctx: GlobalStateContext) {
  const loading = ctx.readState(m => m.app.loading);
  // ...
}
```

The `readState` method is an action. The global state context has all actions also as methods. Furthermore, these actions may be used via hooks:

```jsx
import { useAction } from 'piral';

const AppLoadingIndicator = () => {
  const readState = useAction('readState');
  const loading = readState(m => m.app.loading);
  // ...
};
```

**Remark**: While the version above seems to be equivalent to the initial version using the `useGlobalState` hook it is not. `readState` works only *once*, while `useGlobalState` is connected and thus will *update* on changes. The method above would only update when `readState` changes, not when the read state changed.

If multiple actions are required the `useActions` hook may be helpful.

```jsx
import { useActions } from 'piral';

const AppLoadingIndicator = () => {
  const { readState, dispatch } = useActions();
  const loading = readState(m => m.app.loading);

  if (!loading) {
    dispatch(state => ({
      ...state,
      app: {
        ...state.app,
        loading: true,
      },
    }));
  }

  // ...
};
```

This hook will return *all* available actions as an object. We can use object destructoring (as seen above) to provide an easy way of accessing the interesting actions.

## Custom Actions

We've already introduced the `dispatch` action, which can be used to issue a new state container change. Additionally, the `readState` action gives us back the current state snapshot.

How can we set up additional actions? It turns out: there is an action for that!

```ts
import { createInstance } from 'piral';
const { context } = createInstance();

// ...

function setAppLoading(ctx: GlobalStateContext) {
  ctx.dispatch(state => ({
    ...state,
    app: {
      ...state.app,
      loading: true,
    },
  }));
}

context.defineAction('setAppLoading', setAppLoading);
```

Besides the `defineAction` action there is also `defineActions`, which also allows us to remove redundancies like the name:

```ts
import { createInstance } from 'piral';
const { context } = createInstance();

// ...

function setAppLoading(ctx: GlobalStateContext) {
  ctx.dispatch(state => ({
    ...state,
    app: {
      ...state.app,
      loading: true,
    },
  }));
}

context.defineActions({
  setAppLoading,
});
```

If we already know the action at time of Piral instance creation we can supply it directly:

```ts
import { createInstance } from 'piral';

function setAppLoading(ctx: GlobalStateContext) {
  ctx.dispatch(state => ({
    ...state,
    app: {
      ...state.app,
      loading: true,
    },
  }));
}

const instance = createInstance({
  actions: {
    setAppLoading,
  },
});
```

**Remark**: The first argument of our custom action will always be the `GlobalStateContext`. This will be bound by Piral, such that no explicit handover is required.

As a result our action can be used as follows:

```jsx
import { useAction } from 'piral';

const AppLoadingIndicator = () => {
  const setAppLoading = useAction('setAppLoading');
  setAppLoading();
  // ...
};
```

Doing this in TypeScript will presumably result in a type error.

## Setting Up the Types

All actions and modifications to the state container layout have to be declared explicitly. The declaration is done via interface merging.

If we want to add custom actions we need to append another method to the `PiralCustomActions` interface.

In practice, this could look as follows:

```ts
import 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiralCustomActions {
    setAppLoading(): void;
  }
}
```

The same technique applies when the global state container should get another entry. Let's assume we want to add a field `myValue`, which will be a `string`.

```ts
import 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiralCustomState {
    myValue: string;
  }
}
```

The `PiralCustomState` interface is the top-level of the state.

## Conclusion

Custom actions and state management is simple in Piral. The most important actions are `dispatch` and `defineActions`. The `useGlobalState` and `useAction` hooks may be used to connect to the state container or obtain some action in a React component.

In the next tutorial we'll have a look on how to use events to communicate between pilets, or distribute information from the Piral instance.

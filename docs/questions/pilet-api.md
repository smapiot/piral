---
title: Pilet API Questions
---

# Pilet API

## What is the createConnector?

The `createConnector` function creates a so called "data feed connector". This is a simple HOC allowing you to separate data handling from rendering. The simplest case is a one-time HTTP call:

```jsx
const connect = createConnector(() =>
  fetch('https://jsonplaceholder.com/api/posts').then(res => res.json()));
const Page = connect(({ data }) => (
  <ul>
    {data.map(item => (
      <li key={item.id}>{item.title}</li>
    ))}
  </ul>
));
```

The HOC injects a prop called `data` holding the result of the promise. The promise is lazy loaded - only when the component needs to be rendered.

---------------------------------------

## How to update the createConnector?

The `createConnector` function also accepts an object for creating a data feed connector. This object declares the three sections:

- `initialize` when the data should be first gathered (usually an HTTP request)
- `connect` to start listening for data changes (usually an active WebSocket connection)
- `update` to set how the data change should affect the current data state

All in all this can be thought of as an implicit / already created reducer.

```ts
const connect = createConnector({
  initialize() {
    // initially we fetch the data via HTTP
    return fetch('https://example.com/data').then(res => res.json());
  },
  connect(cb) {
    // for the live updates we use a WebSocket connection
    const ws = new WebSocket('wss://example.com/connect');
    // once we receive a message we call the callback
    ws.onmessage = ev => cb(JSON.parse(ev.data));
    // disposer to close WebSocket when no longer needed
    return () => ws.close();
  },
  update(currentData, updatedItem) {
    // simplification: assume only changed items
    return currentData.map(item => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }

      return item;
    });
  },
});
```

The HOC is unaffected by this. Once the data updates the view is re-rendered.

---------------------------------------

## How to get shared with updates?

The `getData` API is used to get the *current* snapshot of a shared data item. In order to avoid race conditions and to stay up to date we recommend a dual approach, where the `store-data` event is used for being informed about updates, while initializing the state via `getData`.

In React this could be achieved via the `useState` and `useEffect` hooks:

```jsx
function useSharedData(name) {
  const [state, setState] = React.useState(() => api.getData(name));
  React.useEffect(() => {
    const handler = (e) => {
      if (e.name === name) {
        setState(e.value);
      }
    };
    api.on('store-data', handler);
    return api.off('store-data', handler);
  }, []);
  return state;
}
```

This will always have the right value:

```jsx
const ShowCurrent = () => {
  const username = useSharedData('username');
  return <b>{username}</b>;
};
```

---------------------------------------

## What's a good place for customizations?

Let's say you have a customization for `piral-menu`:

```ts
import 'piral-menu';

declare module 'piral-menu/lib/types' {
  interface PiralCustomMenuTypes {
    'left-footer': 'left-footer';
  }
}
```

A good place for this would be either the *index.tsx* of your app shell, or some reachable file from this module, e.g., a *types.ts* that contains your shared types.

The *.d.ts* that is generated for the pilets should pick up the typings as long as they are well reachable within your application.

---------------------------------------

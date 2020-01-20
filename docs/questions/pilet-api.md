# Pilet API

## What is the createConnector?

The `createConnector` function creates a so called "data feed connector". This is a simple HOC allowing you to separate data handling from rendering. The simplest case is a one-time HTTP call:

```ts
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

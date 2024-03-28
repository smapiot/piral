[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Feeds](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-feeds.svg?style=flat)](https://www.npmjs.com/package/piral-feeds) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-feeds` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Why and When

A standard scenario that needs to be covered by most applications is:

1. Don't load data in the beginning, but just when a component requiring this data should be shown
2. When the component should be shown read data from the backend - in the meantime showing a loading spinner
3. When data was received from backend actually show the component with the provided data
4. When data was updated (e.g., by having a `WebSocket` connection to the backend) the shown component updates its information, data
5. When data was manipulated (e.g., by submitting a `PUT` or `POST` to the backend) the data is updated, too and the shown component updates

Quite often, this simple scenario involves quite some code and ceremony to be reliable. The whole scenario (lazy load of data, update management on the data) is what call a "data feed" or short "feed" (not to confuse with Pilet Feed service, which is the service provisioning the pilets).

`piral-feeds` is an abstraction over the state management. The abstraction is exposed to be used by pilets with the pilet API. It allows creating a connector that returns a higher-order component capable of connecting any React (view) component to the data management.

Alternatives: Expose your own state management solution to the pilets such that they can work directly on it. Or leave it to pilets to manage lazy loading and state management on their own.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/eW5EGlTDaec)

## Documentation

The following functions are brought to the Pilet API.

### `createConnector`

Creates a new feed connector, which is an abstraction over a state container driven by the typical lifecycle of a data feed connection.

Returns a higher-order component for providing a `data` prop that reflects the current feed data.

## Usage

::: summary: For pilet authors

You can use the `createConnector` function from the Pilet API to create a global container managed data feed inside the Piral instance.

There are two kind of calls. The simple variant just uses a callback to populate the data via a lazy loading mechanism.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { Page } from './Page';

export function setup(piral: PiletApi) {
  const connect = createConnector(() => fetch('http://example.com').then(res => res.json()));
  piral.registerPage('/sample', connect(Page));
}
```

The most powerful variant declares three different sections:

1. `initialize` to declare how data should be loaded initially (e.g., by loading from some API) *required*
2. `connect` to define how updates of the data should be retrieved (e.g., via a WebSocket connection) *optional*
3. `update` to handle the patching of data (e.g., combining the current data with the data retrieved from a WebSocket connection) *optional*

If you specify `connect` we recommend to also define `update`.

Example use:

```jsx
import { PiletApi } from '<name-of-piral-instance>';
import { Page } from './Page';

export function setup(piral) {
  const connect = createConnector({
    initialize() {
      return fetch('http://example.com').then(res => res.json());
    },
    connect(cb) {
      const ws = new WebSocket();
      ws.onmessage = e => cb(JSON.parse(e.data));
      return () => ws.close();
    },
    update(data, item) {
      return [...data, item];
    },
  });
  piral.registerPage('/sample', connect(({ data }) => <Page items={data} />));
}
```

Calling `createConnector` returns a higher-order component that injects a new prop called `data` into the component.

Furthermore two more options are available:

- **`immediately`** optionally avoids lazy loading and fetches the data immediately.
- **`reducers`** allows to extend the HOC with some actions triggering the provided reducer functions.

The latter can be used like in the following example:

```jsx
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const connect = piral.createConnector({
    initialize() {
      return Promise.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    },
    update(data: Array<number>) {
      return data;
    },
    reducers: {
      shuffle(data) {
        return data.slice().sort(() => Math.random() - 0.5);
      },
    },
  });

  piral.registerPage(
    "/sample",
    connect(({ data }) => (
      <>
        <ul>
          {data.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <button onClick={connect.shuffle}>Shuffle</button>
      </>
    ))
  );
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createFeedsApi` from the `piral-feeds` package.

```ts
import { createFeedsApi } from 'piral-feeds';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createFeedsApi()],
  // ...
});
```

There are no options available.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

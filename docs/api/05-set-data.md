---
title: setData
section: Core Pilet API
---

# `setData`

The `setData` function can be used to store some data globally. This data can be accessed from any other pilet, but can only be changed by the current pilet. The reference is established by providing a name together with the value.

The `setData` function requires at least two arguments:

1. The name of the data to be stored
2. The actual value of the data to be stored

Optionally, a third argument can be provided, which can set further options for storing the data. The options are either a string denoting the location of the data (`memory`, `local`, `remote`) or an object that contains the location of the data, as well as an expiration time.

When the `setData` function is called an event is emitted to notify subscribers about a change in data.

The following snippet stores the number `42` in a key `foo`.

```js
export function setup(api: PiletApi) {
  api.setData('foo', 42);
}
```

The type of `setData` is defined to be:

```ts
interface CustomDataStoreOptions {
  /**
   * The target data store. By default the data is only stored in memory.
   */
  target?: DataStoreTarget;
  /**
   * Optionally determines when the data expires.
   */
  expires?: 'never' | Date | number;
}

type DataStoreOptions = DataStoreTarget | CustomDataStoreOptions;

interface SharedData<TValue = any> {
  /**
   * Access a shared value by its name.
   */
  readonly [key: string]: TValue;
}

/**
 * Sets the data using a given name. The name needs to be used exclusively by the current pilet.
 * Using the name occupied by another pilet will result in no change.
 * @param name The name of the data to store.
 * @param value The value of the data to store.
 * @param options The optional configuration for storing this piece of data.
 * @returns True if the data could be set, otherwise false.
 */
type setData<TKey extends string> = (name: TKey, value: SharedData[TKey], options?: DataStoreOptions) => boolean;
```

When data is set an event with name `store-data` is emitted. The event arguments are:

```ts
interface StoreDataEvent {
  name: string;
  target: string;
  value: any;
  owner: string;
  expires: number;
}
```

Another pilet may listen for this:

```js
export function setup(api: PiletApi) {
  api.on('store-data', ({ name, value }) => {
    if (name === 'foo') {
      console.log('new value of "foo" is', value);
    }
  })
}
```

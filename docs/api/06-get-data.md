---
title: getData
section: Core Pilet API
---

# `getData`

The `getData` function can be used to retrieve some data globally. This data can be accessed from any other pilet, but can only be changed by the owner (pilet) that first stored that data.

The `getData` function requires one argument:

1. The name of the data to be retrieved

Together with the `getData` function, which retrieves the data at time of calling, an event is emitted whenever the value of the data changes.

The following snippet retrieves the current stored value of some data named `foo`.

```js
export function setup(api: PiletApi) {
  const value = api.getData('foo');
  console.log('Current value of "foo" is', value);
}
```

The type of `getData` is defined to be:

```ts
interface SharedData<TValue = any> {
  /**
   * Access a shared value by its name.
   */
  readonly [key: string]: TValue;
}

/**
 * Gets a shared data value.
 * @param name The name of the data to retrieve.
 */
type getData<TKey extends string> = (name: TKey) => SharedData[TKey];
```

When data is changed an event with name `store-data` is emitted. The event arguments are:

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

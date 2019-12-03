[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Tracking](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-tracking.svg?style=flat)](https://www.npmjs.com/package/piral-tracking) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-tracking` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes the `track...` APIs to be used in pilets for using a set of analytics, telemetry, and tracking tools from your Piral instance.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `trackEvent()`

Tracks a custom event incl. properties and other standard metrics.

### `trackError()`

Tracks an error or exceptional behavior incl. properties.

### `trackFrame()`

Starts a tracking frame. The frame can be ended via the returned callback.

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createTrackingApi` from the `piral-tracking` package.

```tsx
import { createTrackingApi } from 'piral-tracking';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createTrackingApi()],
  // ...
});
```

There are no options available.

## Events

The extension gives the core a set of new events to be listened to:

- `track-event`
- `track-error`
- `track-frame-start` and `track-frame-end`

The events are fully typed.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

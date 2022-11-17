---
title: Debug Utilities
description: The debug utilities to allow further customizations during development.
section: Customization
---

# Debug Utilities

By default, every Piral instance comes with an integrated debug tooling package called `piral-debug-utils`. This package has two functions:

1. `installPiralDebug` to integrate the general debug tooling (most importantly the "Piral Inspector", which is a browser extension)
2. `installPiletEmulator` to integrate the micro frontend discovery provided by the `piral-cli` when running `pilet debug`

The former could also be used in non-Piral projects. This would enable any project running on `localhost` to use the Piral Inspector. The latter is essential for replacing the standard `requestPilets` method with the `/$pilet-api` route (or anything else - that is actually configurable).

## General Debug Tooling

The integration ties the Piral Inspector debug API to the current web application, essentially connecting a (potentially running) browser extension to a website.

Even without the `piral-debug-utils` package the debug API could be initiated. After all, it is exclusively using the window message API.

Sending a message that can be received by the Piral Inspector (or any other code) looks like:

```js
window.postMessage(
  {
    content: messageToSend, // e.g., { settings: {}, type: 'settings' }
    source: selfSource, // e.g., "piral-debug-api"
    version: debugApiVersion, // e.g., "v1"
  },
  '*',
);
```

Receiving a message works as:

```js
window.addEventListener('message', (event) => {
  const { source, version, content } = event.data;

  if (source !== selfSource && version === debugApiVersion) {
    switch (content.type) {
      // e.g., "init"
    }
  }
});
```

The job of the `piral-debug-utils` is to properly use this API and cover all the different message types.

## Emulator Integration

The integration usually performs (if not configured otherwise) a connection to the route `/$pilet-api` (called the *debug route*). Users can overwrite this via the `window['dbg:pilet-api']` variable.

In addition to a change of the default `requestPilets` function the integration also involves a WebSocket connection to the same address as the *debug route* (just using the `ws` protocol instead of `http`). Any incoming request will be treated like a pilet refresh.

1. If `dbg:hard-refresh` (in `sessionStorage`) is set to `on` then the page will just be reloaded
2. The incoming data is parsed and the `name` of the incoming object will be used as the pilet name
3. The routing mechanism is paused to prevent unnecessary routing during the unload / reload cycle
4. If a pilet with the given name is loaded already, it will be unloaded
5. A pilet is added using the incoming object as metadata
6. The routing mechanism is restored, any potential changes are now reflected

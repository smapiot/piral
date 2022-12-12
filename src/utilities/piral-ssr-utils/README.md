[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral SSR Utils](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-ssr-utils.svg?style=flat)](https://www.npmjs.com/package/piral-search) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a utility library that only has a peer dependency to `piral-core`.

What `piral-ssr-utils` offers are utilities that can be used for easily implementing server-side rendering of a Piral instance.

## Documentation

The utilities should be used as follows.

On the server use `renderFromServer`:

```ts
import { renderFromServer } from 'piral-ssr-utils';

async function sendIndex(_: express.Request, res: express.Response) {
  const content = await renderFromServer(<App />, {
    getPilet(url) {
      return readRemoteText(url);
    },
    getPiletsMetadata() {
      return readRemoteJson(feedUrl);
    },
    fillTemplate(body, script) {
      return `
        <!doctype html>
        <head><meta charset="utf-8"><title>React SSR Sample</title></head>
        <body>
          <div id="app">${body}</div>${script}
          <script src="index.js"></script>
        </body>
      `;
    },
  });
  res.send(content);
}
```

**Remark**: Use, e.g., the incoming request for retrieving custom pilet metadata responses (e.g., using feature flags). Otherwise, fully cache the response. Pilets can/should be cached in any case.

The provided snippet assumes that `readRemoteText` and `readRemoteJson` trigger an HTTP request with the method of your choice. While the former just returns the content of the response, the latter already parses the response body's JSON.

The given component `App` can be as simple as `<Piral />`, however, for a full alignment with the client-side a custom configuration should be used.

In any case (e.g., for the client hydration) use `configForServerRendering` when configuring your Piral instance:

```ts
import { configForServerRendering } from 'piral-ssr-utils/runtime';

const instance = createInstance(configForServerRendering({
  // ... put your normal configuration here
}));
```

For more information on using `piral-ssr-utils`, see [our sample repository](https://github.com/smapiot/sample-piral-ssr).

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

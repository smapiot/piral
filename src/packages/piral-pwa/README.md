[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral PWA](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-pwa.svg?style=flat)](https://www.npmjs.com/package/piral-pwa) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-pwa` brings to the table is a simple way to expose your application as a PWA with the capability to use offline storage for pilets, too.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `showAppNotification()`

Allows pilets to present a "native" notification. The exact looks of this are platform dependent, e.g., on Chrome for Windows 10 an item as added to the notification bar. On Chrome for MacOS X a quick notification appears.

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

In order to get your Progressive Web App correctly running you'll also need a `manifest.webmanifest` file. You can locate it next to your `index.html` file.

The content of `manifest.webmanifest` can be as simple as:

```json
{
  "name": "Example App",
  "short_name": "ExApp",
  "theme_color": "#2196f3",
  "background_color": "#2196f3",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "images/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    }
  ]
}
```

**Note**: You'll need at least a 144x144 pixels sized icon. This is not a requirement of `piral-pwa`, but rather of how PWAs work.

The `manifest.webmanifest` needs to be referenced by your `index.html` file. If both files are adjacent this can be done with the following code:

```html
<link rel="manifest" href="./manifest.webmanifest">
```

For the setup of the library itself you'll need to import `createPwaApi` from the `piral-pwa` package.

```tsx
import { createPwaApi } from 'piral-pwa';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createPwaApi()],
  // ...
});
```

## Customizing the Service Worker

By default, a service worker is generated for you. This behavior can be overridden if you place a file called `sw.js` in your `src` folder.

The server worker file is automatically enhanced with the following template variables:

- `__PARAMS__`, defines general parameters such as the `responseStrategy` or the URLs from `externals` to consider
- `__HELPERS__`, defines the `cacheMaps` for setting up the caching strategy and the `navigationPreload` property
- `__DEBUG__`, which is either `true` or `false` depending on the runtime mode

You don't need to use them, but they can be quite helpful. For instance, on `__PARAMS__`, you'll find the fields for `name` and `version` of your app.

**Remark**: How the parameters and helpers can be influenced (i.e., configured) is currently work in progress and should be figured out until v1.

## Configuration of the Provided Options

The parameters for the generated service worker can be configured, too. All in all this follows the options known from Webpack's [offline-plugin](https://github.com/NekR/offline-plugin), see [options](https://github.com/NekR/offline-plugin/blob/master/docs/options.md) for explanations.

In a nutshell, in order to use the options you'll need a file called `.pwarc` in the root directory of your application (i.e., next to your `package.json`).

The `.pwarc` may look as follows:

```js
{
  updateStrategy: 'all',
  responseStrategy: 'network-first',
  externals: ['https://api.myhost.com/logo.png', '/static/image.jpg'],
  excludes: ['**/.*', '**/*.map', '**/*.gz'],
  cacheMaps: [],
  navigationPreload: false,
  caches: 'all',
}
```

More details on the configuration will follow. Further options will be integrated soon, too.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

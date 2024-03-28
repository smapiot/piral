[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Core](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-core.svg?style=flat)](https://www.npmjs.com/package/piral-core) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is the core library that is required for any Piral instance. Plugins and pre-made layouts or templates build upon this layer. While `piral-core` is certainly opinionated the library tries to keep most options as flexible as possible.

## Documentation

For details on the provided API check out the [documentation at the Piral website](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/main/docs).

## Getting Started

Creating your own Piral app based on `piral-core` is as simple as installing `piral-core` as a dependency to your React app:

```sh
npm i piral-core
```

**Remark**: This package already includes TypeScript declarations. No need to install other packages.

You'll also need to install React and React Router, if that did not happen already:

```sh
npm i react@^18 react-dom@^18 react-router@^6 react-router-dom@^6
```

The `piral-core` package is compatible with `react@>=16.8.0`, `react-dom@>=16.8.0`, `react-router@>=5.0.0`, and `react-router-dom@>=5.0.0`.

Now you can create a new Piral instance in your code:

```jsx
import { createInstance } from 'piral-core';

const App = createInstance({
  requestPilets: () => fetch('https://feed.piral.cloud/api/v1/pilet/sample'),
});
```

**Remark**: For all available API options make sure to check out the [documentation](https://docs.piral.io).

**Note**: The feed above should only be used for demonstration purposes. Either set up your own feed (more information at [piral.cloud](https://www.piral.cloud)) or your own API/mechanism to serve the modules.

Finally, you can render this Piral instance by using the `render` function from `react-dom`:

```jsx
render((
  <App>
    {content => <Layout>{content}</Layout>}
  </App>
), document.querySelector('#app'));
```

Alternatively, you can use your new Piral instance anywhere as a component.

Your Piral app can be build with any technology that you like or already use (e.g., Webpack, Parcel, ...). If you are unsure what to you use you may fall back to `piral-cli`, which (among other things) also contains a build mechanism that *should just work* :rocket:.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

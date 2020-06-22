[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Siteless](https://piral.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/siteless.svg?style=flat)](https://www.npmjs.com/package/siteless)

`siteless` is the most painless way of building microfrontends today. All using established technologies such as React and Piral.

## Installation

`siteless` can be used on a simple website without any bundler or setup.

Just drop in the `siteless` JavaScript in an HTML file and you are done!

The script could be taken from, e.g., jsdelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/siteless/siteless.min.js"></script>
```

Then set up an inline script to call `initializePiral` handing over the only required argument: How to get your pilets!

```js
const feedUrl = 'https://feed.piral.cloud/api/v1/pilet/empty';
initializePiral(() => fetch(feedUrl).then(res => res.json()).then(res => res.items));
```

Our **CDN URLs** are (latest version):

- **unpkg**: https://unpkg.com/siteless/siteless.min.js
- **jsdelivr**: https://cdn.jsdelivr.net/npm/siteless/siteless.min.js

## Running

A full HTML file could look as follows:

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<title>My Siteless Site</title>
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/npm/siteless/siteless.min.js"></script>
<script>
const feedUrl = 'https://feed.piral.cloud/api/v1/pilet/empty';
initializePiral(() => fetch(feedUrl).then(res => res.json()).then(res => res.items));
</script>
```

## Building your First Pilet

Building your first pilet works exactly as with any other pilet in Piral.

First, initialize a new NPM project in an empty directory:

```sh
npm init pilet
```

Answer the survey question with `siteless` as your Piral instance. Now you can open your favorite IDE (e.g., for VS Code with `code .`) and start the dev server:

```sh
npm start
```

You can change the content of the `src/index.tsx` file or add new files as you like.

For instance, the file may look as follows:

```jsx
import * as React from 'react';
import { Link } from 'react-router-dom';

export function setup(app) {
  app.registerTile(() => <Link to="/my-page">My Page</Link>);

  app.registerPage('/my-page', () => (
    <>
      <h1>My First Page</h1>
      <p>This is some content ...</p>
    </>
  ));
}
```

Once you are done you can build a production version:

```sh
npm run build
```

Even better you can publish your pilet to an active pilet feed, too.

## Adding Layout

By definition, `siteless` does not impose an app shell model in the same sense that Piral does. Instead, `siteless` expects the microfrontends to be as isolated as possible. To still add layouting possibilities microfrontends can contribute layout pieces.

You can either compose from different microfrontends or use a single microfrontend to deliver all the common layout components.

## Shared Dependencies

Only the most basic dependencies are implicitly shared. There is no explicit sharing of other dependencies. If dependencies should be shared then the import maps feature of Piral should be used.

## Codesandbox

We've created a small codesandbox to allow you to play around with the concepts quite easily.

[![Edit Siteless Starter](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/siteless-starter-is6nx?fontsize=14&hidenavigation=1&theme=dark)

## License

`siteless` is released using the MIT license. For more information see the [license file](./LICENSE).

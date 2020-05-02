[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Siteless](https://piral.io) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/siteless.svg?style=flat)](https://www.npmjs.com/package/siteless)

`siteless` is the most painless way of building microfrontends today. All using established technologies such as React and Piral.

## Installation

`siteless` can be used on a simple website without any bundler or setup.

Just drop in the `siteless` JavaScript in an HTML file and you are done!

The script could be taken from **jsdelivr**:

```html
<script src="https://cdn.jsdelivr.net/npm/siteless/siteless.min.js"></script>
```

Then set up an inline script to call `initializePiral` handing over the only required argument: How to get your pilets!

```js
const feedUrl = 'https://feed.piral.cloud/api/v1/pilet/empty';
initializePiral(() => fetch(feedUrl).then(res => res.json()).then(res => res.items));
```

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

(tbd)

## Adding Layout

By definition, `siteless` does not impose an app shell model in the same sense that Piral does. Instead, `siteless` expects the microfrontends to be as isolated as possible. To still add layouting possibilities microfrontends can contribute layout pieces.

You can either compose from different microfrontends or use a single microfrontend to deliver all the common layout components.

## Shared Dependencies

Only the most basic dependencies are implicitly shared. There is no explicit sharing of other dependencies. If dependencies should be shared then the import maps feature of Piral should be used.

## Deploying

(tbd)

## License

`siteless` is released using the MIT license. For more information see the [license file](./LICENSE).

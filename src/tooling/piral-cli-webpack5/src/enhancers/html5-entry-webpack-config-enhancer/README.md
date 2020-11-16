<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# html5-entry-webpack-plugin

The `html5-entry-webpack-plugin` allows using an HTML file as an entry module. It looks for resources in the file and includes them properly.

## Getting Started

To begin, you'll need to install `html5-entry-webpack-plugin`:

```sh
npm install html5-entry-webpack-plugin --save-dev
```

Use an HTML file with all the necessary references:

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My App</title>
<link rel="stylesheet" href="./style.scss">
</head>
<body>
<div id="app"></div>
<script src="./index.tsx"></script>
</body>
</html>
```

The references to the files `index.tsx` and `style.scss` will be resolved, handled, and replaced with their outputs.

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const { resolve } = require('path');
const { Html5EntryWebpackPlugin } = require('html5-entry-webpack-plugin');

module.exports = {
  entry: {
    main: resolve(__dirname, 'src/index.html'),
  },
  plugins: [new Html5EntryWebpackPlugin()],
};
```

And run `webpack` via your preferred method. This will emit `index.html` as a file along the other files, script and style bundles.

## Options

(No options yet.)

## Contributing

Contributions in any form are appreciated and much welcome!

Just make sure to post an issue or reach out to me on [Gitter](https://gitter.im/piral-io/community) before starting actual work on anything. It really helps to avoid problems.


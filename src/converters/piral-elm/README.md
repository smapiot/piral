[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Elm](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-elm.svg?style=flat)](https://www.npmjs.com/package/piral-elm) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-elm` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core`.

The set includes an Elm converter for any component registration, as well as a `fromElm` shortcut together with a `elm-extension` web component.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `fromElm()`

Transforms a standard Elm component into a component that can be used in Piral, essentially wrapping it with a reference to the corresponding converter.

## Usage

> For authors of pilets

You can use the `fromElm` function from the Pilet API to convert your Elm components to components usable by your Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import Elm from './Page.elm';

export function setup(piral: PiletApi) {
  piral.registerPage('/sample', piral.fromElm(Elm.Page));
}
```

Within Elm components the Piral Elm extension component can be used by referring to `elm-extension`, e.g.,

```html
<elm-extension name="name-of-extension"></elm-extension>
```

## Setup and Bootstrapping

> For Piral instance developers

Using Elm with Piral is as simple as installing `piral-elm`.

```ts
import { createElmApi } from 'piral-elm';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createElmApi()],
  // ...
});
```

## Pilet Usage

The essential registration can be simplified like (e.g., for a tile):

```ts
import { PiletApi } from 'sample-piral';
import { Elm } from './Tile.elm';

export function setup(app: PiletApi) {
  app.registerTile(app.fromElm(Elm.Tile), {
    initialColumns: 2,
    initialRows: 2
  });
}
```

For the associated Elm code the following (standard) form applies:

```elm
module Tile exposing (main)

import Browser
import Html exposing (div, h1, text, Html)
import Html.Attributes exposing (attribute)

type Msg = Increment | Decrement

type alias Props =
  { columns : Int
  , rows : Int
  }

view model =
    div[] [
        h1 [] [ text "Hello, Elm! ", text (String.fromInt model.columns), text " x ", text (String.fromInt model.rows) ],
        Html.node "elm-extension" [ attribute "name" "smiley" ] []
    ]

main : Program Props Props Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \msg model -> ( model, Cmd.none )
        , subscriptions = always Sub.none
        }

init : Props -> (Props, Cmd Msg)
init flag =
    (flag, Cmd.none)
```

Either way an *elm.json* will be created in the pilet root folder. It will look similar to the following file:

```json
{
    "type": "application",
    "source-directories": [
        "src"
    ],
    "elm-version": "0.19.1",
    "dependencies": {
        "direct": {
            "elm/browser": "1.0.2",
            "elm/core": "1.0.4",
            "elm/html": "1.0.0"
        },
        "indirect": {
            "elm/json": "1.1.3",
            "elm/time": "1.0.0",
            "elm/url": "1.0.0",
            "elm/virtual-dom": "1.0.2"
        }
    },
    "test-dependencies": {
        "direct": {},
        "indirect": {}
    }
}
```

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

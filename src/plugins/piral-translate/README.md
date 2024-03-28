[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Translate](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-translate.svg?style=flat)](https://www.npmjs.com/package/piral-translate) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-translate` brings to the table is a set of Pilet API extensions that is used by `piral`. The set features a simple yet sufficient translation system.

## Why and When

One of the key non-functional requirements of many applications is to be localizable. While this area contains many parts such as potential conversion of currency, number formats etc., one elementary part is the translation of labels and text fragments. There are many solutions out there, but `piral-translate` brings a quite simplified model to the table that works in a distributed way, yet is simple and allows going from proof of concept (language snippets included in the pilets) to massive application later on (language snippets gathered from a dedicated service).

Alternatives: Use a library such as `i18next` as a shared library. Choose one that makes working with your content authors or translation team easier.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/Hh-CrOTDSnA)

## Documentation

The following functions are brought to the Pilet API.

### `translate()`

Returns the translation (i.e., a string defined for the currently selected language) of a provided language key.

Variables can also be provided using an object as the second argument. The variable replacement looks for occurrences of double curly braces, e.g., `{{foo}}`.

### `setTranslations()`

Sets the translations (custom language to key to string mapping) for the pilet.

### `getTranslations()`

Gets the translations defined in the pilet.

### `addTranslations()`

Adds a list of translations (custom language to key to string mapping) to the existing translations for the pilet.

## Usage

::: summary: For pilet authors

You can use the `setTranslations` function from the Pilet API to set predefined translation snippets.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  piral.setTranslations({
    en: {
      home: 'home',
    },
    de: {
      home: 'zuhause',
    },
  });
}
```

You can use the `getTranslations` function from the Pilet API to get the currently defined translation snippets.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const translations = piral.getTranslations();
  // received: { "en": { "home": "home" }, "de": { "home": "zuhause" }}
}
```

You can use the `translate` function from the Pilet API to obtain a translation string for a given key using the currently selected language.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  const homeStr = piral.translate('home'); // if in "de" -> "zuhause"
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createLocaleApi` from the `piral-translate` package.

```ts
import { createLocaleApi } from 'piral-translate';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createLocaleApi()],
  // ...
});
```

Via the options the available languages, translations, as well as the currently selected language can be chosen.

For example:

```ts
const localizer = setupLocalizer({
  language: 'en',
  messages: {
    en: {
      'greeting': 'Hello',
    },
    de: {
      'greeting': 'Hallo',
    },
  },
});

const instance = createInstance({
  // important part
  plugins: [createLocaleApi(localizer)],
  // ...
});
```

Alternatively, the current language can also be inferred via a function.

```ts
const localizer = setupLocalizer({
  language: getUserLocale,
  messages: {
    en: {
      'greeting': 'Hello',
    },
    de: {
      'greeting': 'Hallo',
    },
  },
});
```

The function `getUserLocale` retrieves either the cookie with name `_culture` or local storage value for key `locale`. In any case either the first found language or ultimately `en` is used as a fallback.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

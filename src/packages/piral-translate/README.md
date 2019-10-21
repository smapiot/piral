[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Translate](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-translate.svg?style=flat)](https://www.npmjs.com/package/piral-translate) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is an extension library that only has a peer dependency to `piral-core`. What `piral-translate` brings to the table is a set of API extensions that is used by `piral`. The set features a simple yet sufficient translation system.

## Documentation

For details on the provided API check out the [documentation at the Piral website](https://docs.piral.io) or [on GitHub](https://github.com/smapiot/piral/tree/master/docs).

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createLocaleApi` from the `piral-translate` package.

```tsx
import { createLocaleApi } from 'piral-translate';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createLocaleApi()],
  // ...
});
```

Via the options the available languages, translations, as well as the currently selected language can be chosen.

For example:

```tsx
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
  extendApi: [createLocaleApi(localizer)],
  // ...
});
```

Alternatively, the current language can also be inferred via a function.

```tsx
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

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

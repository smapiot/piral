[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Forms](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-forms.svg?style=flat)](https://www.npmjs.com/package/piral-forms) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-forms` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` for exposing enhanced form capabilities.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `createForm()`

Creates a new form container, which is an abstraction over a state container driven by the typical lifecycle of an input form.

Returns a higher-order component for providing the form-related props such as `error`, `submitting`, `changed`, `formData`, `setFormData()`, `submit()`, `reset()`, or `changeForm()`.

## Setup and Bootstrapping

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createFormsApi` from the `piral-forms` package.

```tsx
import { createFormsApi } from 'piral-forms';
```

The integration looks like:

```tsx
const instance = createInstance({
  // important part
  extendApi: [createFormsApi()],
  // ...
});
```

There are no options available.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

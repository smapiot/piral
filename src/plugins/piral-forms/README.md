[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Forms](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-forms.svg?style=flat)](https://www.npmjs.com/package/piral-forms) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-forms` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` for exposing enhanced form capabilities.

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Why and When

Quite often the management of forms is rather cumbersome. A form consists of multiple states, such as

1. initial data loading (may be static/empty),
2. handling of input (valid/invalid),
3. submission of forms (in flight processing)
4. (potentially async) handling of rejected forms (frontend was OK but backend complains)

Full libraries such as [Formik](https://formik.org/) can be used to tackle (at least parts of) this problem, too, but `piral-forms` represents a very lightweight approach just leveraging what's there already and exposing it via the pilet API.

Alternatives: Use known libraries exposed as shared libraries or rely on pilets to come up with their own solutions.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/C17D-jGJ41g)

## Documentation

The following functions are brought to the Pilet API.

### `createForm()`

Creates a new form container, which is an abstraction over a state container driven by the typical lifecycle of an input form.

Returns a higher-order component for providing the form-related props such as `error`, `submitting`, `changed`, `formData`, `setFormData()`, `submit()`, `reset()`, or `changeForm()`.

## Usage

When creating a new form the following options are relevant:

- `allowSubmitUnchanged` allows you to disable the default behavior of not submitting forms when the form's data is unchanged
- `silent` will prevent dialogs to show up when the user is to navigate away from the form containing changed data
- Setting `wait` to `false` will not immediately navigate away from forms upon submission
- The data loss message (in case of navigations when the form has changed data) can be set via `message`
- `loadData` is an optional function that can be set to define how the initial form data is loaded
- `emptyData` is the initial form data
- `onSubmit` is the callback to use when a form has been submitted
- `onChange` is the callback to use when the form data has changed

::: summary: For pilet authors

You can use the `createForm` function from the Pilet API to create a global state container managed form inside the Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyPage } from './MyPage';

export function setup(piral: PiletApi) {
  const withSimpleForm = piral.createForm({
    message: `Really lose the data?`,
    emptyData: {
      firstName: '',
      lastName: '',
    },
    onSubmit(data) {
      // return promise with data
    },
  });
  piral.registerPage('/sample-form', withSimpleForm(MyPage)); // changes <MyPage /> to <form><MyPage /></form>
}
```

Calling `createForm` returns a higher-order component that 

1. injects new props from the `FormProps<TFormData>` interface into the component and
2. wraps the component into a `<form>` element.

The injected props contain - among the originally defined props - a `formData` record and a `submit` function.

If you wish to avoid the `<form>` element wrapping then provide an argument `skipForm` such as:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyPage } from './MyPage';

export function setup(piral: PiletApi) {
  const withSimpleForm = piral.createForm({
    message: `Really lose the data?`,
    emptyData: {
      firstName: '',
      lastName: '',
    },
    onSubmit(data) {
      // return promise with data
    },
  });
  piral.registerPage('/sample-form', withSimpleForm(MyPage, { skipForm: true })); // does not change <MyPage />
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createFormsApi` from the `piral-forms` package.

```ts
import { createFormsApi } from 'piral-forms';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createFormsApi()],
  // ...
});
```

There are no options available.

Using the library directly also allows you to use the provided hooks direcly:

- `useForm` is used implicitly in the higher-order component to create the dynamic form handler data
- `withForm` creates an higher-order component for the provided component using the given options - this HOC still wraps the provided component in a `<form>`
- `withFormHandler` creates an higher-order component for the provided component using the given options - without wrapping the provided component in a `<form>`

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

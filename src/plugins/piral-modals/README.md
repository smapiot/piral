[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Modals](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-modals.svg?style=flat)](https://www.npmjs.com/package/piral-modals) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-modals` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` to easily trigger the display of modal dialogs from pilets.

## Why and When

If you have modal dialogs on your page that `piral-modals` gives you a nice abstraction over registering components for them. These items will be stored in the global state container and will be filtered on a given dialog name. Thus the plugin makes only sense if you want to have consistent dialog management.

Alternative: You could simply use an event to trigger opening a dialog. The event could transport a React component which would then be globally used. Alternatively, each pilet would come up with its own dialog design and management system.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/gZt7Ic1BHNA)

## Documentation

The following functions are brought to the Pilet API.

### `registerModal()`

Adds a modal dialog definition to the app shell. Can be called from *any* pilet using the specified name.

### `unregisterModal()`

Removes a modal dialog definition from the app shell.

### `showModal()`

Shows the modal dialog registered with the provided name.

Does not open in case no modal dialog using the provided name is available (i.e., registered in the app shell).

## Usage

::: summary: For pilet authors

You can use the `showModal` function from the Pilet API to show a modal dialog registered by any pilet. In case of a naming conflict the dialogs from the current pilet are preferred.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  piral.showModal('my-modal', {
    someValue: 42,
  });
}
```

You can use the `registerModal` function from the Pilet API to add a new modal dialog in the app shell.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';
import { MyModal } from './MyModal';

export function setup(piral: PiletApi) {
  piral.registerModal('my-modal', MyModal);
}
```

You can use the `unregisterModal` function from the Pilet API to remove a previously added modal dialog from the app shell.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  piral.unregisterModal('my-modal');
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createModalsApi` from the `piral-modals` package.

```ts
import { createModalsApi } from 'piral-modals';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createModalsApi()],
  // ...
});
```

Via the options the globally available `dialogs` can be defined.

For example:

```ts
const instance = createInstance({
  // important part
  plugins: [createModalsApi({
    dialogs: [
      {
        name: 'userinfo',
        component: UserInfoModal,
      },
    ],
  })],
  // ...
});
```

In order to host the modal dialogs you'll need to embed the `Modals` component somewhere in your layout.

As an example:

```jsx
import { Modals } from 'piral-modals';

const MyLayout = ({ children }) => {
  <div>
    <Modals />
    {children}
  </div>
};
```

If you want to customize the styling (which you should) make sure to register components such as `ModalsHost` (shell for the modals) or `ModalsDialog` (wrapper for an individual dialog) via, e.g., `<SetComponent name="ModalsHost" component={MyModalsHost} />`.

### Customizing

You can customize the available dialogs and their options.

```ts
import type {} from 'piral-modals';

declare module 'piral-modals/lib/types' {
  // interface shared across all dialogs defined in PiralCustomModalsMap
  interface BaseModalOptions {
    common?: boolean;
  }

  interface PiralCustomModalsMap {
    login: {
      required?: boolean;
    };
  }
}

// now showModal("login", { required: true, common: true }) is strongly typed in pilets
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

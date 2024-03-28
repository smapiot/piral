[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Notifications](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-notifications.svg?style=flat)](https://www.npmjs.com/package/piral-notifications) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://dcbadge.vercel.app/api/server/kKJ2FZmK8t?style=flat)](https://discord.gg/kKJ2FZmK8t)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-notifications` brings to the table is a set of Pilet API extensions that can be used with `piral` or `piral-core` to show notifications triggered by pilets in your Piral instance.

## Why and When

Quite often you'll want to show notifications (such as errors, special events, information material, etc.) in a non-obtrusive toast notification (or some other way). The `piral-notifications` plugin helps you to do exactly that. It provides a simple component that you can place in your layout. Together with your styling rules the notifications are then managed by the plugin. Each pilet can open as many notifications as it wants. Notifications may decay over time or stay on the screen until closed.

Alternatives: Browsers also allow to use the system's native notification API. This usually comes with the service worker/PWA modes, but could be used by pilets, too. Another way is to leave every pilet at defining its own notification system.

## Video

We also have a video for this plugin:

@[youtube](https://youtu.be/zpipf0qrDA4)

## Documentation

The following functions are brought to the Pilet API.

### `showNotification()`

Shows a notification inside the app shell. The notification can be permanent (to be closed by the user) or temporary (closes after a specified time).

## Usage

::: summary: For pilet authors

You can use the `showNotification` function from the Pilet API to show a notification within the Piral instance.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  piral.showNotification('Hello from my sample pilet!', {
    type: 'info',
  });
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createNotificationsApi` from the `piral-notifications` package.

```ts
import { createNotificationsApi } from 'piral-notifications';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createNotificationsApi()],
  // ...
});
```

Via the options the initially displayed `messages` can be defined. Additionally, the `defaultOptions` can be set up.

For example:

```ts
const instance = createInstance({
  // important part
  plugins: [createNotificationsApi({
    defaultOptions: {
      type: 'warning',
    },
    messages: [
      {
        content: 'Welcome to the future of digital services!',
        options: {
          title: 'Hello!',
          type: 'success',
        },
      },
    ],
  })],
  // ...
});
```

In order to host the toast notifications you'll need to embed the `Notifications` component somewhere in your layout.

As an example:

```jsx
import { Notifications } from 'piral-notifications';

const MyLayout = ({ children }) => {
  <div>
    <Notifications />
    {children}
  </div>
};
```

If you want to customize the styling (which you should) make sure to register components such as `NotificationsHost` (shell for the notifications) or `NotificationsToast` (wrapper for an individual notification) via, e.g., `<SetComponent name="NotificationsHost" component={MyNotificationsHost} />`.

### Customizing

You can customize the options available when showing another notification.

One way is to extend the standard set of options by interface merging the `PiralCustomNotificationOptions` interface:

```ts
import type {} from 'piral-notifications';

declare module 'piral-notifications/lib/types' {
  interface PiralCustomNotificationOptions {
    actions?: Array<'dismiss' | 'snooze'>
  }
}

// now showNotification("...", { actions: [] }) works, too
```

Another way is to extend the `PiralCustomNotificationTypes` interface. This allows you to bring in new types - incl. options that only apply for these types.

Example:

```ts
import type {} from 'piral-notifications';

declare module 'piral-notifications/lib/types' {
  interface PiralCustomNotificationTypes {
    question: {
      answers: Array<string>;
    };
  }
}

// now showNotification("...", { type: 'question', answers: ['Maybe', 'Definitely'] }) works, too
```

The notification types contain the available types as properties. Each property can have specific options set by their interface.

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).

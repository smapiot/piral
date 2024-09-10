---
title: The Pilet API
description: A closer look at pilets and the Pilet API.
audience: Developers
level: Elementary
section: Details
---

# The Pilet API

So far, we have almost exclusively used existing elements without deeply understanding or touching them. Now it's time to see how pilet development may look in reality and how we can - from a pilet - bring in all the functionality to the application shell we want or need.

## Video

We also have a video tutorial:

@[youtube](https://youtu.be/s8dYsd7eQPc)

## The Pilet Foundation

As described earlier, a pilet is just a library compiled as a UMD module that exposes a function called `setup`. The `setup` function receives a special object that we like to call the *pilet API*. It is the API *created specifically for the pilet*. This allows the pilet to bring in new functionality to the application shell (called Piral instance).

The application shell determines what the pilet API looks like. In Piral we already determine some common parts for the pilet API - things like an API to register pages, dashboard tiles, or modal dialogs. Furthermore, some convenience functions may also be included in the pilet API. For instance, in Piral we've added functions for handling the pilet's global state.

Most APIs will be designed in a symmetric way, i.e., such that one call has a respective counterpart. An example is the "register" class of available API calls.

![Register and Unregister APIs](../diagrams/piral-api.svg){.auto}

For every register method (e.g., to register a page) there is an unregister method. Usually, we will only require to use the register method. In some cases, however, we may want to dynamically add (and then remove) some functionality.

## The Provided API

As already mentioned the provided API is determined by the underlying application shell. Therefore, we cannot discuss the full API that may be available to a specific pilet. However, what we can do is explain the API created by Piral - as it will be fully available in most pilets.

![Display API in VSCode](../diagrams/pilet-api-vscode.png)

Note that the API will also be passed on to all registered components as a prop named `piral`.

The API contains functions to be placed in the following categories:

- Application shell components (tiles, pages, ...)
- Sharing functionality with other pilets (extensions, data, events ...)
- Reflecting capabilities (meta, ....)
- Helpers and common functionality (state, ...)

While some functionality definitely needs to be used (e.g., `registerPage` for showing a page) other functionality is rather optional and may be skipped (or even disabled by the application shell) on purpose.

**Remark:** The architecture of what functionality goes into which pilet, as well as what of the pilet API is to be used (and where) is completely in your hands. Our recommendation is to make pilets as simple and lightweight as possible. Furthermore, we recommend using the pilet API only in a few places, such that most of your code would be "Piral independent".

## Adding a Page

While the pilet API gives us a powerful and flexible way to describe what to do with our pilet, it also leads to complexity. Alternatively, we could think of describing what pages (or components in general) to use in the package.json. While such a method may have some advantages, it will always miss the flexibility that we gain by using code to perform the registration.

Assuming we create a new pilet for the previously created application shell `my-app` we would end up with the following root module:

```ts
import { PiletApi } from 'my-app';
import { MyPage } from './MyPage';

export function setup(app: PiletApi) {
  app.registerPage('/my-page', MyPage);
}
```

The `MyPage` component is exported from a new file called *MyPage.tsx*. It can be as simple as:

```jsx
import * as React from 'react';

export const MyPage: React.FC = () => (
  <div>
    <h1>Hello!</h1>
    <p>This the content from the new page.</p>
  </div>
);
```

In general the provided path in the `registerPage` API is exact. Therefore, if you plan to have some sub-routing on the provided page you'd need to match more than one URL. The syntax follows the [path-to-regexp](https://github.com/pillarjs/path-to-regexp) way. As an example, you could go for `/my-pilet/:path*` to match all paths prefixed with `/my-pilet`.

::: tip: Testing paths
The path supplied to the `registerPage` API can be tested with [Express Route Tester](http://forbeslindesay.github.io/express-route-tester/) utility. Importantly, you'd need to set the version to "2.0.0" to mimic the behavior of the routes in Piral.
:::

<!-- markdown-link-check-disable-next-line -->
Running the code above will not result in anything fancy. We can now go to http://localhost:1234/my-page for seeing the page. On the landing page (dashboard) or in the menu we do not see any entry. We may want to link the page somehow.

## Linking the Page

There are multiple options on how to link the page. We could leave the page as-is, such that any other pilet would need to use (or know) the link to it. If we want to expose the page as a link in the menu we need to register such a menu entry.

The `setup` could thus change to look as follows:

```ts
import { PiletApi } from 'my-app';
import { MyPage } from './MyPage';
import { MyPageMenu } from './MyPageMenu';

export function setup(app: PiletApi) {
  app.registerMenu(MyPageMenu);
  app.registerPage('/my-page', MyPage);
}
```

The component is imported again from another module - this time the module is the file *MyPageMenu.tsx*.

```jsx
import * as React from 'react';
import { Link } from 'react-router-dom';

export const MyPageMenu: React.FC = () => (
  <Link to="/my-page">My Page</Link>
);
```

We just use the standard `Link` from `react-router-dom`. There is no additional knowledge about Piral at all here. This is a general tendency in Piral - we always want to look for standard ways first as they are known already and much easier to transport than new knowledge.

Additionally, it's easier to use existing code or share this component with existing code.

But normally our components (e.g., pages) will not stay so simple, right?

## Extensions

By far the most powerful concept that comes with Piral is the possibility of introducing "extension components". The mechanism for this is straightforward:

1. Components that can be extended with children/components from other pilets host an extension slot (giving it a name and passing in some data)
2. Pilets that want to integrate into some extension slot register an extension using the name of the slot

Importantly, there is no guarantee that the slot or any components for it exists. While the slot has properties that allow, e.g., defining a fallback if no components are available, the extension components will never know that they are not actively needed.

Also, keep in mind that the slot name is **not** bound to a single pilet. Any pilet may reuse a slot name and therefore there is also no guarantee that some props are always provided. It's up to the extension component to check that given props satisfy an expected data model. In case of a mismatch, the component should fail gracefully.

Let's see this in practice:

```ts
import * as React from 'react';
import { PiletApi, ExtensionComponentProps } from 'my-app';

// Expected props
interface MyExtensionParams {
  id: string;
  items: Array<number>;
}

const MyExtension: React.FC<ExtensionComponentProps<MyExtensionParams>> = ({ params }) => {
  // Check passed in params
  if (typeof params.id !== 'string') {
    return null;
  }

  if (!Array.isArray(params.items) || params.items.some(m => typeof m !== 'number')) {
    return null;
  }

  return (
    <>
      {/* ... */}
    </>
  );
};

export function setup(app: PiletApi) {
  app.registerExtension('extension-slot-name', MyExtension);
}
```

As far as creating an extension slot goes we can use the Pilet API to get access to the `Extension` component.

The easiest example for this is:

```jsx
export function setup(app: PiletApi) {
  app.registerPage('/example', () => {
    return (
      <>
        <h1>Example Page</h1>
        <p>Below we list the extensions registered for "extension-slot-name".</p>
        <app.Extension name="extension-slot-name" />
      </>
    )
  });
}
```

For non-React applications, extension slots can be created using the `renderHtmlExtension` function. This one takes an HTML container element and the extension slot props (`ExtensionSlotProps`) as arguments. It returns a disposer function that should be used when the extension is unmounted.

## What about Data

Modern web applications are a combination of static assets (text, images, ...) with dynamic data (usually coming from an API). These are not your daddy's websites anymore - they are live and closer to normal applications in every metric.

In Piral we wanted to make sure that data access is particularly simple. Obviously, our approach is not for everyone and so it's neither mandatory nor exclusive - you can actually use whatever you prefer.

Pilets have access to an auxiliary API called `createConnector`. This will create a data connector, which is a React higher-order component (HOC). A higher-order component can be used to wrap an existing component to give it additional functionality - in this case, access to some target data.

Let's see a simple example. We will now modify our page to include some posts received from an API:

```jsx
import * as React from 'react';

export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export interface MyPageProps {
  data: Array<Post>;
}

export const MyPage: React.FC<MyPageProps> = ({ data }) => (
  <div>
    <h1>Posts</h1>
    <ul>
      {data.map(item => (
        <li key={item.id}>
          <b>{item.title}</b>
          <p>{item.body}</p>
        </li>
      ))}
    </ul>
  </div>
);
```

The only thing we did so far is describe how *the data should be presented*. The component should have nothing to do with *how to retrieve the data*.

We could introduce some functionality and separate it, but this is something that was already done in Piral. We can use `createConnector` in the `setup` function to get this running smoothly.

```ts
import { PiletApi } from 'my-app';
import { MyPage, Post } from './MyPage';
import { MyPageMenu } from './MyPageMenu';

const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

export function setup(app: PiletApi) {
  const connect = app.createConnector<Array<Post>>(() => fetch(apiUrl).then(res => res.json()));
  app.registerMenu(MyPageMenu);
  app.registerPage('/my-page', connect(MyPage));
}
```

The `connect` HOC can be used multiple times. It will lazy load[^1] the data. When the data has been loaded already the available data will be shown. Otherwise, a loading screen will display. This is a simple way to have the full data lifecycle covered in React without needing to spend any time implementing it.

Next, we will see how to customize the Pilet API from the Piral instance.

[^1]: Lazy loading means that whenever the component is first mounted the connector will call the given connector function.

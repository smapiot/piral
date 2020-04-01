# General

## What's the motivation behind Piral?

We've build several extensible frontend applications in the past. Sometimes these applications have been shipped packaged as an app, sometimes they have been deployed as a webpage only, many times both. The general mechanism was always the same and we've detected a basic pattern that can be followed successfully to develop modern (grand scale) web apps.

Piral is also a solution to successfully implement an architecture based on microfrontends.

---------------------------------------

## Should I use Piral or Piral Core?

Piral is a **framework**. As such it comes with everything *included*, e.g., React is specified as a dependency with a clear version. You can just install `piral`, provide a proper *index.html* and entry script and you are done.

With `piral-core` you get a **library** that sits on top of other libraries. While some - very specialized - libraries are standard dependencies (i.e., installed for you), more generic ones such as React are peer dependencies. You need to install them. The advantage is that you are in charge what versions of these libraries to use (as long as they are compatible).

All plugins (e.g., `piral-vue`) work with `piral-core`.

Bottom line: The technical differences aside `piral` comes with key dependencies integrated.

---------------------------------------

## What is Piral Base?

While `piral` is build on top of `piral-core`, `piral-core` is itself build on top of `piral-base`. `piral-base` is framework agnostic and only brings all the logic, algorithms, and patterns to deal with pilets. As such you could also "build your on Piral" by using `piral-base`.

`piral-base` may be the right thing if you like the architecture of Piral, but don't want to use React or our application design. This still allows you to use the same format for pilets, the Piral CLI, and the feed service. Plugins will not work.

---------------------------------------

## What do I need to get started?

A Piral instance requires the following things:

1. A React SPA that uses `piral-core` or `piral` (recommended, [sample available](https://github.com/smapiot/piral/tree/master/src/samples/sample-piral))
2. A backend service to provision the pilets (you can use our available [feed service](https://www.piral.cloud))
3. A way to distribute the SPA (also sometimes called "shell") to new pilets, e.g., via a (potentially private) NPM feed or a Git repository

The SPA can be hosted on a static storage, while the backend service may be run anyway - serverless may be an option here, too.

---------------------------------------

## Is this really a microfrontend architecture?

Sometimes people believe that only web components follow a microfrontend architecture. Sometimes people think that having no API (e.g., just using the DOM for transporting events) is necessary for microfrontends. Both things are not true. This is one extreme perspective, which we have found not to be optimal for real-world scenarios.

In reality the application shell will be constructed using some kind of framework or UI library. Realistically, there will be a tendency towards some UI solution such as React - mostly given by some kind of pattern library or preferred UI framework. In such cases it does not make sense to hide the framework of choice from the different modules. Piral makes sharing such dependencies easy.

We think Piral hits a sweep spot as it takes what makes puristic microfrontends great (independent applications coming together, independent releases, independent development) and adds the reason why we build monoliths for the UI in the first place (least bundle size, optimal user experience, coherent design by using a common UI framework).

---------------------------------------

## How is this working in non-JS environments?

Piral was created with microfrontend architectures relying on heavy client-side interaction in mind. As such, the primary use case of Piral requires users to enable JavaScript.

Nevertheless, for a couple of reasons you may want to offer a non-JS (or progressive) version of your application. You may want to offer enhanced SEO capabilities. You may want to reduce initial loading / rendering time. You may want to give non-JS users a bit more capabilities than just stating "Sorry - you need to enable JavaScript". We hear you loud and clear.

Piral is fully compatible with server-side-rendering. However, to make a Piral instance really useful / enjoyable together with SSR you'll need to implement some logic in your server generating the HTML responses. If you are interested in the required steps and necessary changes we recommend reading our [guideline for server-side rendering](../guidelines/server-side-rendering.md).

---------------------------------------

## Why does Piral require an app shell?

The concept of an app shell is an ingredient that is optional for microfrontends, but for us a necessary usability and efficiency factor to ensure rapid development of the different pilets.

The app shell could be also used fairly minimal and without any of the features that come for free with Piral (e.g., dashboard, menu entries, modal dialog management, ...). It will still be required to load the pilets and ensure proper isolation as well as communication between them.

---------------------------------------

## Are all pilets are loaded in the start?

Yes and no. No, only the pilets applicable to the current user are loaded. Yes, all applicable pilets are loaded. This does, however, not mean that *all content* was loaded, e.g., a pilet that is larger will eventually use bundle splitting and does only provide the metadata and necessary integrations (e.g., menu entries) at first.

All components that are larger or not immediately needed should be lazy loaded.

---------------------------------------

## How can the layout of the app shell be separated?

There are essentially two ways:

1. Shallow by providing generic layout components that still require "wrapping" with Piral components obtaining their data from the state container running in your Piral instance.
2. Deep by having a peer dependency on the `piral` package (and potential plugins relevant for your layout).

In both cases the layout is externalized in form of a package.

For the first method your layout is then embedded such as:

```jsx
import { LoadingIndicator, DashboardContainer, DashboardTile, Layout } from 'my-layout-package';
import { Menu, Notifications, Modals } from 'piral';

const layout = {
  LoadingIndicator,
  DashboardContainer,
  DashboardTile,
  Layout: ({ children }) => (
    <Layout Menu={Menu} Notifications={Notifications} Modals={Modals}>
      {children}
    </Layout>
  ),
};
```

For the second method your definition can already come fully established:

```jsx
import { layout } from 'my-layout-package';
```

Each version has its own pros and cons.

---------------------------------------

## Why are components from other frameworks just contained in boxes?

Potentially, you are just looking at the "cross-framework demo" that we set up. In order to illustrate Piral's cross-framework's abilities best we placed all components on a dashboard in form of single tiles. These tiles are represented in form of these "boxes".

Note that components provided by pilets (independent of their use, e.g., as pages, tiles, modal dialogs, ...) can always be written in any framework supported by the app shell. Non-React components are not constraint to tiles and can also still participant in the extension mechanism, having a simple way of sharing (i.e., using) components between frameworks.

---------------------------------------

## How performant is it?

Well, if the question is: Is using Piral slower than just a monolith? Potentially, yes. However, the real answer is more complicated.

1. If Piral is used in the "classic" setup, where the feed service is called from the client-side then we'll have at least two-round trips (feed service, pilets) before anything meaningful will happen.
2. If Piral is used with shallow server-side rendering then we still have at least a single round trip (pilets).

In the latter case we are pretty much as fast as a monolith that used bundle splitting to obtain additional information.

We'll try to come up with a benchmark soon.

---------------------------------------

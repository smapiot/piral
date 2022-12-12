---
title: Available Libraries
description: The available libraries and their purpose.
section: Internals
---

# Available Libraries

Piral consists of several libraries that can also be used independently.

## Piral Base vs Core vs Full

The decision between `piral-core` and `piral` as the base package may not be simple. Our recommendation is to use `piral` when you are in doubt (or don't know what to do). If you have a very specific use case and want to customize the API for the pilets, as well as the communication with the backend as much as possible - then `piral-core` may be the right choice.

Furthermore, even `piral-core` is not standalone but is leveraging `piral-base` under the hood. `piral-base` is independent of React and only provides the basic Piral functionality such as an API for pilets, or the loading mechanism for pilets.

The following table compares the three from an out-of-the-box feature perspective.

| Feature          | Base  | Core  | Full |
|------------------|-------|-------|------|
| Breakpoints      | ️️️✔️     | ️️️✔️     | ✔️    |
| Events API       | ️️️✔️     | ️️️✔️     | ✔️    |
| Error Handling   | ️️️✔️    | ️️️✔️     | ✔️    |
| Error Display    | ️️️❌    | ️️️✔️     | ✔️    |
| Global State     | ️️️❌    | ️️️✔️     | ✔️    |
| Pages/Routing    | ️️️❌    | ️️️✔️     | ✔️    |
| Extension API    | ️️️❌    | ️️️✔️     | ✔️    |
| Shared Data API  | ️️️❌    | ️️️✔️     | ✔️    |
| Dashboard        | ️️️❌    | ️️️❌    | ✔️    |
| Language         | ️️️❌    | ️️️❌    | ✔️    |
| Connector API    | ️️️❌    | ️️️❌    | ✔️    |
| Notification API | ️️️❌    | ️️️❌    | ✔️    |
| Modal Dialog API | ️️️❌    | ️️️❌    | ✔️    |
| Menu API         | ️️️❌    | ️️️❌    | ✔️    |
| Polyfills        | ️️️❌    | ❌    | ✔️    |
| Translation API  | ️️️❌    | ❌    | ✔️    |

Both libraries are purely functional and do not provide any design. Thus the look and feel can be fully customized and designed in every aspect.

::: tip: Add missing features
A missing feature in `piral-core` can be also re-integrated by installing the respective plugin, e.g., `piral-dashboard` for providing dashboard capabilities.
:::

## A Standard Piral Application

The main boost for implementing an application based on `piral` comes from the fact that `piral` can be considered a framework. All the choices are already made for us, e.g., how the application renders or which version of React is used.

Let's start with an empty folder/project somewhere:

```sh
mkdir my-piral && cd my-piral
npm init -y
```

Let's install `piral` (and we are done with the dependencies!):

```sh
npm i piral
```

This is it! Really? Well, we have not built, customized, or published this instance yet. Ideally, we use the `piral-cli` to do most of these tasks very efficiently without much configuration needed.

We should always add the CLI as a *local* **dev** dependency.

```sh
npm i piral-cli --save-dev
```

To help us see the commands in action we can also use a *global* version of the CLI. Make sure to have it installed via `npm i piral-cli -g`.

## A Piral-Core Based Application

Here, we will rely on `piral-core`, which can be considered a library. While very special dependencies such as `react-atom` are straight dependencies, common dependencies such as `react` are only peer-referenced. This leaves many of the open choices up to the developer providing greater freedom.

::: warning: Peer dependencies
You will need to pick (and reference) the versions of `react`, `react-dom`, `react-router`, and `react-router-dom`.
:::

We recommend using `piral-core` when you want to have more control over what (versions of the) dependencies go in and what the API for the pilets look like.

## A Piral-Base Based Application

Relying on `piral-base` we can build an application independent of React, state management, or anything else - only with the loading and correct interpretation of pilets. This alone would not support *most* Piral plugins. However, the `piral-cli` and pilets, in general, are supported.

The result could be a new framework that leverages Piral, while using, for example, Angular instead of React.

::: tip: Share tslib
The `piral-base` package has a single dependency: `tslib`. Ideally, you set `importHelpers` to `true` in your *tsconfig.json* and share the dependency to `tslib` from your app shell.

This way, all your pilets get a little bit smaller without any additional effort.
:::

`piral-base` can also make sense for React-based applications, where you want to define *exactly* how the pilet API looks like. Here, the only predefined thing is the loading mechanism of pilets (incl. their shape following the specification).

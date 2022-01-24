---
title: Piral Architecture
---

# Piral Architecture

Overall, Piral can be considered a cure for the common frontend monolith. The frontend monolith describes an architecture where the backend is nicely split into different modules (called services), but the frontend is communicating directly to all these services effectively aggregating the backend split into one giant codebase.

![Classic Frontend Monolith](../diagrams/monolith.svg)

Piral allows you to layout your application with a similar modularization approach. Instead of having to deal with one giant codebase, a Piral instance is usually just a very thin layer. This layer is what is primarily delivered to the end-user. The Piral instance is then responsible for gathering the (user-relevant) modules (called pilets) at runtime.

![Modularization of the Monolith](../diagrams/modularization.svg)

To make creating instances of Piral that effective the architecture of Piral needs to deliver. Let's start with the used building blocks.

## Building Blocks

Piral does not start from zero. The stack that is used by Piral is React-based. Nevertheless, the API supports any kind of framework, as long as it can work with an arbitrary element to render it into.

Piral itself is based on **React** and its eco-system, e.g., **React DOM** (to render on a website), **React Router** (for routing), **React Atom** (global state management using `React.Context`) and a React independent building block **Piral Base** (which allows loading modules at runtime).

![Building blocks of Piral](../diagrams/blocks.svg)

As far as `piral` is concerned we take `piral-core` (main library without any backend or specialized API) and a set of standard plugins aggregated in `piral-ext` into account to become a single package. `piral` can be thought of as a framework, while the other building blocks are just ordinary libraries.

To give any development another boost the Piral ecosystem also contains pre-made layouts and plugins. Any kind of layout plus any number of plugins may be used when creating your own Piral instance.

A (technically speaking: inaccurate) analogy to illustrate what this means is that `piral-core` is like the Linux kernel. A certain distribution like Ubuntu would be `piral`. Additionally, to the kernel, there can be some special programs ("drivers"), which would be the Piral plugins. An application running in user space would then be a pilet. In this analogy, the role of `piral-base` would be a specific kernel driver, e.g., the TCP/IP driver.

A pilet is just an npm package containing a library. The library (JS file) is consumed by Piral, while the package is inspected and unpacked by a service (pilet feed service). The package contains some metadata, one or more JS files, and potentially some other assets.

![Layers of a pilet package](../diagrams/pilet-layers.svg)

The previous diagram shows the different layers contained in a pilet package. More information on the pilet format can be found in the specification.

## Initial Loading

The initial loading of a Piral instance is a multi-stage process. Essentially, compared to a standard React / JavaScript app we inserted the middle three boxes, which render the Piral instance triggering the pilet loading and their eventual integration.

![Loading a Piral instance](../diagrams/loading.svg)

Note that while pilets can be loaded from cache as well, we usually require at least one communication with a server to ensure that the cached pilets are the ones that should be loaded for the user. Updates on the pilets, different feature flags and other factors may influence this decision.

## State Management

Piral comes with integrated state management focused around a created Piral instance.

The state management involves:

- bookkeeping of internally used components
- coordination/bookkeeping of components coming from pilets
- current application state (language, layout, ...)
- current search state (input, results, ...)
- keeping track of connected data feeds
- keeping track of input forms
- managing the current user (data)

You can extend and use state management in your Piral instance.

## Pilet API

When pilets are setup they receive a special kind of object called the `Piral API`. The `Piral API` gives pilets access to the Piral instance to set up their components accordingly.

Setting up components may involve setting up dedicated (routes to) pages, tiles on a dashboard, general extensions, modal dialogs, and other components that need to be managed by the Piral instance.

![Piral API registration methods](../diagrams/piral-api.svg)

For every `register*` API there is an `unregister*` API. All registrations can only be modified by their owners, i.e., if pilet A registered page A it cannot be unregistered by pilet B. The unregistration can be, however, performed at any time. Removing, e.g., a route will immediately remove it from the router. Thus if the page is currently shown we will instead see the not found page.

Besides the `register*` kind of APIs, there are also `show*` kind of APIs. These do not have a counterpart like `hide*`. Instead, these APIs return a disposer function to yield the power for closing them only to the openers and trusted friends (i.e., functions that received the disposer).

Finally, the last category of API calls is made up of the `create*` functions. These create a new kind of function that can be used to wrap existing components inside them. The perfect fit for this would be between `register*` APIs or within some React tree.

---
title: Pluggable Bundlers
---

# Pluggable Bundlers

The Piral CLI is the central tooling for Piral, but neither do you need to use it nor does it try to reinvent the wheel. Instead, it leverages existing open-source software for doing its job.

One of the covered areas is bundling, i.e., producing optimized assets from your source code for debugging or production purposes.

## Available Bundler Plugins

The `piral-cli` tool can be extended using existing bundler plugins. By default, we use the `piral-cli-webpack` plugin, which integrates Webpack as a bundler into the Piral CLI.

Officially, there are the following plugins available:

- [piral-cli-webpack](https://www.npmjs.com/package/piral-cli-webpack) for bringing support for Webpack (v4)
- [piral-cli-webpack5](https://www.npmjs.com/package/piral-cli-webpack5) for bringing support for Webpack (v5)
- [piral-cli-parcel](https://www.npmjs.com/package/piral-cli-parcel) for bringing support for Parcel (v1)
- [piral-cli-parcel2](https://www.npmjs.com/package/piral-cli-parcel2) for bringing support for Parcel (v2)
- [piral-cli-esbuild](https://www.npmjs.com/package/piral-cli-esbuild) for bringing support for esbuild

::: question: Can the Piral CLI work without a bundler?
Indeed it can, even though the default bundler plugin would be installed when a bundler is required.
:::

## Providing a Bundler Plugin

Integrating your own bundler plugin is easily possible. In a nutshell, a bundler plugin is just a "normal" `piral-cli` plugin using the `withBundler` API.

The simplest example would look as follows:

```ts
import * as actions from './actions';
import type { CliPlugin } from 'piral-cli';

const plugin: CliPlugin = cli => {
  cli.withBundler('bundler-name', actions);
};

module.exports = plugin;
```

The provided actions need to fulfill the following interface:

```ts
export interface BundlerPrepareArgs<T> {
  (args: T): T | Promise<T>;
}

export interface BaseBundlerDefinition<T> {
  path: string;
  prepare?: BundlerPrepareArgs<T>;
}

export interface WatchPiralBundlerDefinition extends BaseBundlerDefinition<WatchPiralParameters> {}

export interface DebugPiralBundlerDefinition extends BaseBundlerDefinition<DebugPiralParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface BuildPiralBundlerDefinition extends BaseBundlerDefinition<BuildPiralParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface DebugPiletBundlerDefinition extends BaseBundlerDefinition<DebugPiletParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface BuildPiletBundlerDefinition extends BaseBundlerDefinition<BuildPiletParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface BundlerDefinition {
  debugPiral: DebugPiralBundlerDefinition;
  watchPiral: WatchPiralBundlerDefinition;
  buildPiral: BuildPiralBundlerDefinition;
  debugPilet: DebugPiletBundlerDefinition;
  buildPilet: BuildPiletBundlerDefinition;
}
```

Details on the used interfaces can be found in the types section. The `path` must lead to a module handling the bundling process. This module will be called in a new process, so don't expect any shared state between the Piral CLI plugin and this module.

---
title: CLI Configuration
---

# Piral CLI Configuration

The CLI uses [rc](https://www.npmjs.com/package/rc) to resolve a `.piralrc` configuration file.

The format of this file is determined by rc, too. It can either be specified in an *ini* format or *json* format. Either way, the format will be auto determined and must not be reflected via an additional file extension. Just use `.piralrc` as file name.

## Configuration Options

Right now the following configuration options exist:

- **apiKey** (`string`): Key to be used for all servers in case there is no specialized key in *apiKeys* specified.
- **apiKeys** (`{ string }`): Mapping of feed URLs to API keys. Can be used to determine a key for a specific URL.
- **url** (`string`): URL to be used for publishing a pilet in case there is no specialized key in url specified.
- **cert** (`string`): Path to a custom certificate file.
- **npmClient** (`string`): Selects the default npm client (`npm`, `yarn`, `pnpm`) to use.
- **bundler** (`string`): Selects the default bundler (`parcel`, `parcel2`, `webpack`, `webpack5`, ...) to use, if none given and found.
- **piletApi** (`string`): Selects the default pilet API path (default: `/$pilet-api`) to use.
- **validators** (`{ any }`): Sets the validators configuration for a Piral instance.

Most options would almost never be needed to be changed. A good example for such an advanced option is the `piletApi`, which would only require a change in some extreme situations.

---
title: Components
---

# Layout and Error Components

Some functionality of Piral actually is related to rendering a component on the screen. For instance, in order for `piral-notifications` to work as expected there has to be a notification host rendered in the DOM with each notification being a child of this host component.

## Layout Components

Layout components are UI fragments that are used to provide the right UI context or ensure that rendering of microfrontend components are done at the right locations. In general, these components form the "outer" layout of the application, while the whole "inner" layout it pretty much determined only by the pilets.

The outer layout is driven by technical and design considerations, while the inner layout will be driven by domain-specific and user experience considerations. As an example, the outer layout would define where the menu and the content are placed, how the menu works, and how modal dialogs will be rendered. The inner layout would actually fill the menu with items, present the actual content of the pages, and declare the contents of these modal dialogs.

With `piral-core` the following layout components are defined:

- `LoadingIndicator`: will be shown in loading scenarios, e.g., when the app is initialized or when a page is loaded
- `ErrorInfo`: will be shown in case of an error, actually being the carrier component of a specific error component (see next section)
- `Router`: is a technical component that provides the routing capabilities
- `Layout`: is the component wrapping the whole application with a given design
- `Debug`: will be shown on every page for potential debug purposes

Furthermore, plugins may extend the `PiralCustomComponentsState` type to add their own layout components. For instance, the `piral-dashboard` plugin brings two layout components `DashboardContainer` and `DashboardTile`, which define how the dashboard container (hosting all tiles) and how a single tile look like. That way, the component registered via `registerTile` only needs to take care of a tile's content, without having to know or handle the outer layout.

Registration of layout components can be done via the `SetComponent` component, e.g.,

```jsx
<Piral instance={instance}>
  <SetComponent name="LoadingIndicator" component={Spinner} />
</Piral>
```

or directly when initializing the instance:

```jsx
const instance = createInstance({
  state: {
    components: {
      LoadingIndicator: Spinner,
    },
  },
  // ...
});
```

## Error Components

Error components are UI fragments that are used to fill space in case of errors. With `piral-core` the following error components can be defined:

- `extension`: will be shown in place of an extension that errors out
- `loading`: will be shown in place of the application when loading fails
- `page`: will be shown in place of the page when it errors out
- `not_found`: will be shown in place of a page when the route could not be resolved
- `unknown`: will be shown in place of a component that errors out

Furthermore, plugins may extend the `PiralCustomErrors` type to add their own resolutions. For instance, the `piral-dashboard` plugin brings a new error type for `tile`, which would be shown in place of a tile that errors out.

Most error components are called with an `error` prop usually of type `Error`. One exclusion to this is the `not_found` error, which does only come with props describing the current route.

Registration of error components can be done via the `SetError` component, e.g.,

```jsx
<Piral instance={instance}>
  <SetError type="not_found" component={MyNotFoundComponent} />
</Piral>
```

or directly when initializing the instance:

```jsx
const instance = createInstance({
  state: {
    errorComponents: {
      not_found: MyNotFoundComponent,
    },
  },
  // ...
});
```

---
title: Instance Debugging
---

# Piral Instance Debugging

The Piral instance comes with several special variables that can be used when the app shell is either directly in debugging mode or consumed via the development package ("emulator mode").

## Session Variables

The following session variables are actively used.

| Name               | Values      | Description                                                                | Default |
|--------------------|-------------|----------------------------------------------------------------------------|---------|
| `dbg:hard-refresh` | `off`, `on` | Performs a hard reload when changes to the currently debugged pilet occur. | `off`   |
| `dbg:load-pilets`  | `off`, `on` | Still loads all the "usual" pilets besides the debugged pilet.             | `off`   |
| `dbg:view-state`   | `off`, `on` | Shows the state changes in the browser development console.                | `on`    |

Changing a value is as simple as running the following code in the browser's console:

```ts
sessionStorage.setItem('dbg:load-pilets', 'on');
```

Remember that this is a *session* setting. Restarting the browser will reset the configured value.

::: tip: Use the Piral Inspector
The [Piral Inspector](https://github.com/smapiot/piral-inspector) browser extension can help you to set changing settings without needing to remember all the details listed here.
:::

## Window Variables

| Name        | Type            | Description                                      |
|-------------|-----------------|--------------------------------------------------|
| `dbg:piral` | `DebugInstance` | The most crucial information from the app shell. |

The type for the `DebugInstance` looks as follows:

```ts
interface DebugInstance {
  debug: string;
  instance: {
    name: string;
    version: string;
    dependencies: string;
  },
  build: {
    date: string;
    cli: string;
    compat: string;
  },
  pilets: {
    createApi: PiletApiCreator;
    loadPilet: PiletLoader;
  };
}
```

The `debug` field contains the version of the `DebugInstance` type. Right now, this is `v0`.

---
title: Emulator Package
---

# Emulator Package

To make developing pilets as easy and intuitive as possible the app shell can be packaged to serve as an emulator.

The emulator is essentially the app shell with special debug helpers (e.g., allowing usage with the Piral Inspector), source maps, and non-production sources (e.g., shipping with the full React error explanations and development warnings).

## Building

The emulator is built via the `piral-cli` using the command `piral build --type emulator`. The result is a `tgz` located in the `dist/emulator` folder that could be published to an npm registry.

## Package Definition

The generated tarball contains a pre-bundled version of the sources, together with a modified version of the app shell repository's original *package.json*.

The following properties are taken over:

- `name`
- `version`
- `description`
- `license`
- `homepage`
- `keywords`
- `pilets`
- `repository`
- `bugs`
- `author`
- `contributors`
- `engines`
- `cpu`
- `publishConfig`

The following props are created:

- `main` (pointing to `app/index.js`)
- `typings` (pointing to `app/index.d.ts`)
- `app` (pointing to `app/index.html`)
- `piralCLI` (to contain the current version)
- `devDependencies` (from `devDependencies`, `dependencies`, and `pilets.externals`)

The `piralCLI` property determines if the given package contains *raw* sources or already *pre-bundled* sources. In the latter case we will directly start a server from `app`, in the former case a lightweight version of `piral debug` is applied to the sources.

::: tip: Custom emulator
If you build your emulator package on your own incl. already pre-bundled sources, make sure to include the following snippet in your *package.json*:

```json
{
  "piralCLI": {
    "generated": true
  }
}
```

This makes sure to avoid running a `piral debug` on the sources.
:::

## Declaration

Usually, only the `PiletApi` and its used types are exported from the app shell.

Extending this is possible, too. The first step is to reference additional `typings` in the *package.json*:

```json
{
  "typings": "src/types.ts"
}
```

If, for some reason, you cannot use the `typings` field you can use the artificial / non-official `extraTypes` field, too:

```json
{
  "extraTypes": "src/types.ts"
}
```

Either way, this could lead to a `.d.ts` or `.ts` file. Exports in the given file are directly integrated into the declaration.

For instance, the following would appear as an app shell export:

```ts
export interface ExportedInterface {}
```

The emulator declaration can also be built independently using the command `piral declaration`.

::: tip: Piral declaration entry point
By default, the `piral declaration` command works against the current working directory. It looks for the closest *package.json* and retrieves the application's entry point via the `app` field. In case you want to specify this you can provide the entry point directly.

The command `piral declaration path/to/entry` supports *.html*, *.js*, *.jsx*, *.ts*, and *.tsx* files as entry points.
:::

There are some advantages of using `extraTypes` over `types`:

- Works in a monorepo, too
- Avoids confusion for developers knowing that `types` comes from TypeScript directly
- Also accepts an array of entries, e.g., `["src/types.ts", "src/api.ts"]`

## Virtual Packages

Using the declaration technique a virtual package could be bundled, too.

```ts
declare module 'my-virtual-package' {
  export interface Example {}

  export declare const Foo: Example;
}
```

While importing the type from the virtual package in a pilet is always possible, the functional import of `Foo` is trickier. After all, we need to have this prepared, too:

```ts
const instance = createInstance({
  getDependencies() {
    return {
      ...getLocalDependencies(),
      'my-virtual-package': {
        Foo: {},
      },
    };
  },
});
```

This allows importing things from the `my-virtual-package` dependency in a pilet at runtime.

::: warning: Use real packages
The downside is that some bundlers may have a problem with the virtual package. For instance, Parcel likes to resolve real paths first, and will complain if a package cannot be found.

We therefore recommend using only real packages. In a monorepo the cost of maintenance is negligible and they are much more flexible, introduce less magic, and could be reused.
:::

## Types in Monorepos

As the `typings` field in the *package.json* is already used for the declaration types, we may have a problem to properly define the path to the generated declaration. This is, however, essential to have a great monorepo experience.

For specifying the path in a monorepo we can use the `types` field. Officially, the `types` field is synonymous to `typings`, however, in resolution it takes precedence. Thus it works just as it should.

::: tip: Avoid confusion
Our recommendation is to use the artificial `extraTypes` field to avoid having `typings` and `types` specified. The latter may result in confusion among developers, which is never a good thing.

In this approach we recommend using `extraTypes` for specifying the additional typings to consider when building the declaration, and `types` to refer to the generated declaration file.
:::

Note that for creating the emulator none of the two are directly taken. More details are in the [monorepo guideline](../tutorials/23-monorepo.md).

---
title: Error Handling
---

# Error Handling

We make sure to sandbox every pilet, such that errors in a pilet will never have a destructive influence on the whole app shell or other pilets.

When a pilet crashes we will show a certain message (i.e., component) that can be (and should be) completely customized.

We distinguish between a variety of errors. Currently, the following types of errors exist:

- Loading
- Extension
- Page
- Not Found

More types of errors may be added my plugins. As an example, the `piral-forms` plugin also adds the following error:

- Form

Some other ones that are fairly common (i.e., included in `piral-ext`):

- Feed
- Tile
- Menu

## Loading

The loading error appears when the loading of the app shell failed. As an example, if the pilet metadata cannot be retrieved successfully, the loading of the app shell failed (unless we handle this particular error specifically and fall back to, e.g., an empty set of pilets).

It will always be shown as a blank page, thus we can not only style it like a page we may also need to add some layout to it.

**Note**: In this layout, we should not reference internal links. The loading error page is decoupled from the standard router. Instead, we should only include functionality to restart the application and / or report the error.

*Example*: The pilet feed service is offline and the network exception is not handled in the initial request.

## Extension

The extension error appears when an extension crashes. As an example, if we crash during rendering of an extension then the error is shown.

It will always be shown as the respective component containing the extension, which may be as prominent as a page or as little as a button.

*Example*: The extension receives unexpected `params` and does not handle that gracefully.

## Page

The page error appears when a page crashes. As an example, if a page emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a normal page, thus we can style it like a page.

*Example*: The page runs some invalid code.

## Not Found

The not found error appears when a page could not be found. Specifically, if a wrong URL / route is used (e.g., `/foo` when no page or custom route for `/foo` is registered) we'll see this error.

It will always be shown as a normal page, thus we can style it like a page.

*Example*: The user navigates to a page that has not been registered in the router. This could be the case when the page (i.e. link) comes from a pilet that has not been loaded.

## Feed

The feed error appears when a feed fails during loading.

It will always be shown as the respective component containing the feed, which may be as prominent as a page or as little as a menu item.

*Example*: The API responsible for connecting to the feed is down resulting in an unhandled network error.

## Tile

The tile error appears when a tile crashes. As an example, if a tile emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a tile with the current dimensions, thus we can style it like a tile.

*Example*: The tile runs some invalid code.

## Menu

The menu error appears when a menu item crashes. As an example, if a menu item emits an error due to a component being `undefined` when rendering we'll see this error.

It will always be shown as a menu item for the given menu type, thus we can style it like a menu item.

*Example*: The menu item runs some invalid code.

## Form

The form error appears when a form fails during submission.

It will always be shown as the respective component containing the form, which may be as prominent as a page or as little as a button.

*Example*: The network is down when submitting the form resulting in an unhandled network error.

## Others

More types of errors could be added to the core, or by including a plugin. Thus we recommend to always handle the "default" (or anything else) case.

---
title: Libraries
---

# Libraries

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
| Pages / Routing  | ️️️❌    | ️️️✔️     | ✔️    |
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

This is it! Really? Well, we have not built, customized, or published this instance yet. Ideally, we use the `piral-cli` to do most of these tasks very efficiently without much configuration needs.

We should always add the CLI as a *local* **dev** dependency.

```sh
npm i piral-cli --save-dev
```

To help us see the commands in action we can also use a *global* version of the CLI. Make sure to have it installed via `npm i piral-cli -g`.

## A Piral-Core Based Application

Here, we will rely on `piral-core`, which can be considered a library. While very special dependencies such as `react-atom` are straight dependencies, common dependencies such as `react` are only peer referenced. This leaves many of the open choices up to the developer providing greater freedom.

::: warning: Peer dependencies
You will need to pick (and reference) the versions of `react`, `react-dom`, `react-router`, and `react-router-dom`.
:::

We recommend using `piral-core` when you want to have more control what (versions of the) dependencies go in and how the API for the pilets look like.

## A Piral-Base Based Application

Relying on `piral-base` we can build an application independent of React, state management or anything else - only with the loading and correct interpretation of pilets. This alone would not support *most* Piral plugins. However, the `piral-cli` and pilets in general are supported.

The result could be a new framework that leverages Piral, but using, e.g., Angular instead of React.

::: tip: Share tslib
The `piral-base` package has a single dependency: `tslib`. Ideally, you set `importHelpers` to `true` in your *tsconfig.json* and share the dependency to `tslib` from your app shell.

This way, all your pilets get a little bit smaller without any additional effort.
:::

`piral-base` can also make sense for React-based applications, where you want to define *exactly* how the pilet API looks like. Here, the only predefined thing is the loading mechanism of pilets (incl. their shape following the specification).

---
title: Loading Strategies
---

# Loading Strategies

To orchestrate how pilets are loaded a loading strategy is implemented. In most cases the default loading strategy is the most suitable one.

::: tip: Strategies come with `piral.base`
The package to come with the available loading strategies is the most basic Piral package `piral-base`, which forms the framework independent basis for Piral.
:::

Without any specifics the `standardStrategy` is used.

## Default Loading Strategy

The `standardStrategy` loads and evaluates all pilets before rendering. In the meantime Piral shows the defined loading spinner.

The execution is performed in the following way:

1. Fetch the metadata
2. Load the pilets in the order given by the metadata
3. Evaluate the pilets in the order given by the metadata

If one pilet would finish loading before another one it would still need to wait for evaluation. Here, the loading strategy guarantees that pilets are evaluated in order.

## Asynchronous Loading

There are various asynchronous loading strategies.

### Using `asyncStrategy`

The simplest asynchronous loading strategy is the `asyncStrategy`. Here, the same algorithm as with `standardStrategy` is followed, however, the loading spinner is immediately removed showing the application itself.

The advantage of this mode is that the application is rendered as soon as possible. The disadvantage is that it could be quite empty for a while. The strategy makes only sense if pilets are only used to extend certain subareas with functionality - not if they transport the main content.

### Using `blazingStrategy`

A natural evolution of the `asyncStrategy` is the `blazingStrategy`. This one also removes the loading spinner quite fast, however, waits until the metadata has been fetched.

In contrast to the `asyncStrategy` and the `standardStrategy` pilets are loaded as fast as possible, without any barriers in between. As such, this strategy does not guarantee order, but sacrifices this constraint for being able to load (and thus show) the different pilets as soon as possible.

While this strategy can make sense even for content-heavy applications, the UX needs to be quite optimized for the progressive loading behavior. Suddenly expanding menus, jumping scrollbars, and other effects may be disliked and should be gracefully handled.

## Further Strategies

The `blazingStrategy` is just an instance constructed by the `createProgressiveStrategy` factory. This factory also allows to create progressive "synchronous" strategies, which still guarantee order.

Alternatively, the `syncStrategy` can help if all pilets have been loaded already, but still need to be run (i.e., calling the `setup` function). It could be used for special purposes, e.g., SSR or specific builds of the Piral instance. This strategy ignores the fetcher and only considers the already given pilets.

::: tip: Place pilets in `window`
A very simple way of optimizing first-render performance is to place the pilets code in a global `script` tag injected into the HTML. This way, the pilets can be retrieved synchronously, allowing the use of the `syncStrategy` for evaluation.

While this could be a quick win in many scenarios, the long-term (and much more scalable) solution is to use server-side generated bundles or individual scripts.
:::

## Implementing Your Own Strategy

A loading strategy is just a small function kernel that implements the following interface:

```ts
interface PiletLoadingStrategy {
  (options: LoadPiletsOptions, pilets: PiletsLoaded): Promise<void>;
}
```

where `PiletsLoaded` is a callback to allow streaming back intermediate results. This reporter callback was defined to be:

```ts
interface PiletsLoaded {
  (error: Error | undefined, pilets: Array<Pilet>): void;
}
```

The `options` (first argument) contain all options that may be necessary for actually loading the pilets:

```ts
interface LoadPiletsOptions {
  createApi: PiletApiCreator;
  fetchPilets: PiletRequester;
  pilets?: Array<Pilet>;
  loadPilet?: PiletLoader;
  fetchDependency?: PiletDependencyFetcher;
  getDependencies?: PiletDependencyGetter;
  dependencies?: AvailableDependencies;
}
```

Most importantly, the options have the `fetchPilets` function to get the pilet metadata. The options also transport the `createApi` function to construct an API object dedicated to be used in a pilet.

All the other options are only overrides for specific functionality, e.g., to determine how exactly a pilet is loaded the `loadPilet` option can be used.

---
title: Package Metadata
---

# Piral Package Metadata

The Piral CLI uses the *package.json* file for retrieving useful information. This includes - in case of a pilet - the specific Piral instance to use, or (from a Piral instance) the shared dependencies to be used in pilets.

## Piral Instance - Package Definition

The additional fields for a Piral instance package are as follows:

```json
{
  "name": "my-piral-instance",
  // ...
  "app": "src/index.html",
  "pilets": {
    "preScaffold": "echo 'Pre Scaffold'",
    "postScaffold": "echo 'Post Scaffold'",
    "preUpgrade": "echo 'Pre Upgrade'",
    "postUpgrade": "echo 'Post Upgrade'",
    "externals": [
      "my-ui-lib"
    ],
    "files": [
      ".editorconfig",
      "src/mocks",
      {
        "from": "scaffold/test.js",
        "to": "jest.config.js"
      },
      {
        "from": "src/pilet",
        "to": ".",
        "deep": true,
        "once": true
      }
    ],
    "scripts": {
      "publish-pilet": "pilet publish --api-key $PILET_PUBLISH_KEY"
    },
    "devDependencies": {
      "prettier": "^1.16.4"
    },
    "validators": {
      "stays-small": -30
    },
    "packageOverrides": {
      "browserslist": [
        "defaults",
        "not IE 11",
        "not IE_Mob 11",
        "maintained node versions"
      ]
    }
  }
}
```

The `pilets` field is completely optional. The `app` field is necessary to signal the HTML file to be used as an entry point to the Piral CLI. All paths are relative to the *package.json*.

The names in the list of `externals` need to be aligned with the names of the dependencies in the `dependencies` field. These dependencies will be available to pilets as `peerDependencies` (or "externals"). Furthermore, the Piral CLI will instruct these dependencies to be fully included in the app.

### Pilet Lifecycle Hooks

The `preScaffold`, `postScaffold`, `preUpgrade`, and `postUpgrade` fields provide lifecycle hooks for the scaffolding and upgrading operations in pilets. The content is structurally equivalent to the content inside npm scripts.

The lifecycle hooks are run in the following order:

1. Pre-Scaffold is done after [optionally] creating the directory, but before anything else, e.g., the *tsconfig.json* has been scaffolded.
2. Post-Scaffold is done right before the scaffold command is exited, i.e., after everything has been scaffolded and copied accordingly.
3. Pre-Upgrade is done before anything is touched, i.e., right before the command will start moving things around.
4. Post-Upgrade is done right after the new/updated Piral instance has been added and all files etc. have been touched.

### Pilet Scaffolding Files

The list of `files` contains paths to files relative to the `package.json` that should be copied to the pilet when scaffolding (or upgrading). The idea here is to include common files such as an `.editorconfig`, custom `tsconfig.json`, `tslint.json`, or others to provide some coherence when creating new repositories with pilets.

**Note**: Depending on the development model no special files may be wanted, e.g., in a monorepo workflow all essential configuration files such as an *.editorconfig* are already present in the repository's root directory.

If a file is actually a folder then all the folder files are copied. For simple strings that means that all files from, e.g., `src/mocks` are copied to `src/mocks`. If `from` and `to` are specified then the files from `from` are copied to the directory specified in `to`. Note that by default this is shallow.

**Remark**: Besides specifying simple strings, where the relative path from the Piral instance is the same as the relative path from the pilet, the files can also be specified in form of an object containing the source relative path via `from` and the target relative path via `to`. Optionally, `deep` can be specified for directories, which may either be `true` or `false`.

- `from` path relative to the original root (where the package.json of the Piral instance is)
- `to` path relative to the pilet root (where the package.json of the pilet will be)
- `deep` signals if the (`from`) directory should be copied recursively
- `once` signals that the file(s) should only be copied on `pilet new`, **not** `pilet upgrade`

### Pilet Scripts

The determined `scripts` provide an easy way to extend the scripts section of the `package.json` of a new pilet. The reason for this section is - like the `files` section - coherence. Likewise, the `devDependencies` can be used to inject some additional tools into a scaffolded pilet, e.g., a preferred solution for unit test, linting, or style coherence.

**Remark**: The difference between the `devDependencies` (format like in the *package.json* - names with semver constraints) and the `externals` (just names, no version constraints) is explained fairly simple: every name mentioned in `externals` needs to be also present in the provided Piral instance (i.e., needs to occur in `dependencies` with a semver constraint), however, the `devDependencies` for a pilet do not need to be present in the Piral instance at all - thus specifying the semver constraint is necessary.

In addition to the standard specification using a string for the version, the dependencies listed in the `devDependencies` can also be marked as `true`. Such a `devDependencies` entry will then use the version of the dependency as specified in either the `dependencies` or `devDependencies` of the Piral instance. If no such entry can be found, it will fall back to `"latest"`.

The `validators` field is used to properly assert pilets. There are many validators included in `piral-cli`. Additionally, new validators can be added via CLI plugins. For options on the given `validators` see the `pilet validate` command.

### General Overrides

The `packageOverrides` field is used to determine additional properties to merge into the *package.json* of pilets when **scaffolding**. This will not be used while upgrading. The idea here is to provide some initial values which go beyond the standard template.

::: tip: Use a package.json fragment
Besides specifying additional fields for the *package.json* in the `packageOverrides` field you can also include a *package.json* file in the `files` section. If the target is indeed identical to the pilet's *package.json* then this will not be overwritten, but rather just be merged.

The merging happens *after* the initial project scaffolding, but *before* the critical pilet pieces (e.g., the dev dependency to the app shell) are applied.
:::

### Scaffold Scripts

The `preScaffold` and `postScaffold` installation scripts are run during scaffold (`pilet new`) in the following order:

1. The package from the Piral instance is installed
2. The `preScaffold` script is run, if available
3. Scaffolding tasks, such as updating of *package.json* or copying of the files are performed
4. All dependencies are resolved and installed (if wanted)
5. The `postScaffold` script is run, if available

Thus for `preScaffold` and `postScaffold` either scripts via `npx`, general scripts such as Bash scripts, or running Node.js files make sense.

The `preUpgrade` and `postUpgrade` upgrade scripts are run during upgrade (`pilet upgrade`) in the following order:

1. The package from the Piral instance is (re-)installed
2. The `preUpgrade` script is run, if available
3. Scaffolding tasks, such as updating of *package.json* or copying of the files are performed
4. All dependencies are resolved and (re-)installed
5. The `postUpgrade` script is run, if available

Thus for `preUpgrade` and `postUpgrade` either scripts via `npx`, general scripts such as Bash scripts, or running Node.js files make sense.

## Pilets - Package Definition

The additional fields for a pilet package are as follows:

```json
{
  "name": "my-awesome-pilet",
  // ...
  "peerDependencies": {
    "react": "*"
  },
  "peerModules": [
    "react-dom/server"
  ],
  "piral": {
    "comment": "Keep this section to use the Piral CLI.",
    "name": "my-piral-instance"
  },
}
```

The name of the Piral instance is used to find the right entry point for debugging.

The `peerDependencies` represent the list of shared dependency libraries, i.e., dependencies treated as external, which are shared by the application shell. The `peerModules` repesent the list of shared dependency modules, i.e., modules treated as external, which are shared by the application shell.

**Remark**: The `piral` field is exclusively used by the Piral CLI. For information regarding what might be picked up by a feed service implementation see the specification of a pilet, which discusses all fields in depth.

---
title: Scaffolding
---

# Scaffolding

This section will help you with the process of creating fresh Piral and pilet instances.

## Get Started

The simplest way to scaffold a Piral project is to use the npm initializers. For instance, to create a new Piral instance run:

```sh
npm init piral-instance
```

This scaffolds a new app shell in the current directory.

::: question: Do I need the npm initializers?
No, you can also use the `piral-cli` directly. However, that way you need to have the `piral-cli` globally installed, which is generally not advisable.

With the `piral-cli` installed globally you could run `piral new` instead of the command above.
:::

All options that can be determined will be presented to you in a command line survey. If you want to skip this survey and take the default options you can use the `--defaults` flag:

```sh
npm init piral-instance --defaults
```

We can now create a tarball from this app shell since this is needed to scaffold a related pilet.

Choose the command that fits your taste:

```sh
# run the `piral` command via the `npx` runner
npx piral build

# alternatively, use the set up npm script
npm run build

# of course you can also use yarn or any other npm client
yarn build
```

The generated tarball is now being located under *dist/emulator/*.

Let's create a directory for the pilet next to the app shell's directory. Assuming that the app shell's directory has been called `my-piral-instance` we could run in the pilet's directory:

```sh
# npm v6
npm init pilet --source ../my-piral-instance/develop/my-piral-instance-1.0.0.tgz

# npm v7 and npm v8
npm init pilet -- --source ../my-piral-instance/develop/my-piral-instance-1.0.0.tgz
```

Like beforehand, if you don't want to see the survey use the `--defaults` flag:

```sh
# npm v6
npm init pilet --source ../my-piral-instance/develop/my-piral-instance-1.0.0.tgz --defaults

# npm v7 and npm v8
npm init pilet -- --source ../my-piral-instance/develop/my-piral-instance-1.0.0.tgz --defaults
```

Make sure to adapt the command above to the name of your app shell.

::: question: Do I need the npm initializers?
No, same as with the scaffolding of the Piral instance.

With the `piral-cli` installed globally you could run `pilet new ../my-piral-instance/develop/my-piral-instance-1.0.0.tgz` instead of the command above.
:::

This will scaffold a new pilet. The crucial part is the first argument, which is the path to the tarball'ed piral instance.

When scaffolding a new pilet you have to reference an app shell.

## Logging

If you want more information about the scaffolding process you can simply increase the log level (from `0` to `5`):

```sh
piral new my-piral-instance --log-level 5
```

The available log levels are:

- `0`: disabled
- `1`: errors only
- `2`: warnings (and `1`)
- `3`: info (and everything from `2`)
- `4`: verbose (and everything from `3`)
- `5`: debug (essentially `4` with log file output)

## Selecting a Bundler

When scaffolding a Piral instance or pilets you can also specify the bundler:

```sh
npm init pilet --source my-piral-instance --bundler parcel
```

Possible choices are `"none"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"webpack"` or `"webpack5"`. The bundler can also be changed after the scaffolding process at any time.

## Related Resources

- [new-piral](../commands/new-piral.md)
- [new-pilet](../commands/new-pilet.md)

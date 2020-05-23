---
title: Migration of Existing Applications
description: Illustrates how existing applications can be migrated conveniently.
audience: Architects, Developers
level: Advanced
---

# Migration of Existing Applications

We know that many applications won't be rewritten just because a new framework or architectural pattern is in fashion. In the end Piral does not want to capture you or your application. Likewise, we don't want you to be captured by your current choice. Therefore, our aim is it to be as simple and straightforward as possible for a migration.

In this tutorial we look at three existing sample applications/scenarios and discuss their migration paths.

## Custom React Application into Piral Instance

For this scenario we assume that the React-based application has been bundled using Webpack.

* First step: Try to install the Piral CLI and see if your application just works when running `piral debug`. Presumably, you'd need to have an index.html referencing your script entry point and other things.

For this to work you'd need to change from a perspective that only scripts and stylesheets will be transpiled to using an HTML file as entry point. Most likely, you already have an HTML file - it is just without any `<script>` or `<link rel=stylesheet>` tag (using the `html-webpack-plugin`) or already prepared for the output.

Just move the HTML file to your source folder and add `<script src="index.tsx"></script>` to point to your script entry point (assumed: `index.tsx`). Likewise, do the same for your stylesheet with:

```html
<link rel="stylesheet" type="text/css" href="style.scss">
```

Again, use the reference to the source file, not the expected outcome (e.g., a file with the `.css` extension) later. This will be properly changed by the bundler.

* Second step: In case everything runs - wonderful! Otherwise, you'd try to install `piral-cli-webpack` instead. Make sure that `piral-cli-parcel` is removed when you try running `piral debug` again.

Let's assume it does not run (and still keeps on failing): Where is your webpack configuration special?

* Third step: Install `piral-core` to onboard to Piral. Make sure that React, React Router, and React Router DOM are all installed already.

You can now use Piral anywhere in your code. A suggestion to start with is to set up Piral just as a replacement of your router.

For example the following example would do the job:

```jsx
<Piral instance={instance}>
  <Route component={ScrollToTop} />
  <SetComponent name="LoadingIndicator" component={Spinner} />
  <SetComponent name="Layout" component={Layout} />
  <SetRoute path={routes.feedOverview} component={Home} />
</Piral>
```

There is no more `<Switch>` as this is done internally by Piral's router anyway. General routes may still be set up via `<Route>` (in the example above a `ScrollToTop` component is installed for all pages), while `<SetRoute>` is used for dedicated routes (exclusive content).

Your layout will now be brought in via the `Layout` component. Don't forget to also declare some more generic design components like the loading indicator shown in the example above.

At this point your application is fully migrated and you could start developing modules in form of pilets.

## Create React App into Pilet

For this scenario we assume that the application was scaffolded using `create-react-app` (CRA). Under the hood, CRA uses Webpack, too. Nevertheless, there is a significant amount of loaders, plugins, and settings that went into this.

While this is in general quite similar to the scenario above, we will now assume that the created app should be converted to a **pilet**, not a **Piral instance**.

* The first thing you can drop is the usage of `react-scripts` for building etc., i.e., remove the following in your *package.json*:

```json
  "react-scripts": "3.4.1"
```

Furthermore, we should remove the related scripts from the *package.json*. Most notably, we should remove:

```json
    "test": "react-scripts test",
    "eject": "react-scripts eject"
```

* Now we can just upgrade our project to a pilet using:

```sh
npm init pilet
```

This will guide us through the available options. Afterwards, we should check if everything is fine and remove potentially redundant entries in the *package.json*. For instance, we may see multiple entries for `react` or `react-dom`. Here, the entries that have been added to the `devDependencies` should remain, while others should be removed.

**Important**: If the standard *index.css* is still in the *src* folder then the `pilet debug` and `pilet build` commands should be explicitly pointed to the *index.tsx* (or *index.jsx*) file.

Example:

```json
    "start": "pilet debug src/index.tsx",
    "build": "pilet build src/index.tsx",
```

This explicit setting is also useful when the original *index.js* should be kept. In any case, once multiple "index" files are available an explicit command is preferred.

At this point we only need to take care of wiring everything up in the `setup` function of our new index file. Example:

```ts
import "./index.css";
import * as React from "react";
import { PiletApi } from "sample-piral";
import { Link } from "react-router-dom";

const App = React.lazy(() => import("./App"));

export function setup(app: PiletApi) {
  app.registerMenu(() => <Link to="/sample">Sample</Link>);
  app.registerPage("/sample", App);
}
```

* Finally, we can test out the pilet - first by running `yarn start` and then by trying the unit tests. Here, potentially some work on migrating away from the React scripts need to be spent.

For an example of this [see our sample on GitHub](https://github.com/piral-samples/pilet-cra-migration).

* Also notably we should add some things to our *.gitignore*, if not done yet.

```plain
.cache
dist
*.tgz
```

Regarding the use of CSS in general: By default, Piral makes no restrictions on what you can put into your CSS from your pilets. As a result, two pilets may collide with each other in styling. Even worse, a pilet may destroy the global design of the app shell.

Luckily, there are ways around this. The best-practice here is to "namespace" our CSS, which is facilitated by usage of SASS or CSS-in-JS libraries. Pilets will need to give careful consideration to what "reset" or "normalization" libraries they're using, and microfrontends should decouple themselves from whatever CSS artifacts other pilets are exporting.

## What about Next.js

For this scenario we assume that the application was created using the Next.js boilerplate. Again, under the hood this uses Webpack. The additional problems arise through custom parts like the Next.js router or the mixed client-side and server-side rendering.

Given the two scenarios above (something into an app shell, something into a pilet) we see two main options:

1. Use the Next.js app as your app shell. Essentially leave everything as-is, just use our Webpack plugin for the app shell. In some of the Next.js routes create a `<Piral>` instance using Piral's router for the content.
2. Convert your application into a pilet. Here you'd need to drop the build process and introduce aliases for the routing capabilities. You'd also need to follow the second scenario in terms of introducing a pilet root module.

As usual your approach can be more radical; essentially just taking the components and re-composing from scratch.

## Conclusion

Migrating to Piral is mostly simple and straight forward. Since Piral tries to be as easy and shallow to integrate as possible you can just leverage all the React components that you already have. The greatest challenge may be the change of the build system. If the latter becomes a problem we have options:

- multiple bundlers are supported for direct plugins (Parcel, Webpack)
- for Webpack we have plugins to be seamlessly integrated into your existing build configuration
- our build specification helps you to integrate it in any build tool

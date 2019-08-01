# A Static Piral Instance

In this guideline we will create a simple Piral instance from scratch.

**Prerequisites**

- Node.js with NPM
- Standard terminal (WSL, -nix, MacOS) with tools such as `mkdir`, `touch`, ...
- A text editor

**Assumptions**

- You know what Piral is
- You have some command line knowledge
- You know how to configure / use TypeScript

## Creating an App Shell

We start by creating the basis for our app shell. This kind of scaffolding can either be done with help of the `piral-cli` or directly. We will use the `piral-cli`.

### Scaffolding using the Piral CLI

In the easy way we use the `piral-cli` to scaffold a new Piral instance.

```sh
piral new --target my-piral-instance
```

The scaffolding set up everything that makes it a runnable Piral instance. From this point on we can spent our time tackling the modifications in our application.

### Modify the HTML

The content of the `index.html` can be as simple as:

```html
<!doctype html>
<meta charset=utf8>
<div id="app"></div>
<script src="./index.tsx"></script>
```

The default HTML is quite simple and basic. Changes are high that custom stylesheets, meta tags, or other elements should be added.

Keep in mind that a special mounting element (by default one with the id `app`) must exist for Piral to render. Also the script reference to `index.tsx`, which leads to the root module of our application is necessary.

### Modify the Root Module

For the root module the following content is sufficient:

```ts
import { renderInstance, buildLayout } from 'piral';

renderInstance({ layout: buildLayout() });

export * from 'piral';
```

This way we effectively re-export the declarations (i.e., TypeScript declarations) of the `piral` framework to be used in pilets. Eventually, we may also export custom declarations / additions to be used in pilets for convenience.

The `renderInstance` function only requires a layout to be rendered. In the given example we use an empty (default) layout. Packages to start with a pre-made layout exist.

### Modifying the Layout

The general development flow for the declaration of a layout is similar to the following example. Note: You do not have to declare all components inline - they can be defined anywhere.

```ts
const layout = buildLayout()
  .withLayout(({ children }) => <div className="app-content">{children}</div>)
  .withLoader(() => <div className="loading">Loading ...</div>)
  .withError(() => <span className="error">Error!</span>)
  .createDashboard(dashboard => dashboard
    .container(({ children }) => <div className="dashboard">{children}</div>)
    .tile(({ children }) => <div className="tile">{children}</div>));
```

The layout elements (e.g., what loader to use) are all just simple React components.

### Running the Application

Running the application now should mostly work - up to an error that no feed was found.

```sh
npm start
```

To point to, e.g., the sample feed we could just change the configuration in the `index.tsx`, however, we should already think about scaling the development later. Thus, a better way is to use some backend mock to provide the sample at the same address as the app shell (e.g., `http://localhost:1234`). For this a mock backend has been created in the `backend.js` file of the `src/mocks` folder.

One temporary solution is to go against the public feed service available at [feed.piral.io](https://feed.piral.io). For instance, using the sample feed the code could look as follows:

```ts
renderInstance({
  layout,
  config: {
    pilets: () => fetch('https://feed.piral.io/api/v1/pilet/sample')
      .then(res => res.json())
      .then(data => data.items),
  },
});
```

## Next Steps

Once everything has been done we should take care of getting access to a pilet feed. We can either set up our own feed service somewhere (e.g., by using the sample feed service implemented in Node.js from our GitHub repository) or use our publicly available feed service. We have a free community plan that should be good enough to get started.

The next step would be finish the app shell by creating an appropriate layout and adding more shared dependencies (e.g., useful libraries, a pattern library for common UX/UI elements). Also the authentication needs to be set up properly.

The final step is to publish the created Piral to an NPM feed. This could be the public NPM feed even though a private feed may make much more sense. If no NPM feed is available the instance could also be shared via its Git repository or an NPM package ending with *.tgz*.

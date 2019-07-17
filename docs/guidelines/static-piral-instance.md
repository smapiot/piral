# A Static Piral Instance

In this guideline we will create a simple Piral instance from scratch.

## Scaffolding the App Shell

We start by creating the basis for our app shell. This kind of scaffolding can either be done with help of the `piral-cli` or directly. We look at both ways.

### Easy Way

In the easy way we use the `piral-cli` to scaffold a new Piral instance.

```sh
piral new --target my-piral-instance
```

The scaffolding set up everything that makes it a runnable Piral instance. From this point on we can spent our time tackling the next steps described in the final section.

### Detailed Way

Let's start with an empty directory that should contain a Piral instance.

We first create a new NPM project:

```sh
npm init -y
```

Now we install `piral`. Furthermore, we install the `piral-cli` and `typescript` to enhance the development experience.

```sh
npm i piral --save
npm i typescript --save-dev
npm i piral-cli --save-dev
```

To ensure proper development we should create some folder structure. We could go for

```sh
mkdir src
touch tsconfig.json
touch src/index.tsx
touch src/index.html
```

This way we created a new folder `src`, which contains now an app entry point (`index.html`) and a root module `index.tsx`.

The `tsconfig.json` could be configured as follows. If we want to develop efficiently in our pilets we should make sure to enable the creation of declarations.

```json
{
  "compilerOptions": {
    "declaration": true,
    "target": "es6",
    "outDir": "./lib",
    "skipLibCheck": true,
    "lib": ["dom", "es2018"],
    "moduleResolution": "node",
    "module": "esnext",
    "jsx": "react"
  },
  "include": [
    "./src"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

The content of the `index.html` can be as simple as:

```html
<!doctype html>
<meta charset=utf8>
<div id="app"></div>
<script src="./index.tsx"></script>
```

For the root module the following content is sufficient:

```ts
import { renderInstance, buildLayout } from 'piral';

renderInstance({ layout: buildLayout() });

export * from 'piral';
```

This way we effectively re-export the declarations of the `piral` framework. Eventually, we may also export custom declarations / additions to be used in pilets for convenience.

The `renderInstance` function only requires a layout to be rendered. In the given example we use an empty (default) layout. Packages to start with a pre-made layout exist.

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

Finally, we need to do some simple modifications to the `package.json`. We need to insert the following properties:

```json
{
  // ...
  "scripts": {
    "start": "piral debug",
    "build": "piral build && tsc"
  },
  "app": "src/index.html",
  "typings": "lib/index.d.ts",
  "main": "lib/index.js",
  "pilets": {
    "externals": []
  }
}
```

Running the application now should mostly work - up to an error that no feed was found.

```sh
npm start
```

To point to, e.g., the sample feed we could just change the configuration in the `index.tsx`, however, we should already think about scaling the development later. Thus, a better way is to use some backend mock to provide the sample at the same address as the app shell (e.g., `http://localhost:1234`).

For this we create a new file `backend.js` in `src/mocks`.

## Next Steps

(tbd)

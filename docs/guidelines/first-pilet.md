# Your First Pilet

Writing your first pilet should not be more complicated than writing your first web app. In fact, due to the Piral CLI it may be even more simple - as simple as writing a library.

## The Basic Concept

A pilet is structurally nothing more than a library that will be published in form of a bundled NPM library. As a consequence, a pilet needs to consist of at least a single JavaScript module, i.e., a JavaScript file that exports some functionality. For a pilet only a single export is needed - a function called `setup`.

Usually, pilets are developed using TypeScript. You are not forced to use TypeScript. You can use any language as long as it can be transpiled to a valid JavaScript (ES5) bundle.

The bundling of the pilets can be done with any bundler. By default, we recommend using the Piral CLI, which uses *Parcel* under the hood. The Piral CLI will take care of the essential steps when bundling to ensure a correct bundle has been produced. This includes:

- Producing a correct bundle with the exported `setup` function
- Not including (i.e., bundling) the shared dependencies (e.g., React)
- Supporting bundle splitting for asynchronous pilets
- Supporting resource references for including (smaller) assets such as images or stylesheets

Let's start creating our first pilet by using the Piral CLI scaffolding capabilities.

Make sure that you've installed the Piral CLI globally before continuing:

```sh
npm i piral-cli -g
```

## Scaffolding using the Piral CLI

To scaffold a new pilet called "my-pilet" we can use the Piral CLI. Make sure that you've installed the Piral CLI globally to perform the following command.

```sh
pilet new sample-piral --target my-pilet
```

This will create a new folder called `my-pilet` in the current directory. The Piral instance to be used for running the new pilet will be `sample-piral`. The name corresponds to the name of the package on the NPM feed. By default, the public NPM feed is used. The `--registry` flag allows setting a private registry if the package with the Piral instance to be used is available somewhere else.

## Piral Instance Emulation

Let's go into the directory and install the remaining dependencies.

```sh
cd my-pilet
npm i
```

One of the reasons why the scaffolding did not install the dependencies already is the choice of the package manager. This way, you can decide if you want to use NPM (as above) or Yarn. Both ways work as the Piral CLI tries to stay agnostic.

Now let's run the scaffolded pilet. We can use the Pilet CLI for starting the debug mode.

```sh
pilet debug
```

This should open a local server accessible at port `1234`. Go to `http://localhost:1234` in your web browser. Our Piral sample instance should be visible with a small "Hello from Piral!" notification visible.

For simplicity we could augment the `package.json` to look as follows:

```json
{
  // ...
  "scripts": {
    "start": "pilet debug"
    // ...
  }
}
```

This way we can run the pilet by calling `npm start` on the command line.

## Understanding the Pilet API

Let's open the repository in your favorite editor and inspect what has been created. Besides all the configuration files (e.g., `package.json`, `tsconfig.json`) we also have a `src` folder containing an `index.tsx` file. Open the file.

The `index.tsx` is the root module of this pilet. A pilet needs to export a `setup` function. In the scaffolded code the `setup` function is already used to declare some components for use in the web app.

The `showNotification` API can be used to trigger a notification in the app. All APIs are fully typed and should come with support when supplying values in your editor.

As an example we could just add a new page using the following code:

```tsx
app.registerPage('/hello', () => <div>Hello from a page!</div>);
```

Linking against this page (e.g., from the menu) could be done via a new menu entry:

```tsx
app.registerMenu('hello-link', () => <Link to="/hello">See Page</Link>);
```

Here, we need to import `Link` from `react-router-dom` to work properly.

## Building and Publishing

Later we may want to publish our pilet. The Pilet CLI has this one covered as well. First, let's try to create a production build:

```sh
pilet build
```

This should indicate if everything builds successful and what bundle size we expect. We should see that shared dependencies such as React are not integrated and stay as a "virtual module" (*.vm*).

Once we have a successful build we can pack everything for publishing (`pilet pack`) and publish the package (`pilet publish`).

All three steps can be done in the `publish` command as well using the `--fresh` flag.

```sh
pilet publish --fresh --api-key YOUR_API_KEY --url URL_OF_PILET_FEED_SERVICE
```

At this point your pilet should be live in the given feed.

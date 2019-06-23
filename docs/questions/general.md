# General

## What's the motivation behind Piral?

We've build several extensible frontend applications in the past. Sometimes these applications have been shipped packaged as an app, sometimes they have been deployed as a webpage only, many times both. The general mechanism was always the same and we've detected a basic pattern that can be followed successfully to develop modern (grand scale) web apps.

Piral is also a solution to successfully implement an architecture based on microfrontends.

---------------------------------------

## Should I use Piral or Piral Core?

Piral is a **framework**. As such it comes with everything *included*, e.g., React is specified as a dependency with a clear version. You can just install `piral`, provide a proper *index.html* and entry script and you are done.

With `piral-core` you get a **library** that sits on top of other libraries. While some - very specialized - libraries are standard dependencies (i.e., installed for you), more generic ones such as React are peer dependencies. You need to install them. The advantage is that you are in charge what versions of these libraries to use (as long as they are compatible).

The technical differences aside `piral` is fully opinionated about the design of your backend. If you have already a backend or don't want to follow the official backend specification then `piral-core` would be the one to install.

---------------------------------------

## One pilet is rather large - can I make it smaller?

Pilets can be bundle split like any other module. Ideally, especially for larger pilets, the splitting occurs already in the root module that contains the `setup` function.

Compare without bundle splitting:

```tsx
import MyTile from './MyTile';

export function setup(app: PiralApi) {
  app.registerTile(
    'tile',
    MyTile,
  );
}
```

to a solution that uses bundle splitting:

```tsx
const MyTile = React.lazy(() => import('./MyTile'));

export function setup(app: PiralApi) {
  app.registerTile(
    'tile',
    MyTile,
  );
}
```

The loading indicator will already be displayed by Piral itself, so there is no need to take care of setting up one.

---------------------------------------

## My pilet has to ship with resources such as CSS, images, videos, ... - how?

The approach for bundle splitting works for resources out of the boxes. As with any standard bundler just use the `require` function with your resources or include CSS files directly:

```tsx
import './foo.css';

const imagePath = require('./images/bar.png');
```

Note that larger assets (e.g., videos) should be embedded via CDNs or specialized services. A pilet has a maximum file limit of 16 MB (which may be larger in your implemention, however, we do not recommend it).

Our recommendation is to only include development-relevant resources (e.g., CSS files) or fast changing assets (e.g., icons only made for the current UX and very specific to the currently offered functionality) in the pilet. Everything else should be referenced from global resources.

---------------------------------------

## What do I need to get started?

A Piral instance requires the following things:

1. A React SPA that uses `piral-core` or `piral` (recommended, sample [available](https://github.com/smapiot/piral/tree/master/src/samples/sample-piral))
2. A backend service to provision the pilets (a sample using Node.js Express is [available](https://github.com/smapiot/sample-pilet-service))
3. A way to distribute the SPA (also sometimes called "shell") to new pilets, e.g., via a (potentially private) NPM feed or a Git repository

The SPA can be hosted on a static storage, while the backend service may be run anyway - serverless may be an option here, too.

---------------------------------------

## How strong is the coupling from Piral to my pilets?

This is a matter of your architecture. Naturally, a single file (root module) is required to touch / integrate your pilet components to the Piral instance. This is the `setup` function. Besides this single point of contact no other touchpoint is required - you could write just "plain" React components using your own abstractions and be happy.

In general we recommend to design and use the pilets in such a way that reuse of common or presumably generic code is easily possible.

---------------------------------------

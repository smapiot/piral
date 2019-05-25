# General

## What's the motivation behind Piral?

We've build several extensible frontend applications in the past. Sometimes these applications have been shipped packaged as an app, sometimes they have been deployed as a webpage only, many times both. The general mechanism was always the same and we've detected a basic pattern that can be followed successfully to developer modern (grand scale) web apps.

---------------------------------------

## Should I use Piral or Piral Core?

Piral is a framework. As such it comes with everything *included*, e.g., React is specified as a dependency with a clear version. You can just install `piral`, provide a proper *index.html* and entry script and you are done.

With `piral-core` you get a library that sits on top of other libraries. While some - very specialized - libraries are standard dependencies (i.e., installed for you), more generic ones such as React are peer dependencies. You need to install them. The advantage is that you are in charge what versions of these libraries to use (as long as they are compatible).

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

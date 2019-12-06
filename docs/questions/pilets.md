# Pilets

## One pilet is rather large - can I make it smaller?

Pilets can be bundle split like any other module. Ideally, especially for larger pilets, the splitting occurs already in the root module that contains the `setup` function.

Compare without bundle splitting:

```ts
import MyTile from './MyTile';

export function setup(app: PiralApi) {
  app.registerTile(
    'tile',
    MyTile,
  );
}
```

to a solution that uses bundle splitting:

```ts
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

```ts
import './foo.css';

const imagePath = require('./images/bar.png');
```

Note that larger assets (e.g., videos) should be embedded via CDNs or specialized services. A pilet has a maximum file limit of 16 MB (which may be larger in your implementation, however, we do not recommend it).

Our recommendation is to only include development-relevant resources (e.g., CSS files) or fast changing assets (e.g., icons only made for the current UX and very specific to the currently offered functionality) in the pilet. Everything else should be referenced from global resources.

---------------------------------------

## How strong is the coupling from Piral to my pilets?

This is a matter of your architecture. Naturally, a single file (root module) is required to touch / integrate your pilet components to the Piral instance. This is the `setup` function. Besides this single point of contact no other touchpoint is required - you could write just "plain" React components using your own abstractions and be happy.

In general we recommend to design and use the pilets in such a way that reuse of common or presumably generic code is easily possible.

---------------------------------------

## What is registerExtension?

Most typical in a microfrontend the micro applications gets the full page. In Piral we baked in the concept of the app shell in such a fashion that usually the full page is already shared with components from different micro applications (pilets), e.g., menu entries, search results, modal dialogs...

However, most likely you will at one point in the future reach a point where even the content of a single page needs to be shared / used by different pilets, e.g., when you have a product detail page and want to have a "add to cart" button which manipulates the data from another pilet (shopping cart). In such a case the shopping cart pilet can register an extension with a known name (e.g., `add-to-cart`) and the product detail page could insert an extension slot with the name `add-to-cart`.

Extension slots allow pilets to build mechanisms similar to, e.g., `registerTile`, `registerMenu`, ... but just generically.

---------------------------------------

## Why do I need extensions?

As discussed in the previous answers without extensions the content of a pilet page would be only determined by the pilet. In some cases we also want components / content / functionality from other pilets to be displayed there, too.

Coming up with some mechanism on, e.g., events, or the shared data, will be both - error prone and difficult to handle. The extension mechanism is simple and can be fully controlled, e.g., what fallback to use when no extension was registered for the given slot.

All that's needed is a common name and understanding of the data and the rest will be done by Piral with the help of React.

---------------------------------------

## How can I provide navigation?

Piral is based on React and uses standard components known from the React ecosystem. We use `react-router-dom` for performing navigation tasks.

For (internal) links we recommend using `Link`, e.g., `<Link to="/">Home/<Link>`.

For other (programmatic) navigation we recommend using the `useHistory()` hook to retrieve the `history` object. With this object you can easily navigate, e.g., using `history.push('/my-page')`.

---------------------------------------

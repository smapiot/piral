---
title: Web Components
description: Information about the used and available web components.
section: Internals
---

# Web Components

Piral comes with a set of web components that are partially used internally and partially can used from you directly in your app shell or micro frontends.

The available web components are:

- `piral-extension`: This one is used to declare a Piral extension slot. You can use it.
- `piral-component`: This one is used to mark the area for a component to render into. You should not use it as it's inserted and removed by Piral.
- `piral-portal`: The one is used to create a rendering spot for non-React components in the React component tree. You should not use it as it's inserted and removed by Piral.
- `piral-slot`: This one is used to have a clean unobtrusive container element for frameworks that cannot reuse exist elements. You can use it.
- `piral-content`: This one is used to show the content of a React component in a non-React component. You can use it.

Let's look into each one with an example.

## Extension Slots

The `piral-extension` web component gives you the possibility of declaring an extension slot in th DOM tree, i.e., essentially from any framework. Almost all the possibilities of an extension slot are available.

The most straight forward usage is just with a name:

```html
<piral-extension name="name-of-extension-slot"></piral-extension>
```

If you want to transport in parameters you need to use either the `params` property or the `params` attribute. The latter uses a JSON value, while the former allows you to pass in an object with any kind of values (incl. function references) in it.

Using the params attribute:

```html
<piral-extension name='name-of-extension-slot' params='{"foo":"bar"}'></piral-extension>
```

Using the params property:

```html
<piral-extension name="name-of-extension-slot" id="my-extension"></piral-extension>
```

combined with the JavaScript code to set the property

```js
document.querySelector('#my-extension').params = {
  foo: 'bar',
  log: (str) => console.log(str),
};
```

The component emits some events:

- `render-html`, emitted from the `piral-extension` instance in bubbling mode to indicate that the extension slot should be handled (i.e., populated with components as registered) by the orchestrator
- `extension-props-changed`, emitted from the `piral-extension` instance when a params change should lead to an immediate re-rendering

## Component Boundaries

The `piral-component` web component provides an indicator that an area is reserved for the component coming from a micro frontend. The name of component can be declared using the `name` attribute, while the micro frontend is specified in the `origin` attribute.

```html
<piral-component name="name-of-component" origin="my-awesome-pilet">
  <!-- here comes the rendered content -->
</piral-component>
```

This component is only used within the framework. It will be inserted as a natural component boundary and has no impact on styling.

The component emits some events:

- `add-component`, emitted from `window` when a new `piral-component` instance has been connected to the DOM (usually after mounting / rendering)
- `remove-component`, emitted from `window` when an existing instance has been removed (usually after unmounting)

For Piral to use this as a boundary you need to be in the (opt-in) "modern" isolation mode. To active this mode you need to change the *piral.json*:

```json
{
  "isolation": "modern"
}
```

::: tip: Visualize component origins
For the visualization feature of the Piral Inspector (a freely available browser extension) you'll need to have the `isolation` mode set to `modern`. Otherwise, this feature will not work as expected.
:::

The element instances and their attributes have to be preserved as they are managed by Piral itself.

## Rendering Portals

The `piral-portal` web component repersents a non-visual anchor point for the React rendering tree. As access to the DOM tree requires a `ref` on a real element the `piral-portal` was introduced.

It has a single attribute `pid` that contains the internally used portal ID. Using the portal ID the main React rendering tree can trigger rendering of anything with a proper projection. This way, a single React render tree can exist even though foreign elements may occupy full or partial sub-trees of it.

The element instances and their attributes have to be preserved as they are managed by Piral itself.

## Container Elements

The `piral-slot` web component can be used as an unobtrusive container. Like the other elements it uses a CSS display mode that makes it non-visual, i.e., it is just a plain container element without intrinsic styling properties.

You can use this one for a framework that requires to change the attributes of the hosting element. Usually, for non-React components the hosting element is already a `piral-portal`, however, this one needs to be kept (with its provided attributes). If the rendering framework wants to change this hosting element then having a nested hosting such as:

```html
<piral-portal pid="abc">
  <piral-slot>
    <!-- rendering of foreign framework happens in here using outerHtml -->
  </piral-slot>
</piral-portal>
```

In most cases you'll not want to use this element directly even though it could come in handy.

## Content Views

The `piral-content` web component is a non-visual container that acts as a portal for React content to be rendered. Whenever you receive React content in your non-React components (e.g., via the `children` prop) you can use a `piral-content` element to display it.

For using the element correctly you also need to use the global `assignContent` function. First, you'd assign the content (e.g., after you received it) using this function:

```js
window.assignContent("123", myReactContent)
```

Then you can create the `piral-content` instance using the same content ID (`cid`):


```html
<piral-content cid="123"></piral-content>
```

At this time the Piral orchestrator will take the assigned content and render it into the element using React.

The component emits some events:

- `render-content`, emitted from `window` when a `piral-content` instance was connected and rendering should begin

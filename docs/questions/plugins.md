# Plugins

## Do you support Angular (2+)?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-ng`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Angular components efficiently.

For documentation on `piral-ng` please consult the [package information](https://npmjs.com/package/piral-ng).

---------------------------------------

## Do you support Angular.js (1.x)?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-ngjs`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Angular.js components efficiently.

For documentation on `piral-ngjs` please consult the [package information](https://npmjs.com/package/piral-ngjs).

---------------------------------------

## Do you support Vue?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-vue`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Vue components efficiently.

For documentation on `piral-vue` please consult the [package information](https://npmjs.com/package/piral-vue).

---------------------------------------

## Do you support Hyperapp?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-hyperapp`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Hyperapp components efficiently.

For documentation on `piral-hyperapp` please consult the [package information](https://npmjs.com/package/piral-hyperapp).

---------------------------------------

## Do you support Inferno?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-inferno`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Inferno components efficiently.

For documentation on `piral-inferno` please consult the [package information](https://npmjs.com/package/piral-inferno).

**Remark**: We would recommend, however, aliasing `inferno` with `react` since they are mostly API compatible anyway. Reworking the few pieces that are incompatible should be worth the effort.

---------------------------------------

## Do you support Preact?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-preact`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Preact components efficiently.

For documentation on `piral-preact` please consult the [package information](https://npmjs.com/package/piral-preact).

**Remark**: We would recommend, however, aliasing `preact` with `react` since they are mostly API compatible anyway. Reworking the few pieces that are incompatible should be worth the effort.

---------------------------------------

## Do you support Aurelia?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-aurelia`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Aurelia components efficiently.

For documentation on `piral-aurelia` please consult the [package information](https://npmjs.com/package/piral-aurelia).

---------------------------------------

## Do you support LitElement?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-litel`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Hyperapp components efficiently.

For documentation on `piral-litel` please consult the [package information](https://npmjs.com/package/piral-litel).

---------------------------------------

## Do you support web components?

Short answer - yes.

Since web components are just HTML elements you can already use the standard HTML render mode, as well as the possibility of rendering extensions as HTML elements.

For an improved experience we recommend using web components together with LitElement. Here, our `piral-litel` plugin could be helpful.

---------------------------------------

## Do you support Mithril.js?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-mithril`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Hyperapp components efficiently.

For documentation on `piral-mithril` please consult the [package information](https://npmjs.com/package/piral-mithril).

---------------------------------------

## Do you support Blazor?

Short answer - yes.

Piral is primarily using React, which makes it necessary for you to build your Piral instance in React. As such you should try to communicate that pilets should be build in React, too. However, we know that there are many different applications out there and reuse is desired. Therefore, we created `piral-blazor`, which is an plugin package that you can integrate into your Piral instance. As a result pilets can use any existing Hyperapp components efficiently.

As Blazor is quite a special technology (since its based on WebAssembly) there are some very special things to follow for integration. The result, however, could be worth it. As Piral gives you here a truly unique and wonderful way of building your application - modular, distributed, and with the fastest possible Blazor startup time!

For documentation on `piral-blazor` please consult the [package information](https://npmjs.com/package/piral-blazor).

---------------------------------------

## Can the feed connector initialize directly?

If you want to have the data directly, e.g., before a page or another component is loaded then just use the `immediately` option.

Example:

```js
const connect = createConnector({ /* usual options */, immediately: true });
```

---------------------------------------

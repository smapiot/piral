---
title: Converters
description: Piral allows multiple frameworks to work together using converters.
audience: Architects, Developers
level: Advanced
---

# Converters

Piral already includes and uses React for UI purposes. The reasons to include a UI framework[^1] by default are simple: we don't want to reinvent the wheel. Knowing that an app shell will already need things like state management, efficient rendering, and routing brings us to use one of the existing frameworks.

[^1]: ... or a library in case of React

React is not only popular enough to justify its use, it is also lightweight and super easy to test. With isomorphic rendering it also provides everything to present a full picture.

Nevertheless, we are also aware that for legacy (i.e., migration) or future purposes other frameworks may play a role, too. Luckily, React also forms a great basis to allow **other frameworks to coexist and operate**.

In this tutorial we'll see how easy it is to use other frameworks in Piral. We'll start with direct bundling, which can be done in any pilet without changing the app shell at all.

## Video

We also have this tutorial available in form of a video.

@[youtube](https://youtu.be/sRik0kyFO_g)

## Direct Bundling

Out of the box Piral supports two kinds of components: React and vanilla JS. The latter is also called *foreign components*, which refers pretty much to non-React component.

Let's pretend we want to register a foreign component for rendering a certain page in a pilet:

```ts
export function setup(piral: PiletApi) {
  piral.registerPage('/sample', {
    type: 'html',
    component: {
      mount(el) {
        el.innerHTML = `<div><h1>Hello!</h1></div>`;
        const b = el.appendChild(document.createElement('b'));
        b.textContent = 'Just a plain vanilla HTML page';
      },
    },
  });
}
```

Instead of passing in a React component we pass in a special object that has the `type` field set to `html`. This special object is called a *converter*. Converters allow to teach Piral how to convert from a foreign component to a React component.

Using the foreign component converter is also a possible way to include any kind of framework component.

Let's see an example of how to register a page written in Vue:

```js
import Vue from 'vue';
import MyPage from './page.vue';

export function setup(piral) {
  piral.registerPage('/sample-for-vue', {
    type: 'html',
    component: {
      mount(parent, props) {
        const el = parent.appendChild(document.createElement('div'));
        new Vue({
          el,
          render(h) {
            return h(MyPage, {
              props,
            });
          },
        });
      },
    },
  });
}
```

Besides the way to declare the converter the dependencies (in this case `vue`, as well as for development purposes the dependencies `vue-template-compiler` and `@vue/component-compiler-utils`) need to be included.

Another thing to consider is that the way above would be quite verbose in case of multiple registrations. Here we can use an abstraction:

```js
import Vue from 'vue';
import MyPage1 from './page1.vue';
import MyPage2 from './page2.vue';

function fromVue(vueComponent) {
  return {
    type: 'html',
    component: {
      mount(parent, props) {
        const el = parent.appendChild(document.createElement('div'));
        new Vue({
          el,
          render(h) {
            return h(vueComponent, {
              props,
            });
          },
        });
      },
    },
  };
}

export function setup(piral) {
  piral.registerPage('/sample/1', fromVue(MyPage1));
  piral.registerPage('/sample/2', fromVue(MyPage2));
}
```

Obviously, once we hit multiple pilets using Vue we may want to bring this functionality to the app shell.

## General Working

The Piral context has a special object called `converters`, which represents the registration of all available converters. A converter may be registered as simple as:

```ts
context.converters.vue = ({ root }) => {
  return {
    mount(parent, props) {
      // ...
    },
  };
};
```

Usually, converters are added as part of a Piral plugin. In a plugin the definition could be as simple as:

```ts
export function createVueApi(config) {
  return context => {
    context.converters.vue = ({ root }) => {/* ... */};
    return {};
  };
}
```

In order to properly work also from the typings perspective the following boilerplate can be applied for converter plugins:

```ts
import { ForeignComponent, ExtensionSlotProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletVueApi {}

  interface PiralCustomComponentConverters<TProps> {
    vue(component: VueComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface VueComponent<TProps> {
  root: YourFrameworkComponent<TProps>;
  type: 'vue';
}

export interface PiletVueApi {}
```

In the boilerplate above `vue` (in the converter and the component `type`) should be replaced with the name of the converter. Furthermore, the structure of the `VueComponent` is completely free - as is its name. Just replace `...Vue...` with the name of the framework to include.

For bringing a convenience / abstraction as described above (`fromVue`) we can just extend the API:

```ts
export interface PiletVueApi {
  fromVue<TProps>(root: YourFrameworkComponent<TProps>): VueComponent<TProps>;
}
```

The API creator thus has also to change a bit:

```ts
export function createVueApi(config) {
  return context => {
    context.converters.vue = ({ root }) => {/* ... */};
    return {
      fromVue(root) {
        return {
          type: 'vue',
          root,
        };
      },
    };
  };
}
```

After the plugin is finished it can be integrated in the Piral instance to be used by the pilets.

## Lifecycle

Another thing to note is that we may want to clean up when components are unmounted by Piral. As such besides the `mount` function an additional function exists: `unmount`.

Going back to the original example we have:

```js
import Vue from 'vue';
import MyPage from './page.vue';

export function setup(piral) {
  let instance;

  piral.registerPage('/sample-for-vue', {
    type: 'html',
    component: {
      mount(parent, props) {
        const el = parent.appendChild(document.createElement('div'));
        instance = new Vue({
          el,
          render(h) {
            return h(MyPage, {
              props,
            });
          },
        });
      },
      unmount(parent) {
        instance.$destroy();
        parent.innerHTML = '';
        instance = undefined;
      },
    },
  });
}
```

To complete the picture also the update of the props is handled in a dedicated function. The function for this is called `update`.

Again, we can modify the example above to take care of this, too:

```js
import Vue from 'vue';
import MyPage from './page.vue';

export function setup(piral) {
  let instance;

  piral.registerPage('/sample-for-vue', {
    type: 'html',
    component: {
      mount(parent, props) {
        const el = parent.appendChild(document.createElement('div'));
        instance = new Vue({
          el,
          render(h) {
            return h(MyPage, {
              props,
            });
          },
        });
      },
      update(parent, data) {
        for (const prop in data) {
          instance[prop] = data[prop];
        }
      },
      unmount(parent) {
        instance.$destroy();
        parent.innerHTML = '';
        instance = undefined;
      },
    },
  });
}
```

In most cases the `parent` (first argument) will not be used for the `update` function. In some cases it may be relevant.

The idea is quite simple, components will always behave as follows for the lifetime of a *component instance*:

1. Mount (once)
2. Update (never, once, or often)
3. Unmount (once)

The unmount will *always* happen when the application is still running. In case of closing the application the components are not unmounted. Thus, this method should not be used to make some API cleanup calls or similar. Use the standard DOM method for these cases.

## Context

When creating well-designed converters the concept of *context* is important. This becomes especially important to not only allow one-way (from the foreign component to a React component) conversions, but also the other way round. Using Piral's extension mechanism, where components are offered in form of *extensions* two-way converters can be included, too.

To accomplish the React to specific foreign component conversion a special Pilet API function called `renderHtmlExtension` can be called.

Using the original vanilla JS example we now want to show an extension in the page:

```ts
export function setup(piral: PiletApi) {
  piral.registerPage('/sample', {
    type: 'html',
    component: {
      mount(el) {
        el.innerHTML = `<div><h1>Hello!</h1></div>`;
        const container = el.appendChild(document.createElement('div'));
        piral.renderHtmlExtension(container, {
          name: 'my-extension-component',
          params: {
            // ...
          },
        });
      },
    },
  });
}
```

This will actually project the React component for the extension named `my-extension-component` into the DOM element `container`.

Going beyond vanilla JS we see that this also works with our Vue example:

```js
import Vue from 'vue';
import MyPage from './page.vue';

export function setup(piral) {
  Vue.component({
    functional: false,
    props: ['name', 'params'],
    render(createElement) {
      return createElement('extension-component');
    },
    mounted() {
      piral.renderHtmlExtension(this.$el, {
        params: this.params,
        name: this.name,
      });
    },
  })

  piral.registerPage('/sample-for-vue', {
    type: 'html',
    component: {
      mount(parent, props) {
        const el = parent.appendChild(document.createElement('div'));
        new Vue({
          el,
          render(h) {
            return h(MyPage, {
              props,
            });
          },
        });
      },
    },
  });
}
```

Equipped with this setting a component called `extension-component` can be used from Vue, which will project the React component cleanly into the rendered UI.

The way above apparently is only valid for Vue, however, the general concept remains the same. We'll need to provide a framework specific component that yields access to its underlying DOM element. Once we have this, we can simply call the `renderHtmlExtension` function.

In frameworks where such access is not possible (e.g., Elm) we can always fall back to web components as rescue.

Dealing with a context may become crucial when using React functionality such as using the router for navigation.

Simple example:

```ts
export function setup(piral: PiletApi) {
  piral.registerPage('/sample', {
    type: 'html',
    component: {
      mount(el, props, context) {
        const a = el.appendChild(document.createElement('a'));
        a.textContent = 'Some link';
        a.href = '#';
        a.onClick = (e) => {
          context.router.history.push('/demo');
          e.preventDefault();
        }
      },
    },
  });
}
```

In the provided example the context is directly transported into the `mount` function. However, in most cases the `mount` function scope is not directly accessible, e.g., in the Vue components. In these cases we need to have a way to inject the context such that any child can access it.

While most frameworks come with a way to do this nicely, some lack this ability. In these cases a communication via events may be appropriate.

By default, the `context` comes with two fields: `router` and `state`. While the former is the React Router context containing parts such as `history`, the latter is an `Atom<GlobalState>` to allow listening for global state changes.

## Conclusion

Piral makes it easy to include cross-framework communication and integration. Using converters we can teach Piral how to convert any kind of component to a foreign component, which will be handled in a React component. The other way around is also possible. Here Piral uses efficient projections to render React components in any kind of DOM element.

In the next tutorial we'll look at how dependencies can be shared in Piral. Besides the simple "implicit" way a couple of other options exist.

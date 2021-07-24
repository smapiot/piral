import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component, App } from 'vue';
import { createExtension } from './extension';
import { mountVue } from './mount';

export function createConverter(rootName = 'slot', selector = 'extension-component') {
  const convert = <TProps extends BaseComponentProps>(
    root: Component<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    let instance: App = undefined;

    return {
      mount(parent, data, ctx) {
        const el = parent.appendChild(document.createElement(rootName));
        const app = mountVue(root, data, ctx, captured);
        app.mount(el);
        app.component(selector, createExtension(rootName));
        !app._props && (app._props = {});
        instance = app;
      },
      update(_, data) {
        for (const prop in data) {
          instance._props[prop] = data[prop];
        }
      },
      unmount(el) {
        instance.unmount();
        el.innerHTML = '';
        instance = undefined;
      },
    };
  };
  return convert;
}

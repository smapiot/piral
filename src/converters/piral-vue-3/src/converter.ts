import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component, App } from 'vue';
import { createExtension } from './extension';
import { mountVue } from './mount';

export interface Vue3ConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: Vue3ConverterOptions = {}) {
  const { rootName = 'slot', selector = 'extension-component' } = config;
  const Extension = createExtension(rootName);
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
  convert.Extension = Extension;
  return convert;
}

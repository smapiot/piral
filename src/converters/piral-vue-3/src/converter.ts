import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component, App } from 'vue';
import { createExtension } from './extension';
import { mountVue } from './mount';
import { Vue3MiddlewareHandler } from './types';

export interface Vue3ConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
  /**
   * Defines the name of the root element.
   * @default piral-slot
   */
  rootName?: string;
}

interface Vue3State {
  instance: App;
}

export function createConverter(config: Vue3ConverterOptions = {}) {
  const { rootName = 'piral-slot', selector = 'extension-component' } = config;
  const Extension = createExtension(rootName);
  let middleware: Vue3MiddlewareHandler = () => {};
  const convert = <TProps extends BaseComponentProps>(
    root: Component<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => ({
    mount(parent, data, ctx, locals: Vue3State) {
      const el = parent.appendChild(document.createElement(rootName));
      const app = mountVue(root, data, ctx, captured);
      middleware(app);
      app.component(selector, createExtension(rootName));
      app.mount(el);
      !app._props && (app._props = {});
      locals.instance = app;
    },
    update(parent, data, ctx, locals: Vue3State) {
      for (const prop in data) {
        locals.instance._props[prop] = data[prop];
      }
    },
    unmount(parent, locals: Vue3State) {
      locals.instance.unmount();
      parent.innerHTML = '';
      locals.instance = undefined;
    },
  });
  convert.Extension = Extension;
  convert.defineMiddleware = (setup: Vue3MiddlewareHandler) => {
    middleware = setup;
  };
  return convert;
}

import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component, App, reactive } from 'vue';
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
  props: any;
}

export function createConverter(config: Vue3ConverterOptions = {}) {
  const { rootName = 'piral-slot', selector = 'extension-component' } = config;
  const Extension = createExtension(rootName);
  const middlewares: Array<Vue3MiddlewareHandler> = [];
  const convert = <TProps extends BaseComponentProps>(
    root: Component<TProps>,
    captured: Record<string, any> = {},
  ): ForeignComponent<TProps> => ({
    mount(parent, data, ctx, locals: Vue3State) {
      const el = parent.appendChild(document.createElement(rootName));
      const props: BaseComponentProps = reactive({
        ...captured,
        ...data,
      });
      const app = mountVue(root, props, ctx);
      middlewares.forEach((middleware) => middleware(app));
      app.component(selector, createExtension(rootName));
      app.mount(el);
      locals.instance = app;
      locals.props = props;
    },
    update(parent, data, ctx, locals: Vue3State) {
      for (const prop in data) {
        locals.props[prop] = data[prop];
      }
    },
    unmount(parent, locals: Vue3State) {
      locals.instance.unmount();
      parent.innerHTML = '';
      locals.instance = undefined;
      locals.props = undefined;
    },
  });
  convert.Extension = Extension;
  convert.defineMiddleware = (middleware: Vue3MiddlewareHandler) => {
    if (!middlewares.includes(middleware)) {
      middlewares.push(middleware);
    }
  };
  return convert;
}

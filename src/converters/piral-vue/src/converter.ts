import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component } from 'vue';
import { mountVue } from './mount';
import { createExtension } from './extension';

export interface VueConverterOptions {
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

interface VueState {
  instance: any;
}

export function createConverter(config: VueConverterOptions = {}) {
  const { rootName = 'piral-slot', selector = 'extension-component' } = config;
  const Extension = createExtension(rootName, selector);
  const convert = <TProps extends BaseComponentProps>(
    root: Component<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => ({
    mount(parent, data, ctx, locals: VueState) {
      const el = parent.appendChild(document.createElement(rootName));
      locals.instance = mountVue(el, root, data, ctx, captured);
    },
    update(parent, data, ctx, locals: VueState) {
      for (const prop in data) {
        locals.instance[prop] = data[prop];
      }
    },
    unmount(parent, locals: VueState) {
      locals.instance.$destroy();
      parent.innerHTML = '';
      locals.instance = undefined;
    },
  });
  convert.Extension = Extension;
  return convert;
}

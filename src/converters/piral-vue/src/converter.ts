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
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: VueConverterOptions = {}) {
  const { rootName = 'slot', selector = 'extension-component' } = config;
  const Extension = createExtension(rootName, selector);
  const convert = <TProps extends BaseComponentProps>(
    root: Component<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    let instance: any = undefined;

    return {
      mount(parent, data, ctx) {
        const el = parent.appendChild(document.createElement(rootName));
        instance = mountVue(el, root, data, ctx, captured);
      },
      update(_, data) {
        for (const prop in data) {
          instance[prop] = data[prop];
        }
      },
      unmount(el) {
        instance.$destroy();
        el.innerHTML = '';
        instance = undefined;
      },
    };
  };
  convert.Extension = Extension;
  return convert;
}

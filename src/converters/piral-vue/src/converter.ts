import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component } from 'vue';
import { mountVue } from './mount';

export function createConverter(rootName = 'slot') {
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
  return convert;
}

import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component } from 'solid-js';
import { render, createComponent } from 'solid-js/dom';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(root: Component<TProps>): ForeignComponent<TProps> => {
    return {
      mount(parent, data, context) {
        render(() => createComponent(root, { context, ...data }), parent);
      },
      update(parent, data, context) {
        render(() => createComponent(root, { context, ...data }), parent);
      },
      unmount(el) {
        render(() => undefined, el);
        el.innerHTML = '';
      },
    };
  };
  return convert;
}

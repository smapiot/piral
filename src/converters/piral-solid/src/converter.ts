import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component } from 'solid-js';
import { render, createComponent } from 'solid-js/dom';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(root: Component<TProps>): ForeignComponent<TProps> => {
    return {
      mount(parent, data) {
        render(createComponent(root, data), parent);
      },
      update(parent, data) {
        render(createComponent(root, data), parent);
      },
      unmount(el) {
        // tslint:disable-next-line:no-null-keyword
        render(null, el);
        el.innerHTML = '';
      },
    };
  };
  return convert;
}

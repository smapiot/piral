import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { mountHyperapp } from './mount';
import { Component } from './types';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(
    root: Component<TProps>,
    state: any,
    actions: any,
  ): ForeignComponent<TProps> => {
    return {
      mount(el, props, ctx) {
        mountHyperapp(el, root, props, ctx, state, actions);
      },
      update(el, props, ctx) {
        mountHyperapp(el, root, props, ctx, state, actions);
      },
      unmount(el) {
        el.innerHTML = '';
      },
    };
  };
  return convert;
}

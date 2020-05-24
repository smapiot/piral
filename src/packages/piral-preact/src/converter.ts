import { ComponentType } from 'preact';
import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { mountPreact, unmountPreact } from './mount';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(root: ComponentType<TProps>): ForeignComponent<TProps> => {
    return {
      mount(el, props, ctx) {
        mountPreact(el, root, props, ctx);
      },
      update(el, props, ctx) {
        mountPreact(el, root, props, ctx);
      },
      unmount(el) {
        unmountPreact(el);
      },
    };
  };
  return convert;
}

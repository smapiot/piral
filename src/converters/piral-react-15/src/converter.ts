import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { ComponentType } from 'react-15';
import { mountReact15, unmountReact15 } from './mount';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(root: ComponentType<TProps>): ForeignComponent<TProps> => {
    return {
      mount(el, props, ctx) {
        mountReact15(el, root, props, ctx);
      },
      update(el, props, ctx) {
        mountReact15(el, root, props, ctx);
      },
      unmount(el) {
        unmountReact15(el);
      },
    };
  };

  return convert;
}

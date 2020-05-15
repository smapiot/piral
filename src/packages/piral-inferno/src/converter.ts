import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { ComponentType } from 'inferno';
import { mountInferno, unmountInferno } from './mount';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(root: ComponentType<TProps>): ForeignComponent<TProps> => {
    return {
      mount(el, props, ctx) {
        mountInferno(el, root, props, ctx);
      },
      update(el, props, ctx) {
        mountInferno(el, root, props, ctx);
      },
      unmount(el) {
        unmountInferno(el);
      },
    };
  };
  return convert;
}

import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import type { ComponentType } from 'react-15';
import { createExtension } from './extension';
import { mountReact15, unmountReact15 } from './mount';

export interface React15ConverterOptions {
  /**
   * Defines the name of the root element.
   * @default piral-slot
   */
  rootName?: string;
}

export function createConverter(config: React15ConverterOptions = {}) {
  const { rootName = 'piral-slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(root: ComponentType<TProps>): ForeignComponent<TProps> => ({
    mount(el, props, ctx) {
      mountReact15(el, root, props, ctx);
    },
    update(el, props, ctx) {
      mountReact15(el, root, props, ctx);
    },
    unmount(el) {
      unmountReact15(el);
    },
  });
  convert.Extension = Extension;
  return convert;
}

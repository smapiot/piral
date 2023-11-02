import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import type { ComponentType } from 'react';
import { createExtension } from './extension';
import { mountReact, unmountReact } from './mount';

export interface ReactConverterOptions {
  /**
   * Defines the name of the root element.
   * @default piral-slot
   */
  rootName?: string;
}

export function createConverter(config: ReactConverterOptions = {}) {
  const { rootName = 'piral-slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(root: ComponentType<TProps>): ForeignComponent<TProps> => ({
    mount(el, props, ctx) {
      mountReact(el, root, props, ctx);
    },
    update(el, props, ctx) {
      mountReact(el, root, props, ctx);
    },
    unmount(el) {
      unmountReact(el);
    },
  });
  convert.Extension = Extension;
  return convert;
}

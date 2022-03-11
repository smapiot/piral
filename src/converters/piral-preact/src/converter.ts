import type { ComponentType } from 'preact';
import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { mountPreact, unmountPreact } from './mount';
import { createExtension } from './extension';

export interface PreactConverterOptions {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: PreactConverterOptions = {}) {
  const { rootName = 'slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(root: ComponentType<TProps>): ForeignComponent<TProps> => ({
    mount(el, props, ctx) {
      mountPreact(el, root, props, ctx);
    },
    update(el, props, ctx) {
      mountPreact(el, root, props, ctx);
    },
    unmount(el) {
      unmountPreact(el);
    },
  });
  convert.Extension = Extension;
  return convert;
}

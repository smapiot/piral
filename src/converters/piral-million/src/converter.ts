import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { mountMillion, unmountMillion } from './mount';
import { createExtension } from './extension';

export interface MillionConverterOptions {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: MillionConverterOptions = {}) {
  const { rootName = 'slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(root: any): ForeignComponent<TProps> => ({
    mount(el, props, ctx) {
      mountMillion(el, root, props, ctx);
    },
    update(el, props, ctx) {
      mountMillion(el, root, props, ctx);
    },
    unmount(el) {
      unmountMillion(el);
    },
  });
  convert.Extension = Extension;
  return convert;
}

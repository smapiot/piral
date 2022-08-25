import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import type { VNode } from 'million';
import { mountMillion, updateMillion, unmountMillion } from './mount';
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
  const convert = <TProps extends BaseComponentProps>(root: (props: TProps) => VNode): ForeignComponent<TProps> => ({
    mount(el, props, ctx, locals) {
      locals.node = mountMillion(el, root, props);
    },
    update(el, props, ctx, locals) {
      locals.node = updateMillion(el, root, props, locals.node);
    },
    unmount(el, locals) {
      unmountMillion(el, locals.node);
    },
  });
  convert.Extension = Extension;
  return convert;
}

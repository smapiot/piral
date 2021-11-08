import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import type { ComponentType } from 'inferno';
import { mountInferno, unmountInferno } from './mount';
import { createExtension } from './extension';

export interface InfernoConverterOptions {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: InfernoConverterOptions = {}) {
  const { rootName = 'slot' } = config;
  const Extension = createExtension(rootName);
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
  convert.Extension = Extension;
  return convert;
}

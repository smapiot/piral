import { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { PiletVue3Api } from './types';
import { createExtension } from './extension';

/**
 * Available configuration options for the Vue@3 plugin.
 */
export interface Vue3Config {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integration of Vue@3.
 */
export function createVue3Api(config: Vue3Config = {}): PiralPlugin<PiletVue3Api> {
  const { rootName, selector } = config;

  return (context) => {
    const convert = createConverter(rootName, selector);
    context.converters.vue3 = ({ root, captured }) => convert(root, captured);

    return {
      fromVue3(root, captured) {
        return {
          type: 'vue3',
          root,
          captured,
        };
      },
      Vue3Extension: createExtension(rootName),
    };
  };
}

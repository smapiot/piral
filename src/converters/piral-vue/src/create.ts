import { PiralPlugin, ExtensionSlotProps } from 'piral-core';
import { createConverter } from './converter';
import { PiletVueApi } from './types';
import { createExtension } from './extension';

/**
 * Available configuration options for the Vue plugin.
 */
export interface VueConfig {
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
 * Creates new Pilet API extensions for integration of Vue.
 */
export function createVueApi(config: VueConfig = {}): PiralPlugin<PiletVueApi> {
  const { rootName, selector } = config;

  return (context) => {
    const convert = createConverter(rootName);
    context.converters.vue = ({ root, captured }) => convert(root, captured);

    return {
      fromVue(root, captured) {
        return {
          type: 'vue',
          root,
          captured,
        };
      },
      VueExtension: createExtension(rootName, selector),
    };
  };
}

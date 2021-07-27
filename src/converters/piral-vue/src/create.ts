import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import type { PiletVueApi } from './types';

/**
 * Available configuration options for the Vue plugin.
 */
export interface VueConfig {}

/**
 * Creates new Pilet API extensions for integration of Vue.
 */
export function createVueApi(config: VueConfig = {}): PiralPlugin<PiletVueApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.vue = ({ root, captured }) => convert(root, captured);

    return {
      fromVue(root, captured) {
        return {
          type: 'vue',
          root,
          captured,
        };
      },
      VueExtension: convert.Extension,
    };
  };
}

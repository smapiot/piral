import type { PiralPlugin } from 'piral-core';
import { createConverter, Vue3ConverterOptions } from './converter';
import type { PiletVue3Api } from './types';

/**
 * Available configuration options for the Vue@3 plugin.
 */
export interface Vue3Config extends Vue3ConverterOptions {}

/**
 * Creates new Pilet API extensions for integration of Vue@3.
 */
export function createVue3Api(config: Vue3Config = {}): PiralPlugin<PiletVue3Api> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.vue3 = ({ root, captured }) => convert(root, captured);

    return {
      fromVue3(root, captured) {
        return {
          type: 'vue3',
          root,
          captured,
        };
      },
      Vue3Extension: convert.Extension,
    };
  };
}

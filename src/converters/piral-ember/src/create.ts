import type { PiralPlugin } from 'piral-core';
import { loadEmberApp } from './load';
import { createConverter, EmberConverterOptions } from './converter';
import type { PiletEmberApi } from './types';

/**
 * Available configuration options for the Ember.js plugin.
 */
export interface EmberConfig extends EmberConverterOptions {}

/**
 * Creates Pilet API extensions for integrating Ember.js.
 */
export function createEmberApi(config: EmberConfig = {}): PiralPlugin<PiletEmberApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.ember = ({ App, opts }) => convert(App, opts);

    return {
      fromEmber(App, opts) {
        return {
          type: 'ember',
          App,
          opts,
        };
      },
      loadEmberApp,
      EmberExtension: convert.Extension,
    };
  };
}

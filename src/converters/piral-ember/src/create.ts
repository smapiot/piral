import type { PiralPlugin } from 'piral-core';
import { loadEmberApp } from './load';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletEmberApi } from './types';

/**
 * Available configuration options for the Ember.js plugin.
 */
export interface EmberConfig {
  /**
   * Defines the name of the extension component.
   * @default ember-extension
   */
  selector?: string;
}

/**
 * Creates Pilet API extensions for integrating Ember.js.
 */
export function createEmberApi(config: EmberConfig = {}): PiralPlugin<PiletEmberApi> {
  const { selector } = config;

  return context => {
    const convert = createConverter();
    context.converters.ember = ({ App, opts }) => convert(App, opts);

    createExtension(selector);

    return {
      fromEmber(App, opts) {
        return {
          type: 'ember',
          App,
          opts,
        };
      },
      loadEmberApp,
      EmberExtension: selector,
    };
  };
}

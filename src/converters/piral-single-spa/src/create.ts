import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import type { PiletSingleSpaApi } from './types';

/**
 * Available configuration options for the single-spa plugin.
 */
export interface SingleSpaConfig {}

/**
 * Creates new Pilet API extensions for integration of single-spa microfrontends.
 */
export function createSingleSpaApi(config: SingleSpaConfig = {}): PiralPlugin<PiletSingleSpaApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters['single-spa'] = ({ lifecycle }) => convert(lifecycle);

    return {
      fromSingleSpa(lifecycle) {
        return {
          type: 'single-spa',
          lifecycle,
        };
      },
    };
  };
}

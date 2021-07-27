import type { PiralPlugin } from 'piral-core';
import { createConverter, SvelteConverterOptions } from './converter';
import type { PiletSvelteApi } from './types';

/**
 * Available configuration options for the Svelte plugin.
 */
export interface SvelteConfig extends SvelteConverterOptions {}

/**
 * Creates new Pilet API extensions for integration of Svelte.
 */
export function createSvelteApi(config: SvelteConfig = {}): PiralPlugin<PiletSvelteApi> {
  return (context) => {
    const convert = createConverter(config);
    context.converters.svelte = ({ Component, captured }) => convert(Component, captured);

    return {
      fromSvelte(Component, captured) {
        return {
          type: 'svelte',
          Component,
          captured,
        };
      },
      SvelteExtension: convert.Extension,
    };
  };
}

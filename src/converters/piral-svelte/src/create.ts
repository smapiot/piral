import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletSvelteApi } from './types';

/**
 * Available configuration options for the Svelte plugin.
 */
export interface SvelteConfig {
  /**
   * Defines the name of the extension component.
   * @default svelte-extension
   */
  selector?: string;
}

/**
 * Creates new Pilet API extensions for integration of Svelte.
 */
export function createSvelteApi(config: SvelteConfig = {}): PiralPlugin<PiletSvelteApi> {
  const { selector } = config;

  return context => {
    const convert = createConverter();
    context.converters.svelte = ({ Component, captured }) => convert(Component, captured);

    createExtension(selector);

    return {
      fromSvelte(Component, captured) {
        return {
          type: 'svelte',
          Component,
          captured,
        };
      },
      SvelteExtension: selector,
    };
  };
}

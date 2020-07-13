import { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { PiletSvelteApi } from './types';

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
  const { selector = 'svelte-extension' } = config;

  if ('customElements' in window) {
    class SvelteExtension extends HTMLElement {
      connectedCallback() {
        if (this.isConnected) {
          this.dispatchEvent(
            new CustomEvent('render-html', {
              bubbles: true,
              detail: {
                target: this,
                props: {
                  name: this.getAttribute('name'),
                },
              },
            }),
          );
        }
      }
    }

    customElements.define(selector, SvelteExtension);
  }

  return context => {
    const convert = createConverter();
    context.converters.svelte = ({ Component, captured }) => convert(Component, captured);

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

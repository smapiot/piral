import { PiralPlugin } from 'piral-core';
import { loadEmberApp } from './load';
import { createConverter } from './converter';
import { PiletEmberApi } from './types';

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
  const { selector = 'ember-extension' } = config;

  if ('customElements' in window) {
    class EmberExtension extends HTMLElement {
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

    customElements.define(selector, EmberExtension);
  }

  return context => {
    const convert = createConverter();
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
      EmberExtension: selector,
    };
  };
}

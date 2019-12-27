import { Extend } from 'piral-core';
import { loadEmberApp } from './load';
import { PiletEmberApi, EmberInstance } from './types';

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
export function createEmberApi(config: EmberConfig = {}): Extend<PiletEmberApi> {
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
    context.converters.ember = ({ App, opts }) => {
      let app: EmberInstance<any> = undefined;

      return {
        mount(rootElement, props, ctx) {
          rootElement.addEventListener(
            'render-html',
            (ev: CustomEvent) => {
              const { piral } = props;
              piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
            },
            false,
          );
          app = App.create({
            ...opts,
            rootElement,
            props,
            ctx,
          });
        },
        update(_, props, ctx) {
          app.setProperties({
            props,
            ctx,
          });
        },
        unmount(rootElement) {
          app.destroy();
          app = undefined;
          rootElement.innerHTML = '';
        },
      };
    };

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

import { Extend } from 'piral-core';
import { PiletEmberApi, EmberInstance } from './types';

/**
 * Available configuration options for the Ember.js plugin.
 */
export interface EmberConfig {}

/**
 * Creates Pilet API extensions for integrating Ember.js.
 */
export function createEmberApi(_config: EmberConfig = {}): Extend<PiletEmberApi> {
  return context => {
    context.converters.ember = ({ App, opts }) => {
      let app: EmberInstance<any> = undefined;

      return {
        mount(rootElement, props, ctx) {
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
      EmberExtension: undefined,
    };
  };
}

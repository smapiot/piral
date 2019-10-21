import { Extend } from 'piral-core';
import { mount, register } from './mount';
import { PiletVueApi } from './types';

/**
 * Available configuration options for the Vue extension.
 */
export interface VueConfig {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates a new set of Piral Vue API extensions.
 */
export function createVueApi(config: VueConfig = {}): Extend<PiletVueApi> {
  const { rootName = 'slot', selector = 'extension-component' } = config;

  return context => {
    context.converters.vue = ({ root }) => {
      return (parent, props, ctx) => {
        const el = parent.appendChild(document.createElement(rootName));
        const piral = props && props.piral;

        if (piral) {
          register(selector, piral.VueExtension);
        }

        return mount(el, root, props, ctx);
      };
    };

    return api => ({
      VueExtension: {
        functional: false,
        props: ['name', 'empty', 'render', 'params'],
        render(createElement) {
          return createElement(rootName);
        },
        mounted() {
          api.renderHtmlExtension(this.$el, {
            empty: this.empty,
            params: this.params,
            render: this.render,
            name: this.name,
          });
        },
      },
    });
  };
}

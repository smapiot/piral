import { Extend, ExtensionSlotProps } from 'piral-core';
import { Component } from 'vue';
import { mountVue, register } from './mount';
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

  const VueExtension: Component<ExtensionSlotProps> = {
    functional: false,
    props: ['name', 'empty', 'render', 'params'],
    inject: ['piral'],
    render(createElement) {
      return createElement(rootName);
    },
    mounted() {
      this.piral.renderHtmlExtension(this.$el, {
        empty: this.empty,
        params: this.params,
        render: this.render,
        name: this.name,
      });
    },
  };

  register(selector, VueExtension);

  return context => {
    context.converters.vue = ({ root }) => {
      let instance: any = undefined;

      return {
        mount(parent, data, ctx) {
          const el = parent.appendChild(document.createElement(rootName));
          instance = mountVue(el, root, data, ctx);
        },
        update(_, data) {
          for (const prop in data) {
            instance[prop] = data[prop];
          }
        },
        unmount(el) {
          instance.$destroy();
          el.innerHTML = '';
          instance = undefined;
        },
      };
    };

    return {
      fromVue(root) {
        return {
          type: 'vue',
          root,
        };
      },
      VueExtension,
    };
  };
}

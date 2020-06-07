import { Extend, ExtensionSlotProps } from 'piral-core';
import { Component } from 'vue';
import { register } from './mount';
import { createConverter } from './converter';
import { PiletVueApi } from './types';

/**
 * Available configuration options for the Vue plugin.
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
 * Creates new Pilet API extensions for integration of Vue.
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
    const convert = createConverter(rootName);
    context.converters.vue = ({ root, captured }) => convert(root, captured);

    return {
      fromVue(root, captured) {
        return {
          type: 'vue',
          root,
          captured,
        };
      },
      VueExtension,
    };
  };
}

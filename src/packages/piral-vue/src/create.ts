import { Extend } from 'piral-core';
import { mount } from './mount';
import { PiletVueApi } from './types';

/**
 * Creates a new set of Piral Vue API extensions.
 */
export function createVueApi(): Extend<PiletVueApi> {
  return context => {
    context.converters.vue = ({ root }) => (el, props, ctx) => mount(el, root, props, ctx);

    return api => ({
      VueExtension: {
        functional: false,
        props: ['name', 'empty', 'render', 'params'],
        render(createElement) {
          return createElement('slot');
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

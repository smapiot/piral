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
      getVueExtension(name) {
        const render = api.getHtmlExtension(name);
        return {
          functional: true,
          mounted() {
            const props = {
              empty: this.empty,
              params: this.params,
              render: this.render,
            };
            render(this.$el, props, {});
          },
        };
      },
    });
  };
}

import Vue, { VueConstructor } from 'vue';
import type { BaseComponentProps, ComponentContext } from 'piral-core';

export function register<T>(name: string, component: Vue.Component<T>) {
  Vue.component(name, component as VueConstructor);
}

export function mountVue<T extends BaseComponentProps>(
  el: HTMLElement,
  root: Vue.Component<T>,
  props: T,
  ctx: ComponentContext,
  captured?: Record<string, any>,
) {
  return new Vue({
    el,
    provide: {
      piral: props.piral,
      ...ctx,
    },
    render(h) {
      return h(root, {
        props: {
          ...captured,
          ...props,
        },
      });
    },
  });
}

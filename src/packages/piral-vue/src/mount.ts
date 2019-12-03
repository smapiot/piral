import Vue, { VueConstructor } from 'vue';
import { BaseComponentProps } from 'piral-core';

export function register<T>(name: string, component: Vue.Component<T>) {
  Vue.component(name, component as VueConstructor);
}

export function mountVue<T extends BaseComponentProps>(el: HTMLElement, root: Vue.Component<T>, props: T, ctx: any) {
  return new Vue({
    el,
    data: ctx,
    provide: {
      piral: props.piral,
    },
    render(h) {
      return h(root, {
        props,
      });
    },
  });
}

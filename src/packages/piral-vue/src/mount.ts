import Vue from 'vue';

export function mount<T>(el: HTMLElement, root: Vue.FunctionalComponentOptions<T>, props: T, ctx: any) {
  new Vue({
    el,
    data: ctx,
    render(h) {
      return h(root, {
        props,
      });
    },
  });
}

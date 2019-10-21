import Vue from 'vue';

export function register<T extends Vue>(name: string, component: Vue.VueConstructor<T>) {
  Vue.component(name, component);
}

export function mount<T>(el: HTMLElement, root: Vue.Component<T>, props: T, ctx: any) {
  const vue = new Vue({
    el,
    data: ctx,
    render(h) {
      return h(root, {
        props,
      });
    },
  });

  return vue;
}

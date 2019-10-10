import Vue from 'vue';

export function mount<T>(parent: HTMLElement, root: Vue.Component<T>, props: T, ctx: any) {
  const el = parent.appendChild(document.createElement('slot'));
  return new Vue({
    el,
    data: ctx,
    render(h) {
      return h(root, {
        props,
      });
    },
  });
}

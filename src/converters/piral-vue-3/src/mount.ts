import type { BaseComponentProps, ComponentContext } from 'piral-core';
import { createApp, Component, h } from 'vue';

export function mountVue<T extends BaseComponentProps>(component: Component<T>, props: T, ctx: ComponentContext) {
  const root: Component = {
    provide: {
      piral: props.piral,
      ...ctx,
    },
    render() {
      return h(component, props);
    },
  };

  return createApp(root);
}

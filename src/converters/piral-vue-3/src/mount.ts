import type { BaseComponentProps, ComponentContext } from 'piral-core';
import { createApp, Component, h } from 'vue';

export function mountVue<T extends BaseComponentProps>(
  component: Component<T>,
  props: T,
  ctx: ComponentContext,
  captured?: Record<string, any>,
) {
  const data = {
    ...captured,
    ...props,
  };
  const root: Component = {
    provide: {
      piral: props.piral,
      ...ctx,
    },
    props: Object.keys(data),
    render() {
      return h(component, this.$props);
    },
  };

  return createApp(root, data);
}

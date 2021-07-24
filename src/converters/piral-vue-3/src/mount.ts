import { createApp, Component, h } from 'vue';
import { BaseComponentProps, ComponentContext } from 'piral-core';

export function mountVue<T extends BaseComponentProps>(
  root: Component<T>,
  props: T,
  ctx: ComponentContext,
  captured?: Record<string, any>,
) {
  return createApp({
    provide: {
      piral: props.piral,
      ...ctx,
    },
    render() {
      return h(root, {
        ...captured,
        ...props,
      });
    },
  });
}

import type { BaseComponentProps, ComponentContext } from 'piral-core';
import { createApp, Component, h } from 'vue';

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
      return h(root as any, {
        ...captured,
        ...props,
      });
    },
  });
}

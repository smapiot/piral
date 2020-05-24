import * as m from 'mithril';
import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component } from './types';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(
    component: Component<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    return {
      mount(el, props, ctx) {
        m.mount(el, {
          view: () =>
            m(component, {
              ...captured,
              ...ctx,
              ...props,
            }),
        });
      },
      update(el, props, ctx) {
        m.mount(el, {
          view: () =>
            m(component, {
              ...captured,
              ...ctx,
              ...props,
            }),
        });
      },
      unmount(el) {
        // tslint:disable-next-line:no-null-keyword
        m.mount(el, null);
      },
    };
  };

  return convert;
}

import * as mithril from 'mithril';
import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { createExtension } from './extension';
import type { Component } from './types';

export interface MithrilConverterOptions {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: MithrilConverterOptions = {}) {
  const { rootName = 'slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(
    component: Component<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => ({
    mount(el, props, ctx) {
      mithril.mount(el, {
        view: () =>
          mithril.m(component, {
            ...captured,
            ...ctx,
            ...props,
          }),
      });
    },
    update(el, props, ctx) {
      mithril.mount(el, {
        view: () =>
          mithril.m(component, {
            ...captured,
            ...ctx,
            ...props,
          }),
      });
    },
    unmount(el) {
      // tslint:disable-next-line:no-null-keyword
      mithril.mount(el, null);
    },
  });
  convert.Extension = Extension;
  return convert;
}

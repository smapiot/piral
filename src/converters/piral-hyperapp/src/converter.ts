import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { mountHyperapp } from './mount';
import { createExtension } from './extension';
import type { Component } from './types';

export interface HyperappConverterOptions {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: HyperappConverterOptions = {}) {
  const { rootName = 'slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(
    root: Component<TProps>,
    state: any,
    actions: any,
  ): ForeignComponent<TProps> => {
    return {
      mount(el, props, ctx) {
        const { piral } = props;
        el.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            ev.stopPropagation();
            piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          },
          false,
        );
        mountHyperapp(el, root, props, ctx, state, actions);
      },
      unmount(el) {
        el.innerHTML = '';
      },
    };
  };
  convert.Extension = Extension;
  return convert;
}

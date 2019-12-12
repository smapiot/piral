import * as m from 'mithril';
import { Extend } from 'piral-core';
import { PiletMithrilApi } from './types';

/**
 * Available configuration options for the Mithril.js plugin.
 */
export interface MithrilConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Mithril.js.
 */
export function createMithrilApi(config: MithrilConfig = {}): Extend<PiletMithrilApi> {
  const { rootName = 'slot' } = config;

  return context => {
    context.converters.mithril = ({ component }) => ({
      mount(el, props) {
        m.mount(el, { view: () => m(component, props) });
      },
      update(el, props) {
        m.mount(el, { view: () => m(component, props) });
      },
      unmount(el) {
        // tslint:disable-next-line:no-null-keyword
        m.mount(el, null);
      },
    });

    return api => ({
      fromMithril(component) {
        return {
          type: 'mithril',
          component,
        };
      },
      MithrilExtension: {
        oncreate(vnode) {
          api.renderHtmlExtension(vnode.dom, vnode.attrs);
        },
        view() {
          return m(rootName);
        },
      },
    });
  };
}

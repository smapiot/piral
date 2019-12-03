import { Extend, ExtensionSlotProps } from 'piral-core';
import { Component } from 'lit-element';
import { PiletLitElApi } from './types';

/**
 * Available configuration options for the Lit Element plugin.
 */
export interface LitElConfig {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integration of Lit Element.
 */
export function createLitElApi(config: LitElConfig = {}): Extend<PiletLitElApi> {
  const { rootName = 'slot', selector = 'extension-component' } = config;

  const LitElExtension: Component<ExtensionSlotProps> = {
    functional: false,
    props: ['name', 'empty', 'render', 'params'],
    inject: ['piral'],
    render(createElement) {
      return createElement(rootName);
    },
    mounted() {
      this.piral.renderHtmlExtension(this.$el, {
        empty: this.empty,
        params: this.params,
        render: this.render,
        name: this.name,
      });
    },
  };

  return context => {
    context.converters.litel = ({ root }) => {
      let instance: any = undefined;

      return {
        mount(parent, data, ctx) {
          const el = parent.appendChild(document.createElement(rootName));
          instance = mountVue(el, root, data, ctx);
        },
        update(_, data) {
          for (const prop in data) {
            instance[prop] = data[prop];
          }
        },
        unmount(el) {
          instance.$destroy();
          el.innerHTML = '';
          instance = undefined;
        },
      };
    };

    return {
      fromLitEl(component) {
        return {
          type: 'litel',
          component,
        };
      },
      LitElExtension,
    };
  };
}

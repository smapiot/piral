import { Extend, BaseComponentProps } from 'piral-core';
import { LitElement, property, customElement } from 'lit-element';
import { PiletLitElApi } from './types';

/**
 * Available configuration options for the LitElement plugin.
 */
export interface LitElConfig {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
}

/**
 * Creates new Pilet API extensions for integration of LitElement.
 */
export function createLitElApi(config: LitElConfig = {}): Extend<PiletLitElApi> {
  const { selector = 'extension-component' } = config;

  @customElement(selector)
  class LitElExtension extends LitElement {
    @property() name: string;
    @property() params: any;
    @property() onEmpty: () => any;
    @property() onRender: () => any;

    render() {
      return undefined;
    }

    updated() {
      this.dispatchEvent(
        new CustomEvent('render-html', {
          bubbles: true,
          detail: {
            target: this.shadowRoot,
            props: {
              empty: this.onEmpty,
              render: this.onRender,
              params: this.params,
              name: this.name,
            },
          },
        }),
      );
    }
  }

  return context => {
    context.converters.litel = ({ elementName }) => {
      return {
        mount(parent, data, ctx) {
          const { piral } = data as BaseComponentProps;
          const el = parent.appendChild(document.createElement(elementName));
          el.setAttribute('name', elementName);
          el.setAttribute('props', data);
          el.setAttribute('ctx', ctx);
          el.addEventListener(
            'render-html',
            (ev: CustomEvent) => {
              piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
            },
            false,
          );
        },
        unmount(el) {
          el.innerHTML = '';
        },
      };
    };

    return {
      fromLitEl(elementName) {
        return {
          type: 'litel',
          elementName,
        };
      },
    };
  };
}

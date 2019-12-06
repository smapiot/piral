import { Extend, BaseComponentProps } from 'piral-core';
import { LitElement, property, customElement } from 'lit-element';
import { PiletLitElApi } from './types';

/**
 * Available configuration options for the LitElement plugin.
 */
export interface LitElConfig {
  /**
   * Defines the name of the extension component.
   * @default litel-extension
   */
  selector?: string;
}

/**
 * Creates new Pilet API extensions for integration of LitElement.
 */
export function createLitElApi(config: LitElConfig = {}): Extend<PiletLitElApi> {
  const { selector = 'litel-extension' } = config;

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
          el.setAttribute('props', JSON.stringify(data));
          el.setAttribute('ctx', JSON.stringify(ctx));
          el.shadowRoot.addEventListener(
            'render-html',
            (ev: CustomEvent) => {
              piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
            },
            false,
          );
        },
        update(parent, data, ctx) {
          const el = parent.querySelector(elementName);

          if (el) {
            el.setAttribute('props', JSON.stringify(data));
            el.setAttribute('ctx', JSON.stringify(ctx));
          }
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

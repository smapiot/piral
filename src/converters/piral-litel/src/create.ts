import { PiralPlugin } from 'piral-core';
import { LitElement, property, customElement } from 'lit-element';
import { createConverter } from './converter';
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
export function createLitElApi(config: LitElConfig = {}): PiralPlugin<PiletLitElApi> {
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
    const convert = createConverter();
    context.converters.litel = ({ elementName }) => convert(elementName);

    return {
      fromLitEl(elementName) {
        return {
          type: 'litel',
          elementName,
        };
      },
      LitElExtension: selector,
    };
  };
}

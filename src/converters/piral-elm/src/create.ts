import { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { PiletElmApi } from './types';

/**
 * Available configuration options for the Elm plugin.
 */
export interface ElmConfig {
  /**
   * Defines the name of the extension component.
   * @default elm-extension
   */
  selector?: string;
}

/**
 * Creates new Pilet API extensions for integration of Elm.
 */
export function createElmApi(config: ElmConfig = {}): PiralPlugin<PiletElmApi> {
  const { selector = 'elm-extension' } = config;

  if ('customElements' in window) {
    class ElmExtension extends HTMLElement {
      connectedCallback() {
        if (this.isConnected) {
          this.dispatchEvent(
            new CustomEvent('render-html', {
              bubbles: true,
              detail: {
                target: this,
                props: {
                  name: this.getAttribute('name'),
                },
              },
            }),
          );
        }
      }
    }

    customElements.define(selector, ElmExtension);
  }

  return context => {
    const convert = createConverter();
    context.converters.elm = ({ main, captured }) => convert(main, captured);

    return {
      fromElm(main, captured) {
        return {
          type: 'elm',
          captured,
          main,
        };
      },
      ElmExtension: selector,
    };
  };
}

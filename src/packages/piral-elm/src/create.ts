import { Extend } from 'piral-core';
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
export function createElmApi(config: ElmConfig = {}): Extend<PiletElmApi> {
  const { selector = 'elm-extension' } = config;

  class ElmExtension extends Element {
    connectedCallback() {
      if (this.isConnected) {
        this.dispatchEvent(
          new CustomEvent('render-html', {
            bubbles: true,
            detail: {
              target: this.shadowRoot,
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

  return context => {
    context.converters.elm = ({ main }) => {
      return {
        mount(parent, data, ctx) {
          const { piral } = data;
          main.init({
            node: parent,
            flags: {
              ...ctx,
              ...data,
            },
          });
          parent.addEventListener(
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
      fromElm(main) {
        return {
          type: 'elm',
          main,
        };
      },
      ElmExtension: selector,
    };
  };
}

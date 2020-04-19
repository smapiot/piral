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
    context.converters.elm = ({ main, captured }) => ({
      mount(parent, data, ctx) {
        const node = parent.appendChild(document.createElement('div'));
        parent.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            const { piral } = data;
            piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          },
          false,
        );
        main.init({
          node,
          flags: {
            ...captured,
            ...ctx,
            ...data,
          },
        });
      },
      unmount(el) {
        el.innerHTML = '';
      },
    });

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

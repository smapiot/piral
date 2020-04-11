import { Extend } from 'piral-core';
import { boot } from './internal';
import { PiletBlazorApi } from './types';

/**
 * Available configuration options for the Blazor plugin.
 */
export interface BlazorConfig {
  /**
   * Defines the name of the extension component.
   * @default blazor-extension
   */
  selector?: string;
}

/**
 * Creates new Pilet API extensions for integration of Blazor.
 */
export function createBlazorApi(config: BlazorConfig = {}): Extend<PiletBlazorApi> {
  const { selector = 'blazor-extension' } = config;

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
    //TODO
    boot();

    context.converters.blazor = ({ module }) => ({
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
        //TODO
      },
      unmount(el) {
        el.innerHTML = '';
      },
    });

    return {
      fromBlazor(module) {
        return {
          type: 'blazor',
          module,
        };
      },
      BlazorExtension: selector,
    };
  };
}

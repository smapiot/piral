import { Extend } from 'piral-core';
import { PiletSvelteApi, SvelteComponentInstance } from './types';

/**
 * Available configuration options for the Svelte plugin.
 */
export interface SvelteConfig {
  /**
   * Defines the name of the extension component.
   * @default svelte-extension
   */
  selector?: string;
}

/**
 * Creates new Pilet API extensions for integration of Svelte.
 */
export function createSvelteApi(config: SvelteConfig = {}): Extend<PiletSvelteApi> {
  const { selector = 'svelte-extension' } = config;

  if ('customElements' in window) {
    class SvelteExtension extends HTMLElement {
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

    customElements.define(selector, SvelteExtension);
  }

  return context => {
    context.converters.svelte = ({ Component }) => {
      let instance: SvelteComponentInstance<any> = undefined;
      return {
        mount(parent, data, ctx) {
          parent.addEventListener(
            'render-html',
            (ev: CustomEvent) => {
              const { piral } = data;
              piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
            },
            false,
          );
          instance = new Component({
            target: parent,
            props: {
              ...ctx,
              ...data,
            },
          });
        },
        update(_, data) {
          Object.keys(data).forEach(key => {
            instance[key] = data[key];
          });
        },
        unmount(el) {
          instance.$destroy();
          el.innerHTML = '';
        },
      };
    };

    return {
      fromSvelte(Component) {
        return {
          type: 'svelte',
          Component,
        };
      },
      SvelteExtension: selector,
    };
  };
}

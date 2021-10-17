import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { createExtension } from './extension';

export interface LitElConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default litel-extension
   */
  selector?: string;
}

export function createConverter(config: LitElConverterOptions = {}) {
  const { selector = 'litel-extension' } = config;
  const Extension = createExtension(selector);
  const convert = <TProps extends BaseComponentProps>(elementName: string): ForeignComponent<TProps> => {
    return {
      mount(parent, data, ctx) {
        const { piral } = data;
        const el = parent.appendChild(document.createElement(elementName));
        el.setAttribute('props', JSON.stringify(data));
        el.setAttribute('ctx', JSON.stringify(ctx));
        el.shadowRoot.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            ev.stopPropagation();
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
  convert.Extension = Extension;
  return convert;
}

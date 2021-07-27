import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { createExtension } from './extension';
import type { SvelteComponentInstance, SvelteModule } from './types';

export interface SvelteConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default svelte-extension
   */
  selector?: string;
}

export function createConverter(config: SvelteConverterOptions = {}) {
  const { selector = 'svelte-extension' } = config;
  const Extension = createExtension(selector);
  const convert = <TProps extends BaseComponentProps>(
    Component: SvelteModule<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    let instance: SvelteComponentInstance<any> = undefined;

    return {
      mount(parent, data, ctx) {
        const { piral } = data;
        parent.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            ev.stopPropagation();
            piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          },
          false,
        );
        instance = new Component({
          target: parent,
          props: {
            ...captured,
            ...ctx,
            ...data,
          },
        });
      },
      update(_, data) {
        Object.keys(data).forEach((key) => {
          instance[key] = data[key];
        });
      },
      unmount(el) {
        instance.$destroy();
        instance = undefined;
        el.innerHTML = '';
      },
    };
  };
  convert.Extension = Extension;
  return convert;
}

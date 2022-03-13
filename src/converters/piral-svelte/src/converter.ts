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

interface SvelteState {
  instance: SvelteComponentInstance<any>;
}

export function createConverter(config: SvelteConverterOptions = {}) {
  const { selector = 'svelte-extension' } = config;
  const Extension = createExtension(selector);
  const convert = <TProps extends BaseComponentProps>(
    Component: SvelteModule<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => ({
    mount(parent, data, ctx, locals: SvelteState) {
      locals.instance = new Component({
        target: parent,
        props: {
          ...captured,
          ...ctx,
          ...data,
        },
      });
    },
    update(el, data, ctx, locals: SvelteState) {
      Object.keys(data).forEach((key) => {
        locals.instance[key] = data[key];
      });
    },
    unmount(el, locals: SvelteState) {
      locals.instance.$destroy();
      locals.instance = undefined;
      el.innerHTML = '';
    },
  });
  convert.Extension = Extension;
  return convert;
}

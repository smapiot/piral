import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { createExtension } from './extension';
import type { ElmModule } from './types';

export interface ElmConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default elm-extension
   */
  selector?: string;
}

export function createConverter(config: ElmConverterOptions = {}) {
  const { selector = 'elm-extension' } = config;
  const Extension = createExtension(selector);
  const convert = <TProps extends BaseComponentProps>(
    main: ElmModule<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    return {
      mount(el, props, ctx) {
        const node = el.appendChild(document.createElement('div'));
        main.init({
          node,
          flags: {
            ...captured,
            ...ctx,
            ...props,
          },
        });
      },
      unmount(el) {
        el.innerHTML = '';
      },
    };
  };
  convert.Extension = Extension;
  return convert;
}

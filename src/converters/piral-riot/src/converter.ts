import * as Riot from 'riot';
import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { createExtension } from './extension';

export interface RiotConverterOptions {
  /**
   * Defines the name of the Riot extension element.
   * @default riot-extension
   */
  extensionName?: string;
}

export function createConverter(config: RiotConverterOptions = {}) {
  const { extensionName = 'riot-extension' } = config;
  const Extension = createExtension(extensionName);
  const convert = <TProps extends BaseComponentProps>(
    component: Riot.RiotComponentShell<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    const mountApp = Riot.component(component);
    let app: Riot.RiotComponent<TProps> = undefined;

    return {
      mount(el, props, ctx) {
        app = mountApp(el, {
          ...captured,
          ...ctx,
          ...props,
        });
      },
      unmount(el) {
        app.unmount(true);
        el.innerHTML = '';
      },
    };
  };
  convert.Extension = Extension;
  return convert;
}

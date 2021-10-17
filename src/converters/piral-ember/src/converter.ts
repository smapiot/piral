import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { createExtension } from './extension';
import type { EmberInstance, EmberModule } from './types';

export interface EmberConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default ember-extension
   */
  selector?: string;
}

export function createConverter(config: EmberConverterOptions = {}) {
  const { selector = 'ember-extension' } = config;

  const Extension = createExtension(selector);

  const convert = <TProps extends BaseComponentProps>(
    App: EmberModule<TProps>,
    opts: any,
  ): ForeignComponent<TProps> => {
    let app: EmberInstance<TProps> = undefined;

    return {
      mount(rootElement, props, ctx) {
        app = App.create({
          ...opts,
          rootElement,
          props,
          ctx,
        });
      },
      update(_, props, ctx) {
        app.setProperties({
          props,
          ctx,
        });
      },
      unmount(rootElement) {
        app.destroy();
        app = undefined;
        rootElement.innerHTML = '';
      },
    };
  };
  convert.Extension = Extension;
  return convert;
}

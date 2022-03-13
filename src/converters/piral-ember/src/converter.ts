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

interface EmberState<TProps> {
  app: EmberInstance<TProps>;
}

export function createConverter(config: EmberConverterOptions = {}) {
  const { selector = 'ember-extension' } = config;

  const Extension = createExtension(selector);

  const convert = <TProps extends BaseComponentProps>(
    App: EmberModule<TProps>,
    opts: any,
  ): ForeignComponent<TProps> => ({
    mount(rootElement, props, ctx, locals: EmberState<TProps>) {
      locals.app = App.create({
        ...opts,
        rootElement,
        props,
        ctx,
      });
    },
    update(rootElement, props, ctx, locals: EmberState<TProps>) {
      locals.app.setProperties({
        props,
        ctx,
      });
    },
    unmount(rootElement, locals: EmberState<TProps>) {
      locals.app.destroy();
      locals.app = undefined;
      rootElement.innerHTML = '';
    },
  });
  convert.Extension = Extension;
  return convert;
}

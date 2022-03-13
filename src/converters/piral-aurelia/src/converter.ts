import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Aurelia } from 'aurelia-framework';
import { initialize } from 'aurelia-pal-browser';
import { DefaultLoader } from './DefaultLoader';
import { createExtension } from './extension';
import type { AureliaModule } from './types';

export interface AureliaConverterOptions {
  /**
   * Defines the name of the root element.
   * @default span
   */
  rootName?: string;
}

interface AureliaLocals {
  aurelia: Aurelia;
}

export function createConverter(config: AureliaConverterOptions = {}) {
  const { rootName = 'span' } = config;

  initialize();

  const Extension = createExtension(rootName);

  const convert = <TProps extends BaseComponentProps>(root: AureliaModule<TProps>): ForeignComponent<TProps> => ({
    mount(el, props, ctx, locals: AureliaLocals) {
      const aurelia = new Aurelia(new DefaultLoader());

      aurelia.use.eventAggregator().history().defaultBindingLanguage().globalResources([Extension]).defaultResources();

      aurelia.container.registerInstance('props', props);
      aurelia.container.registerInstance('ctx', ctx);
      aurelia.container.registerInstance('piral', props.piral);

      aurelia.start().then(() => aurelia.setRoot(root, el));
      locals.aurelia = aurelia;
    },
    update(el, props, ctx, locals: AureliaLocals) {
      locals.aurelia.container.registerInstance('props', props);
      locals.aurelia.container.registerInstance('ctx', ctx);
    },
    unmount(el, locals: AureliaLocals) {
      locals.aurelia = undefined;
    },
  });
  convert.Extension = Extension;
  return convert;
}

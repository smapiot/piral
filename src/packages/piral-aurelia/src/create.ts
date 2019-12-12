import { Extend, ExtensionSlotProps } from 'piral-core';
import { Aurelia } from 'aurelia-framework';
import { initialize } from 'aurelia-pal-browser';
import { PiletAureliaApi } from './types';
import { DefaultLoader } from './DefaultLoader';

/**
 * Available configuration options for the Aurelia plugin.
 */
export interface AureliaConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Aurelia.
 */
export function createAureliaApi(config: AureliaConfig = {}): Extend<PiletAureliaApi> {
  const { rootName = 'slot' } = config;

  return context => {
    context.converters.aurelia = ({ root }) => ({
      mount(el, props, ctx) {
        initialize();
        const aurelia = new Aurelia(new DefaultLoader());
        aurelia.use
          .eventAggregator()
          .history()
          .defaultBindingLanguage()
          .defaultResources();
        aurelia.start().then(() => aurelia.setRoot(root, el));
      },
      update(el, props, ctx) {},
      unmount(el) {},
    });

    return {
      fromAurelia(root) {
        return {
          type: 'aurelia',
          root,
        };
      },
      AureliaExtension: undefined,
    };
  };
}

import { Extend, ExtensionSlotProps, compare } from 'piral-core';
import { Component, createElement } from 'preact';
import { newInstance, Aurelia } from 'aurelia-framework';
import { PiletAureliaApi } from './types';

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
        const aurelia = new Aurelia();
        aurelia.setRoot(root, el);
        aurelia.start();
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

import { Extend, ExtensionSlotProps, compare } from 'piral-core';
import { Component, createElement } from 'preact';
import { PiletMithrilApi } from './types';

/**
 * Available configuration options for the Mithril.js plugin.
 */
export interface MithrilConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Mithril.js.
 */
export function createMithrilApi(config: MithrilConfig = {}): Extend<PiletMithrilApi> {
  const { rootName = 'slot' } = config;

  return context => {
    context.converters.mithril = component => ({
      mount(el, props, ctx) {},
      update(el, props, ctx) {},
      unmount(el) {},
    });

    return {
      fromMithril(root) {
        return {
          type: 'mithril',
          root,
        };
      },
      MithrilExtension: undefined,
    };
  };
}

import { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { PiletCycleApi } from './types';
import { h } from '@cycle/dom';

/**
 * Available configuration options for the Cycle.js plugin.
 */
export interface CycleConfig {
  /**
   * The tag name of the root element into which a CycleExtension is rendered.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integration of Cycle.
 */
export function createCycleApi(config: CycleConfig = {}): PiralPlugin<PiletCycleApi> {
  const { rootName = 'slot' } = config;

  return context => {
    const convert = createConverter();
    context.converters.cycle = ({ root }) => convert(root);

    return api => ({
      fromCycle(root) {
        return {
          type: 'cycle',
          root,
        };
      },
      CycleExtension(props) {
        return h(rootName, {
          hook: {
            insert: vnode => {
              if (vnode.elm instanceof HTMLElement) {
                api.renderHtmlExtension(vnode.elm, props);
              }
            },
          },
        });
      },
    });
  };
}

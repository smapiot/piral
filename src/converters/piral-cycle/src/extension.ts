import { h, VNode } from '@cycle/dom';
import type { PiletApi, ExtensionSlotProps } from 'piral-core';

export interface CycleExtension {
  (props: ExtensionSlotProps<unknown>): VNode;
}

export function createExtension(api: PiletApi, rootName = 'slot'): CycleExtension {
  return props =>
    h(rootName, {
      hook: {
        insert: vnode => {
          if (vnode.elm instanceof HTMLElement) {
            api.renderHtmlExtension(vnode.elm, props);
          }
        },
      },
    });
}

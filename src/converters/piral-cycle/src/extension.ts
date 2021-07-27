import { h, VNode } from '@cycle/dom';
import type { ExtensionSlotProps } from 'piral-core';

export interface CycleExtension {
  (props: ExtensionSlotProps<unknown>): VNode;
}

export function createExtension(rootName: string): CycleExtension {
  return (props) =>
    h(rootName, {
      hook: {
        insert: (vnode) => {
          if (vnode.elm instanceof HTMLElement) {
            vnode.elm.dispatchEvent(
              new CustomEvent('render-html', {
                bubbles: true,
                detail: {
                  target: vnode.elm,
                  props,
                },
              }),
            );
          }
        },
      },
    });
}

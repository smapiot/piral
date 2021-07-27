import type { ExtensionSlotProps } from 'piral-core';
import { createHyperappElement } from './mount';
import type { Component } from './types';

export function createExtension(rootName: string): Component<ExtensionSlotProps> {
  return (props) =>
    createHyperappElement(rootName, {
      oncreate(element: HTMLElement) {
        element.dispatchEvent(
          new CustomEvent('render-html', {
            bubbles: true,
            detail: {
              target: element,
              props,
            },
          }),
        );
      },
    });
}

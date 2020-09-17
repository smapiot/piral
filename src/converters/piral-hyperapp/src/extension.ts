import type { PiletApi, ExtensionSlotProps } from 'piral-core';
import { createHyperappElement } from './mount';
import type { Component } from './types';

export function createExtension(api: PiletApi, rootName = 'slot'): Component<ExtensionSlotProps> {
  return (props) =>
    createHyperappElement(rootName, {
      oncreate(element: HTMLElement) {
        api.renderHtmlExtension(element, props);
      },
    });
}

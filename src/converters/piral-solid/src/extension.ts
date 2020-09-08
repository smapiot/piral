import type { PiletApi, ExtensionSlotProps } from 'piral-core';
import type { Component } from 'solid-js';

export function createExtension(api: PiletApi, rootName = 'slot'): Component<ExtensionSlotProps> {
  return props => {
    const element = document.createElement(rootName);
    setTimeout(() => api.renderHtmlExtension(element, props), 0);
    return element as any;
  };
}

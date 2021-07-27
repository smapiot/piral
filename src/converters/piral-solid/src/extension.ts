import type { ExtensionSlotProps } from 'piral-core';
import type { Component } from 'solid-js';

export function createExtension(rootName: string): Component<ExtensionSlotProps> {
  return (props) => {
    const element = document.createElement(rootName);
    setTimeout(() => {
      element.dispatchEvent(
        new CustomEvent('render-html', {
          bubbles: true,
          detail: {
            target: element,
            props,
          },
        }),
      );
    }, 0);
    return element as any;
  };
}

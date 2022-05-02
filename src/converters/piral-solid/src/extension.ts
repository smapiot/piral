import type { ExtensionSlotProps } from 'piral-core';
import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';

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

    createEffect(() => {
      element.dispatchEvent(
        new CustomEvent('extension-props-changed', {
          detail: {
            name: props.name,
            empty: props.empty,
            params: props.params,
            render: props.render,
          },
        }),
      );
    });

    return element as any;
  };
}

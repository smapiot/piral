import type { ExtensionSlotProps } from 'piral-core';
import type { RiotComponentShell } from 'riot';
import type { TemplateChunk } from '@riotjs/dom-bindings';

export function createExtension(extensionName: string): RiotComponentShell<ExtensionSlotProps> {
  return {
    name: extensionName,
    template() {
      const templateChunk: TemplateChunk = {
        mount(element, scope) {
          element.dispatchEvent(
            new CustomEvent('render-html', {
              bubbles: true,
              detail: {
                target: element,
                props: scope.props,
              },
            }),
          );
          return templateChunk;
        },
        update() {
          return templateChunk;
        },
        unmount() {
          return templateChunk;
        },
        createDOM() {
          return templateChunk;
        },
        clone() {
          return templateChunk;
        },
      };
      return templateChunk;
    },
  };
}

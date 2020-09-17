import type { PiletApi, ExtensionSlotProps } from 'piral-core';
import type { RiotComponentShell } from 'riot';
import type { TemplateChunk } from '@riotjs/dom-bindings';

export function createExtension(
  api: PiletApi,
  extensionName = 'riot-extension',
): RiotComponentShell<ExtensionSlotProps> {
  return {
    name: extensionName,
    template() {
      const templateChunk: TemplateChunk = {
        mount(element, scope) {
          api.renderHtmlExtension(element, scope.props);
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

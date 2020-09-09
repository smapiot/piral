import type { PiletApi, ExtensionSlotProps } from 'piral-core';
import type { RiotComponentShell } from 'riot';

export function createExtension(
  api: PiletApi,
  extensionName = 'riot-extension',
): RiotComponentShell<ExtensionSlotProps> {
  return {
    name: extensionName,
    template() {
      return {
        mount(element, scope) {
          api.renderHtmlExtension(element, scope.props);
        },
        update() {},
        unmount() {},
        createDOM() {
          return this;
        },
        clone() {
          return this;
        },
      };
    },
  };
}

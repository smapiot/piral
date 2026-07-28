import type { ExtensionSlotProps } from 'piral-core';
import { Component } from '@geajs/core';

type GeaExtensionProps = ExtensionSlotProps & {
  piral: {
    renderHtmlExtension(element: HTMLElement, props: ExtensionSlotProps): void;
  };
};

export function createExtension(rootName: string): any {
  class GeaExtension extends Component<GeaExtensionProps> {
    host?: HTMLElement;

    render(parent: Node) {
      if (!this.host) {
        this.host = document.createElement(rootName);
      }

      if (this.host.parentNode !== parent) {
        parent.appendChild(this.host);
      }

      this.host.innerHTML = '';
      this.props.piral.renderHtmlExtension(this.host, this.props);
    }

    dispose() {
      this.host?.remove();
      this.host = undefined;
      super.dispose();
    }
  }

  return GeaExtension;
}

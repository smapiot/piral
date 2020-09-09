import { ExtensionSlotProps, compare } from 'piral-core';
import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { anyPropType } from './mount';

export function createExtension(rootName = 'slot'): Component<ExtensionSlotProps> {
  const InfernoExtension: any = class extends Component<ExtensionSlotProps> {
    static contextTypes = {
      piral: anyPropType,
    };

    private onRefChange = (element: HTMLElement) => {
      if (element) {
        const { piral } = this.context;
        element.innerHTML = '';
        piral.renderHtmlExtension(element, this.props);
      }
    };

    shouldComponentUpdate(nextProps: ExtensionSlotProps) {
      return !compare(this.props, nextProps);
    }

    render() {
      return createElement(rootName, {
        ref: this.onRefChange,
      });
    }
  };

  return InfernoExtension;
}

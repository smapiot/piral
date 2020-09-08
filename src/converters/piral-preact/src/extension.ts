import { ExtensionSlotProps, compare } from 'piral-core';
import { Component, createElement, ComponentType } from 'preact';
import { anyPropType } from './mount';

export function createExtension(rootName = 'slot'): ComponentType<ExtensionSlotProps> {
  class PreactExtension extends Component<ExtensionSlotProps> {
    static contextTypes = {
      piral: anyPropType,
    };

    private onRefChange = (element: any) =>
      setTimeout(() => {
        if (element) {
          const { piral } = this.context;
          element.innerHTML = '';
          piral.renderHtmlExtension(element, this.props);
        }
      }, 0);

    shouldComponentUpdate(nextProps: ExtensionSlotProps) {
      return !compare(this.props, nextProps);
    }

    render() {
      return createElement(rootName, {
        ref: this.onRefChange,
      });
    }
  }

  return PreactExtension;
}

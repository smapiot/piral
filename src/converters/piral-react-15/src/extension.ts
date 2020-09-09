import { ExtensionSlotProps, compare } from 'piral-core';
import { createElement, Component } from 'react-15';
import { anyPropType } from './mount';

export function createExtension(rootName = 'slot') {
  const React15Extension: any = class extends Component<ExtensionSlotProps> {
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

  return React15Extension;
}

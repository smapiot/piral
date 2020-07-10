import { PiralPlugin, ExtensionSlotProps, compare } from 'piral-core';
import { createElement, Component } from 'react-15';
import { anyPropType } from './mount';
import { createConverter } from './converter';
import { PiletReact15Api } from './types';

/**
 * Available configuration options for the React 15.x plugin.
 */
export interface React15Config {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates Pilet API extensions for integrating React 15.x.
 */
export function createReact15Api(config: React15Config = {}): PiralPlugin<PiletReact15Api> {
  const { rootName = 'slot' } = config;

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

  return context => {
    const convert = createConverter();
    context.converters.react15 = ({ root }) => convert(root);

    return {
      fromReact15(root) {
        return {
          type: 'react15',
          root,
        };
      },
      React15Extension,
    };
  };
}

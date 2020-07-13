import { PiralPlugin, ExtensionSlotProps, compare } from 'piral-core';
import { Component, createElement } from 'preact';
import { anyPropType } from './mount';
import { createConverter } from './converter';
import { PiletPreactApi } from './types';

/**
 * Available configuration options for the Preact plugin.
 */
export interface PreactConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Preact.
 */
export function createPreactApi(config: PreactConfig = {}): PiralPlugin<PiletPreactApi> {
  const { rootName = 'slot' } = config;

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

  return context => {
    const convert = createConverter();
    context.converters.preact = ({ root }) => convert(root);

    return {
      fromPreact(root) {
        return {
          type: 'preact',
          root,
        };
      },
      PreactExtension,
    };
  };
}

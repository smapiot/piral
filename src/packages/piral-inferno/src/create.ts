import { Extend, ExtensionSlotProps, compare } from 'piral-core';
import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { mountInferno, unmountInferno, anyPropType } from './mount';
import { PiletInfernoApi } from './types';

/**
 * Available configuration options for the Inferno plugin.
 */
export interface InfernoConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates Pilet API extensions for integrating Inferno.
 */
export function createInfernoApi(config: InfernoConfig = {}): Extend<PiletInfernoApi> {
  const { rootName = 'slot' } = config;

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

  return context => {
    context.converters.inferno = component => ({
      mount(el, props, ctx) {
        mountInferno(el, component.root, props, ctx);
      },
      update(el, props, ctx) {
        mountInferno(el, component.root, props, ctx);
      },
      unmount(el) {
        unmountInferno(el);
      },
    });

    return {
      fromInferno(root) {
        return {
          type: 'inferno',
          root,
        };
      },
      InfernoExtension,
    };
  };
}

import { Extend, ExtensionSlotProps, compare } from 'piral-core';
import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { mount } from './mount';
import { PiletInfernoApi } from './types';

/**
 * Available configuration options for the Inferno extension.
 */
export interface InfernoConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates a new set of Piral Inferno API extensions.
 */
export function createInfernoApi(config: InfernoConfig = {}): Extend<PiletInfernoApi> {
  const { rootName = 'slot' } = config;

  return context => {
    context.converters.inferno = component => {
      return (el, props, ctx) => {
        return mount(el, component.root, props, ctx);
      };
    };

    return api => {
      const InfernoExtension: any = class extends Component<ExtensionSlotProps> {
        private onRefChange = (element: HTMLElement) => {
          if (element) {
            element.innerHTML = '';
            api.renderHtmlExtension(element, this.props);
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
  };
}

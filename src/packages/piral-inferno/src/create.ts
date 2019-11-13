import { Extend, ExtensionSlotProps } from 'piral-core';
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
      class InfernoExtension extends Component<ExtensionSlotProps> {
        render() {
          return createElement(rootName, {
            ref(element: HTMLElement) {
              element && api.renderHtmlExtension(element, this.props);
            },
          });
        }
      }

      return {
        fromInferno(root) {
          return {
            type: 'inferno',
            root,
          };
        },
        InfernoExtension: InfernoExtension as any,
      };
    };
  };
}

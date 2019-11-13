import { Extend, ExtensionSlotProps, compare } from 'piral-core';
import { Component, createElement } from 'preact';
import { mount } from './mount';
import { PiletPreactApi } from './types';

/**
 * Available configuration options for the Preact extension.
 */
export interface PreactConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates a new set of Piral Preact API extensions.
 */
export function createPreactApi(config: PreactConfig = {}): Extend<PiletPreactApi> {
  const { rootName = 'slot' } = config;

  return context => {
    context.converters.preact = component => {
      return (el, props, ctx) => {
        return mount(el, component.root, props, ctx);
      };
    };

    return api => {
      class PreactExtension extends Component<ExtensionSlotProps> {
        private onRefChange = (element: any) =>
          setTimeout(() => {
            if (element) {
              element.innerHTML = '';
              api.renderHtmlExtension(element, this.props);
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
  };
}

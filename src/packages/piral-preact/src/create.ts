import { Extend, ExtensionSlotProps, compare } from 'piral-core';
import { Component, createElement } from 'preact';
import { mountPreact, unmountPreact, anyPropType } from './mount';
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
    context.converters.preact = component => ({
      mount(el, props, ctx) {
        mountPreact(el, component.root, props, ctx);
      },
      update(el, props, ctx) {
        mountPreact(el, component.root, props, ctx);
      },
      unmount(el) {
        unmountPreact(el);
      },
    });

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

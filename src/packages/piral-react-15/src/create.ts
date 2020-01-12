import { Extend, ExtensionSlotProps, compare } from 'piral-core';
import { createElement, Component } from 'react-15';
import { mountReact15, unmountReact15, anyPropType } from './mount';
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
export function createReact15Api(config: React15Config = {}): Extend<PiletReact15Api> {
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
    context.converters.react15 = component => ({
      mount(el, props, ctx) {
        mountReact15(el, component.root, props, ctx);
      },
      update(el, props, ctx) {
        mountReact15(el, component.root, props, ctx);
      },
      unmount(el) {
        unmountReact15(el);
      },
    });

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

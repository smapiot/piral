import { PiralPlugin } from 'piral-core';
import { inlineView, customElement, bindable } from 'aurelia-framework';
import { createConverter } from './converter';
import { PiletAureliaApi } from './types';

/**
 * Available configuration options for the Aurelia plugin.
 */
export interface AureliaConfig {
  /**
   * Defines the name of the root element.
   * @default span
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Aurelia.
 */
export function createAureliaApi(config: AureliaConfig = {}): PiralPlugin<PiletAureliaApi> {
  const { rootName = 'span' } = config;

  return context => {
    const convert = createConverter();
    context.converters.aurelia = ({ root }) => convert(root);

    return api => {
      @customElement('extension-component')
      @inlineView(`
      <template>
        <${rootName} ref="host"></${rootName}>
      <template>`)
      class AureliaExtension {
        private host: HTMLElement;
        @bindable() private name: string;
        @bindable() private render: any;
        @bindable() private empty: any;
        @bindable() private params: any;

        attached() {
          api.renderHtmlExtension(this.host, {
            name: this.name,
            render: this.render,
            empty: this.empty,
            params: this.params,
          });
        }
      }

      return {
        fromAurelia(root) {
          return {
            type: 'aurelia',
            root,
          };
        },
        AureliaExtension,
      };
    };
  };
}

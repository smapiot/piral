import { Extend } from 'piral-core';
import { Aurelia, inlineView, customElement, bindable } from 'aurelia-framework';
import { initialize } from 'aurelia-pal-browser';
import { DefaultLoader } from './DefaultLoader';
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
export function createAureliaApi(config: AureliaConfig = {}): Extend<PiletAureliaApi> {
  const { rootName = 'span' } = config;

  return context => {
    initialize();

    context.converters.aurelia = ({ root }) => {
      let aurelia: Aurelia = undefined;

      return {
        mount(el, props, ctx) {
          const { piral } = props;

          aurelia = new Aurelia(new DefaultLoader());

          aurelia.use
            .eventAggregator()
            .history()
            .defaultBindingLanguage()
            .globalResources([piral.AureliaExtension])
            .defaultResources();

          aurelia.container.registerInstance('props', props);
          aurelia.container.registerInstance('ctx', ctx);

          aurelia.start().then(() => aurelia.setRoot(root, el));
        },
        update(_, props, ctx) {
          aurelia.container.registerInstance('props', props);
          aurelia.container.registerInstance('ctx', ctx);
        },
        unmount() {
          aurelia = undefined;
        },
      };
    };

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

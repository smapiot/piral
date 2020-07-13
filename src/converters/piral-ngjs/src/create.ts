import * as angular from 'angular';
import { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { PiletNgjsApi } from './types';

/**
 * Available configuration options for the Angular.js plugin.
 */
export interface NgjsConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates the Pilet API extensions for Angular.js.
 */
export function createNgjsApi(config: NgjsConfig = {}): PiralPlugin<PiletNgjsApi> {
  const { rootName = 'slot' } = config;

  const NgjsExtension = angular.module(`piralExtension`, []);
  NgjsExtension.component('extensionComponent', {
    template: `<${rootName}></${rootName}>`,
    bindings: {
      empty: '<',
      params: '<',
      render: '<',
      name: '@',
    },
    controller: [
      '$element',
      'piral',
      function($element, piral) {
        this.$onInit = () => {
          const container = $element[0].querySelector(rootName);
          piral.renderHtmlExtension(container, {
            empty: this.empty,
            params: this.params,
            render: this.render,
            name: this.name,
          });
        };
      },
    ],
  });

  return context => {
    const convert = createConverter();
    context.converters.ngjs = ({ name, root }) => convert(name, root);

    return {
      NgjsExtension,
      fromNgjs(name, root) {
        return {
          type: 'ngjs',
          name,
          root,
        };
      },
    };
  };
}

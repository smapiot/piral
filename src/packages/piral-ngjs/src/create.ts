import * as angular from 'angular';
import { Extend } from 'piral-core';
import { PiletNgjsApi } from './types';

/**
 * Available configuration options for the Angular.js extension.
 */
export interface NgjsConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates a new set of Piral Angular.js API extensions.
 */
export function createNgjsApi(config: NgjsConfig = {}): Extend<PiletNgjsApi> {
  const { rootName = 'slot' } = config;

  return context => {
    context.converters.ngjs = ({ name, root }) => {
      return (element, props) => {
        //const rootScope = angular.injector(['ng', root.name]).get('$rootScope');
        element.appendChild(document.createElement(name));
        root.value('props', props);
        angular.bootstrap(element, [[root.name]]);
        //this.$rootScope.$destroy();
      };
    };

    return (api, meta) => {
      const ngjsModule = angular.module(`${meta.name}:extension`, []);
      ngjsModule.component('extension-component', {
        template: `<${rootName}></${rootName}>`,
        bindings: {
          empty: '<',
          params: '<',
          render: '<',
          name: '@',
        },
        controller: [
          '$element',
          function($element) {
            this.$onInit = () => {
              const container = $element[0].querySelector(rootName);
              api.renderHtmlExtension(container, {
                empty: this.empty,
                params: this.params,
                render: this.render,
                name: this.name,
              });
            };
          },
        ],
      });

      return {
        NgjsExtension: ngjsModule,
        fromNgjs(name, root) {
          return {
            type: 'ngjs',
            name,
            root,
          };
        },
      };
    };
  };
}

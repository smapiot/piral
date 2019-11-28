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
    context.converters.ngjs = ({ name, root }) => {
      let injector: any = undefined;

      return {
        mount(el, props, ctx) {
          el.appendChild(document.createElement(name));
          root.value('props', props);
          root.value('piral', props.piral);
          root.value('ctx', ctx);
          injector = angular.bootstrap(el, [root.name]);
        },
        unmount(el) {
          const rootScope = injector.get('$rootScope');
          rootScope.$destroy();
          injector = undefined;
        },
      };
    };

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

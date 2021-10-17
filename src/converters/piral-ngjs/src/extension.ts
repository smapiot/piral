import * as angular from 'angular';

export function createExtension(rootName: string): angular.IModule {
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
      function ($element, piral) {
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
  return NgjsExtension;
}
